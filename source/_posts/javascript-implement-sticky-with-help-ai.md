---
title: JS实现一个复杂sticky效果 
date: 2024-12-25 11:08:49
author: Troy
tags:
- ai
categories:
- web
---

最近工作上遇到一个需要：一个产品列表的下， 当浏览器滚动到每个产品上时，需要将产品title sticky 到顶部，紧接着产品描述也sticky 到title 下部分，产品里的一个按钮则需要sticky 到底部，当产品滚动完成后，紧接着下一个产品的sticky。

看似很简单的需求，本以为通过css position: sticky 可以很快完成，没想到遇到了一茬接一茬的问题：
1. 首先每一个sticky 的元素style 会变化，例如字体或者边框，这就需要知道什么时候是处于sticky 状态，然后css 的sticky 是没有这样的状态选择器 
2. 还是利用css sticky，只是使用 IntersectionObserver 来检测是否处于sticky 状态，如果是，那就加一个class 应用 style 的变化
3. 按着思路，做出来的有个新问题：当滚动到第一个产品底部，刚好第二个产品顶部时，sticky收缩回原始位置的时候，又导致父元素高度变化，此时又触发sticky 条件，导致触发sticky，然而，sticky生效时，父元素高度又变小，又触发sticky收缩。。。所以sticky 闪烁的问题出现了

#2 中的 detectSticky 可以用IntersectionObserver 实现代码：

```javascript
function detectSticky(element, onPin, onUnpin) {
  var observer = new IntersectionObserver(
    function(entries) {
      var entry = entries[0];
      if (entry.intersectionRatio < 1) {
        onPin();
      } else {
        onUnpin();
      }
    }.bind(this),
    { threshold: [1] } 
  );

  observer.observe(element);
  return () => observer.disconnect();
}
```

如果要实现一个通用的任意元素的sticky 效果，可使用下面的方法：

```javascript
function createSticky(element, position = 'top', offsetY = 0) {
  var isPinned = false;
  var spacer = null;

  var observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', checkSticky);
          checkSticky();
        } else {
          window.removeEventListener('scroll', checkSticky);
          if (isPinned) unpin();
        }
      });
    },
    { threshold: [0], rootMargin: '0px' }
  );

  function createSpacer() {
    var height = element.offsetHeight;
    spacer = document.createElement('div');
    spacer.className = 'sticky-spacer';
    spacer.style.height = height + 'px';
    spacer.style.opacity = 0;
    element.parentNode.insertBefore(spacer, element);
  }

  function pin() {
    if (!spacer) createSpacer();
    element.classList.add('is-sticky');
    isPinned = true;
  }

  function unpin() {
    element.classList.remove('is-sticky');
    if (spacer) {
      spacer.remove();
      spacer = null;
    }
    isPinned = false;
  }

  function checkSticky() {
    if (!element.parentElement) {
      unpin();
      return;
    }

    var rect = element.parentElement.getBoundingClientRect();
    var shouldPin = position === 'top'
      ? rect.top < -offsetY && rect.bottom > offsetY
      : rect.bottom > window.innerHeight + offsetY && rect.top < window.innerHeight;

    if (shouldPin && !isPinned) pin();
    else if (!shouldPin && isPinned) unpin();
  }

  observer.observe(element.parentElement);
  return () => observer.disconnect();
}
```

最终方案还有一个可改进的地方，由于 title 是触顶触发sticky，如果title 内容本身很高，spacer 的空白会比较明显，可以改为title 底部触顶触发, 只需要把 rect.bottom > offsetY  改为 rect.bottom > 0

![image](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect/element-box-diagram.png)

最后，平平无奇的一篇技术小点为何要写呢？最主要的是上面的最终成品是我在 claude.ai 帮助下完成，包括生成demo，重构代码，不得不感叹于 AI 真的改变程序生活