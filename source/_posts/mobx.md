---
layout: post
title: Mobx在项目中的实践 及 与Redux的比较
date: 2020-12-20T14:03:17.710Z
tags:
  - js
  - react
categories:
  - web
excerpt: ''
comments: true
---

之前在公司FEE内部做过一次技术分享，主要关于Mobx在项目中的使用一年后的体验以及和Redux 的一些比较（因为我们项目之前的状态管理选型选择的是mobx，而其他项目组的同学选择主要是Redux或者还在纠结如何选）。

以下都是根据查询各种资料后的个人理解概览

## Mobx Overview
> Mobx looks like a properties tracking and reaction lib.   
> 基础部分就省了，只说结论：Mobx 看起来是属性追踪及作出相应反应的库，和Redux 不一样的是，他的状态是mutable的。
### Mobx 4 & 5
* Mobx 4 Limitations (Observable)
* Mobx 5 Proxy based (Only ES 6 Browser, no polyfill)

## Mobx & Third-Party view lib
* mobx & mobx-react
* redux & react-redux
* mobx & mobx-arch & mobx-backbone 有吗???

Mobx 是可以单独使用的，这点和Redux一样，可以不需要依赖于任何UI 库像，React, Vue，当然如果把他们结合到一起，那才能发挥出最大的作用，所以就理所应当的有mobx-react。

我们公司内部有个UI 库叫arch，很老的了，requirejs时代的，比react, vue, angular还早，没有响应式的更新，核心只有一个render 方法，所以其实可以通过Mobx 简单改造为响应式的，一旦外部属性发生变化，就会触发重新渲染，至于内部状态嘛，呵呵，不考虑了，反正这只是个例子。
```
var { observable, autorun } = require("mobx");
var Entity = require('xx/xxxx/entity');

var todoStore = observable({
  todos: [],
  get completedCount() {
    return this.todos.filter(todo => todo.completed).length
  }
})

autorun(function () {
  // For Backbone
  this.xxxBackBoneComponent = new Entity({
    model: todoStore.todos,
    editable: true
  });

  // For Arch
  active.render($html, () => {
    this.xxArchComponent = arch.getComponent(xxx);
  });
})

todoStore.todos[0] = {
  title: "Take a walk",
  completed: false
}
```

## Mobx Store Design
* [Offical guide on Store design](https://mobx.js.org/defining-data-stores.html)
* [Best Practice](https://medium.com/dailyjs/mobx-react-best-practices-17e01cec4140)
* UI State & Domain State

这是我觉得最难的部分，如何设计好Mobx的Store？官方给出的一个[guide](https://mobx.js.org/defining-data-stores.html) 是划分为Domain store 和 UI store。Domain store和Redux的one-single store 可不一样，这里是可以有多个的，像users, books, movies, orders 都可以是一个Domain Store， 至于UI store，暂时我们只是存储一些全局的属性。所以，我们的项目中Store的结构大致如下:
```
stores
--root.ts
--domain
----aaaStore.ts
----bbbStore.ts
--ui
----application.ts
```

root.ts初始化所有domain和ui store:
```
export default class RootStore {
  @observable
  aaStore;

  @observable
  bbStore;

  @observable
  applicationUIStore;

  constructor() {
    // Domain Store Init
    this.aaStore = new AStore(this);
    this.bbStore = new BStore(this);
    ...

    // UI Store Init
    this.applicationUIStore = new ApplicationUIStore(this);
    ...
  }
}
```

但是在实际的问题中，我们发现大部分的状态其实都是本地UI状态，（也许有人说用setState啊，如果业务复杂，状态很多, 并且基本会依赖其他store，最好抽出来）所以，问题来了，这些ui store我们放在哪里呢？同时，我们需要把Container 组件里的状态隔离开来，为什么隔离，一是因为UT 不好写（因为有inject，所以在UT里需要写很多Provider），二是傻瓜组件更不容易出错，参考Redux的connect用法，我们得到下面的结构：
```
ContainerAComponent
--ContainerAComponent.tsx
--ContainerAComponentUIStore.ts
```
ContainerAComponentUIStore.ts
```
export default class ContainerAComponentUIStore {
  rootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  addHoc = '';
  
  @action.bound
  onAdhocChange = (addHocNewValue) => {
    ....
  }
```
ContainerAComponent.tsx
```
export class ContainerAComponent extends React.Component {
  handleAdhocChange = (e) => {
    this.props.onAdhocChange(e.target.value);
  }
  ...
}
export default connectComponentStore(ContainerAComponent, ContainerAComponentUIStore);
```
这样，我们导出了两个组件，一个是ContainerAComponent，就是一个简单组件，我们可以通过传统传props的方式去测试组件核心内容，另一个是HOC组件，其实是不用测试的。

而至于connectComponentStore方法，就是一个很简单的HOC
```
export default (WrapperedComponent, ComponentStore) => {
  @inject('appStore')
  @observer
  class Connect extends React.Component {
    @observable componentStore;

    constructor(props) {
      super(props);
      this.componentStore = new ComponentStore(props.appStore);
      this.ref = createRef();
    }

    static displayName = `${WrapperedComponent.displayName || WrapperedComponent.name}-withUIStore`

    componentDidMount() {
      this.componentStore.mapState(this.props);
    }

    componentDidUpdate(preProps, preState) {
      this.componentStore.mapState(this.props);
    }

    render() {
      return (<WrapperedComponent ref={this.ref} {...this.componentStore.toProps} {...this.props} />);
    }
  }

  return Connect;
};
```

我们业务里，绝大部分都是用到的这种本地UI Store + 简单组件组合这种方式，也许就是所谓的local state component （忘了哪里听到的了）

### Mobx-State-Tree（MST）
也许MST在大型项目中使用是个很好的方式，但我们暂时还没有去尝试。

### Project Structure
下面是Mobx的一些项目组织结构参考资料：

https://medium.com/@daniel.bischoff/how-to-structure-your-mobx-react-app-8fd6d9d821a4     
https://github.com/gothinkster/react-mobx-realworld-example-app   


## Mobx-React vs Redux-React
个人简单的一些看法：
* Workflow
* Freestyle vs Strict
* OOP styles vs FP
* Small vs Large
* Time-traval problem (Resolved by MST)
* Container components (Inject vs Connect)
* [redux-crud-example](https://github.com/sitepoint-editors/redux-crud-example/tree/master/src) & [mobx-crud-example](https://github.com/sitepoint-editors/mobx-crud-example/tree/master/src)

https://medium.com/@cameronfletcher92/mobdux-combining-the-good-parts-of-mobx-and-redux-61bac90ee448   
https://www.sitepoint.com/redux-vs-mobx-which-is-best/

### Learning Redux
在一些小项目中用过Redux, 不得不说，Redux的学习成本要比Mobx高得多，比如下面的点，
redux, reducer, action, container component, selectors(reselect), redux-thunk, normalizing, ducks, and more waiting...

## Others links
### [Mobx-Best-Practice](https://medium.com/dailyjs/mobx-react-best-practices-17e01cec4140)
### Decorator (ES7/TS) vs no-decorators

## End
如果你有更好Mobx使用的一些心得，欢迎交流！
