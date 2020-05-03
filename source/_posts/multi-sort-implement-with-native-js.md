---
title: 纯JS实现按多列排序
date: 2020-05-03 16:34:22
author: Troy 
tags: 
- js
- web前端
categories:
- Web
---

### 重要的事情还是要说的
项目里没引用 **lodash** （因为和 underscore.js 冲突）

### 问题
数据结构类似这种：
```
const testData = [
  { name: '1', primary: true, startDate: '2018-01-01T08:00:00Z', endDate: '2018-05-01T08:00:00Z' },
  { name: 'A', primary: true, startDate: '2018-02-01T08:00:00Z', endDate: '2018-06-01T08:00:00Z' },
  { name: 'a', primary: true, startDate: '2019-02-01T08:00:00Z', endDate: '2019-05-01T08:00:00Z' },
  { name: 'b', primary: false, startDate: '2019-02-01T08:00:00Z', endDate: '2019-02-01T08:00:00Z' },
]
```
最近项目中有大量的对排序的新需求，由其是按多列来排序， 新需求大致如下：

- Archived 为true的排列到最后，否则排最前面
- 然后，按照 StartDate 时间，如果最新，则排前面
- 然后，如果 StartDate 相同，则按照 EndDate 来排，
- 然后，如果 EndDate 也相同，则按照 name 的字母表的顺序排


同时呢，之前项目中也有很多类似的需求：

- 先按照 ModifiedDate 排，
- 如果相同，则按 name 字母表顺序

或者
- Primary 为true 的排前面
- 如果Primary 相同， 按照 name 字母表排序

还有更多的类似需求，我们项目里原来有个 Sort.js 的公共方法来处理这些排序，选取了其中最长的一个 (其实上面需求的每一个实现都和这个差不多)
```
const sortFlattenPrograms = (flattenPrograms) =>
    flattenPrograms.sort((a, b) => {
      // first sort by archived: unarchived first
      if(a.archived && !b.archived) {
        return 1;
      } else if(!a.archived && b.archived) {
        return -1;
      }

      // sort by start date: latest first
      let dateCompareResult = compareDateLatestFirst(a.startDate, b.startDate);
      if(dateCompareResult !== 0) {
        return dateCompareResult;
      }

      // sort by end date: latest first
      dateCompareResult = compareDateLatestFirst(a.endDate, b.endDate);
      if(dateCompareResult !== 0) {
        return dateCompareResult;
      }

      // sort by program name - location name: alphabetically (ignore case)
      const nameCompareResult = compareStringAlphabeticallyIgnoreCase(getProgramFullName(a), getProgramFullName(b));
      if(nameCompareResult !== 0) {
        return nameCompareResult;
      }

      return 0;
    });
```

是不是很长，很丑，而且这只是一个排序，还有很多这种和0比较，然后再比较，所以继续加下去肯定不可取，维护是个很大的问题，UT 也很难写，要是能抽出中间部分就好了？？？

### 解决办法
先贴代码，其实核心就是抽取上面的各种comparator， 并且采用链式的方式执行，这里使用reduce方法来取了个巧，其实，查看了lodash的实现后， 他们采用的是 while 实现。

注意排序的顺序，是按照从右到左，我想的是尽量和 **functional programming** 的方式来写，并且compose 方法在lodash 里也是这个顺序，如果想改为从左往右，只需要将 **reduce** 改为 **reduceRight** 即可
```
/**
   * Sort by order list from right to left
   * For example: we want to order by start date, if date equal, then order by end date, if equal, then name
   * composeOrderBy([oderByName, orderByEndDate, orderByStartDate])
   * @param {*} comparators
   */
  const composeOrderBy = (comparators) => {
    const makeChainedComparator = (first, next) => {
      return function (a, b) {
        var result = first(a, b);
        if(result !== 0) return result;
        return next(a, b);
      };
    };
    return comparators.reduce(function (chained, first) {
      return makeChainedComparator(first, chained);
    });
  };
```

所以，上面的需求可以简单改为下面，其实comparators 是一个我预先定义好的各种比较方法
```
// 预先定义的方法
comparators = {
  compareStringField: (field, ignoreCase = true)=> (a, b) => { ... },
  compareBoolField: (field, trueFirst = true) => (a, b) => { ... },
  compareDateLatestFirst: (field) => (a, b) => { ... },
}

data.sort(composeOrderBy([
        comparators.compareNameIgnoreCase(),
        comparators.compareDateLatestFirst('endDate'),
        comparators.compareDateLatestFirst('startDate'),
        comparators.compareBoolField('archived', false)
      ]));

data.sort(composeOrderBy([
        comparators.compareNameIgnoreCase(),
        comparators.compareDateLatestFirst('modifiedDate')
      ]));
```

最终还是需要用到 array的sort 方法，但由于这不是纯函数，所以保险的做法就是调用sort前，先在clone一下