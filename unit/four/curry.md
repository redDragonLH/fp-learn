# 柯里化 (curry)

curry 的概念很简单：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

“预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。

通过简单地传递几个参数，就能动态创建实用的新函数；而且还能带来一个额外好处，那就是保留了数学的函数定义，尽管参数不止一个

 - 参数复用 - 复用最初函数的第一个参数
 - 提前执行 - 返回接受余下的参数且返回结果的新函数
 - 延迟执行 - 返回新函数，等待执行
 
## 事件监听实例

普通封装方法：

    /*
    * @param    ele        Object      DOM元素对象
    * @param    type       String      事件类型
    * @param    fn         Function    事件处理函数
    * @param    isCapture  Boolean     是否捕获
    */
    var addEvent = function(ele, type, fn, isCapture) {
       if(window.addEventListener) {
           ele.addEventListener(type, fn, isCapture)
       } else if(window.attachEvent) {
           ele.attachEvent("on" + type, fn)
       }
    }

柯里化封装方法

    var addEvent = (function() {
        if(window.addEventListener) {
            return function(ele, type, fn, isCapture) {
                ele.addEventListener(type, fn, isCapture)
            }
        } else if(window.attachEvent) {
            return function(ele, type, fn) {
                 ele.attachEvent("on" + type, fn)
            }
        }
    })()

使用了 `提前返回`和 `延迟执行` 的特点

- 提前返回 -使用韩素华立即调用进行了一次兼容判断（部分求值），返回兼容的事件
- 延迟执行-返回新函数，在新函数调用兼容的事件方法。等待 addEvent新函数调用，延迟执行

## 防抖和节流

**高频事件**

- 高频事件处理函数，不应该含有复杂操作，例如DOM操作和复杂计算（DOM操作一般会造成页面回流和重绘，使浏览器不断重新渲染页面）
- 控制高频事件的出发频率

`可以延迟事件处理函数的执行，然后通过保存执行状态来控制事件处理函数的执行`

其中防抖和节流对高频事件进行优化的原理就是通过延迟执行，将多个间隔接近的函数执行合并成一次函数执行

### 防抖（Debouncing）
`防抖事将多个触发间隔接近的事件函数执行，合并成一次函数执行。`

关键要点：
- 使用 `setTimeout` 延时器，传入延迟时间，将事件处理函数延迟执行，并且通过事件触发频率与延迟时间值的比较，控制处理函数是否执行
- 使用柯里化函数结合闭包的思想，将执行状态保存在闭包中，返回新函数，在新函数中通过执行状态控制是否在滚动时执行处理函数

    /*
    * @param    fn              Function    事件处理函数
    * @param    delay           Number      延迟时间
    * @param    isImmediate     Boolean     是否滚动时立刻执行
    * @return   Function                    事件处理函数
    */
    var debounce = function(fn, delay, isImmediate) {
        //使用闭包，保存执行状态，控制函数调用顺序
        var timer;

        return function() {
            var _args = [].slice.call(arguments),
                context = this;

            clearTimeout(timer);

            var _fn = function() {
                timer = null;
                if (!isImmediate) fn.apply(context, _args);
            };

            //是否滚动时立刻执行
            var callNow = !timer && isImmediate;

            timer = setTimeout(_fn, delay);

            if(callNow) fn.apply(context, _args);
        }
    }

使用

    var debounceScroll = debounce(function() {
        //事件处理函数，滚动时进行的处理
    }, 100)
    window.addEventListener("scroll", debounceScroll)
    
**防抖技术仅靠传入延迟时间值的大小控制高频时间的触发频率**

## 节流（Throttle）
节流也是将多个触发间隔接近的事件函数执行，合并成一次函数执行，并且在指定的时间内至少执行一次事件处理函数。

- 利用闭包存储了当前和上一次执行的时间戳，通过两次函数执行的时间差跟指定的延迟时间的比较，控制函数是否立刻执行

    /*
    * @param    fn          Function    事件处理函数
    * @param    wait        Number      延迟时间
    * @return   Function                事件处理函数
    */
    var throttle = function(fn, wait) {
        var timer, previous, now, diff;
        return function() {
            var _args = [].slice.call(arguments),
                context = this;
            //储存当前时间戳
            now = Date.now();

            var _fn = function() {
                //存储上一次执行的时间戳
                previous = Date.now();
                timer = null;
                fn.apply(context, _args)
            }

            clearTimeout(timer)

            if(previous !== undefined) {
                //时间差
                diff = now - previous;
                if(diff >= wait) {
                    fn.apply(context, _args);
                    previous = now;
                } else {
                    timer = setTimeout(_fn, wait);
                }
            }else{
                _fn();
            }
        }
    }

### 浏览器帧频刷新自动调用的方法(requestAnimationFrame)实现
    
    //解决requestAnimationFrame兼容问题
    var raFrame = window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function(callback) {
                  window.setTimeout(callback, 1000 / 60);
              };
    //柯里化封装
    var rafThrottle = function(fn) {
    var isLocked;
    return function() {
        var context = this,
            _args = arguments;

        if(isLocked) return 

        isLocked = true;
        raFrame(function() {
            isLocked = false;
            fn.apply(context, _args)
        })
    }
    }
    
## bind 函数柯里化

- bind方法改变this指向，却不会执行原函数，那么我们可利用柯里化延迟执行，参数复用和提前返回的特点，返回新函数，在新函数使用apply方法执行原函数

### 简单的bind方法封装，仅用于普通函数

    if (!Function.prototype.bind) {
      Function.prototype.bind = function(context) {
          if(context.toString() !== "[object Object]" && context.toString() !== "[object Window]" ) {
              throw TypeError("context is not a Object.")
          }

      var _this = this;
      var args = [].slice.call(arguments, 1);

      return function() {
          var _args = [].slice.call(arguments);

          _this.apply(context, _args.concat(args))
      }
    }
    }

### 复杂情况，（考虑Bind的任何用法）

    if (!Function.prototype.bind) {
       Function.prototype.bind = function(oThis) {
         if (typeof this !== 'function') {
           // closest thing possible to the ECMAScript 5
           // internal IsCallable function
           throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
         }

       var aArgs   = Array.prototype.slice.call(arguments, 1),
           fToBind = this,
           fNOP    = function() {},
           fBound  = function() {
             return fToBind.apply(this instanceof fNOP
                    ? this
                    : oThis,
                    // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                    aArgs.concat(Array.prototype.slice.call(arguments)));
           };

       // 维护原型关系
       if (this.prototype) {
         // Function.prototype doesn't have a prototype property
         fNOP.prototype = this.prototype; 
       }
       fBound.prototype = new fNOP();

       return fBound;
      };
    };

要理解复杂的 bind 兼容方法,必须彻底理解四个基础知识

- js的原型对象
- 构造函数使用new操作符的过程
- this的指向问题
- 熟悉 bing 方法的使用场景

### 柯里化函数封装

    function createCurry(fn) {
        if(typeof fn !== "function"){
            throw TypeError("fn is not function.");
        }
        //复用第一个参数
        var args = [].slice.call(arguments, 1);
        //返回新函数
        return function(){
            //收集剩余参数
            var _args = [].slice.call(arguments);
            //返回结果
            return fn.apply(this, args.concat(_args));
        }
    }

使用柯里化特点

- 复用第一个参数
- 返回新函数
- 收集剩余参数
- 返回结果

使用例子

    //add(19)(10, 20, 30)，求该函数传递的参数和
    var add = createCurry(function() {
        //获取所有参数
        var args = [].slice.call(arguments);

        //返回累加结果
        return args.reduce(function(accumulator, currentValue) {
            return accumulator + currentValue
        })
    }, 19)
    add(10, 20, 30);    //79