# 纯函数

**若一个函数对相同的输入，永远得到相同的输出，并且不会影响外部状态也就是不会有副作用，说就是纯函数**

> 副作用是在计算结果的过程中，系统状态的一种变化，或者与外部世界进行的可观察的交互

*基本上：只要是跟函数外部环境的交互就都是副作用*

副作用可能包含，但不限于：

- 更改文件系统
- 往数据库插入记录
- 发送一个 http 请求
- 可变数据
- 打印/log
- 获取用户输入
- DOM 查询
- 访问系统状态
****
> 函数是不同数值之间的特殊关系：每一个输入值返回且只返回一个输出值。

所以： 纯函数就是数学上的函数，而且是函数式编程的*全部*

## 追求纯的理由

### 可缓存性（Cacheable）
因为 一个输入总是返回同一个输出，所有可以把纯函数的输入做缓存

      var squareNumber  = memoize(function(x){ return x*x; });

      squareNumber(4);
      //=> 16

      squareNumber(4); // 从缓存中读取输入值为 4 的结果
      //=> 16

缓存的简单实现

      var memoize = function(f) {
        var cache = {};  //定义储存对象

        return function() {
          var arg_str = JSON.stringify(arguments); //把参数转为字符串比较
          cache[arg_str] = cache[arg_str] || f.apply(f, arguments); // 如果有缓存数据就直接返回缓存数据，如果没有旧运行方法同时赋值给储存对象
          return cache[arg_str];
        };
      };
      
也可以通过延迟执行把不纯函数转为纯函数

**通过*延迟执行*的方式把不纯的函数转换为纯函数**

      var pureHttpCall = memoize(function(url, params){
        return function() { 
          return $.getJSON(url, params); 
        }
      });

因为并没有发送 http 请求，只是返回了一个函数，当再次调用它的时候才会发送请求。

这样把一个不纯的（与外界有交互）的函数用闭包的方式*延迟* 到需要的时候才发送请求获取数据的方式就是利用延迟执行把不纯的函数转为纯函数

这样我们就可以缓存任意一个函数，不管它们看起来多么具有破坏性。

### 可移植性／自文档化（Portable / Self-Documenting）

因为纯函数不可以发生不在控制内的与外部交互，所以这是必须强制的“注入“ 依赖，所有数据等函数所需的内容都必须使用参数传递，这样纯函数的依赖就会很明确，就更易于观察和理解，观察参数就可以大概的了解这个函数要做什么，形成一个自文档

*在 JavaScript 的设定中，可移植性可以意味着把函数序列化（serializing）并通过 socket 发送。也可以意味着代码能够在 web workers 中运行*
### 可测试性（Testable）
纯函数让测试更加容易，只需要简单地给函数一个输入，然后断言输出就好了

### 合理性（Reasonable）

**引用透明性(referential transparency)**：*如果一段代码可以替换成它执行所得的结果，而且是在不改变整个程序行为的前提下替换的，那么我们就说这段代码是引用透明的*

由于纯函数总是能够根据相同的输入返回相同的输出，所以它们就能够保证总是返回同一个结果，这也就保证了引用透明性

### 并行代码

因为纯函数根本不需要访问共享的内存，而且根据其定义，纯函数也不会因副作用而进入竞争态（race condition）。

## 处理副作用
虽然没有副作用一直是函数式编程的最高理想，但是 **有些副作用是不可避免且至关重要的**，所以我们只能尽量减少副作用以减少出现问题的位置

### 依赖注入

就是把函数中不纯的代码放到参数中传入到函数中

      // logSomething :: String -> String
      function logSomething(something) {
      const dt = new Date().toISOString();
      console.log(`${dt}: ${something}`);
      return something;
      }

`logSomething()` 函数有两个不纯的地方：它创建了一个 Date() 对象并且把它输出到控制台。因此，它不仅执行了 IO 操作, 而且每次运行的时候都会给出不同的结果。

使用依赖注入:

      const something = "Curiouser and curiouser!";
      const d = new Date();
      const cnsl = console.log.bind(console);
      function logSomething(d, cnsl, something) {
        const dt = d.toIsoString();
        cnsl.log(`${dt}: ${something}`);
        return something;
      }

在这改变之中我们做了如下几件事
* 把不纯的部分剥离出来
* 把它们推开，远离核心代码
* 让logSomething变纯了（行为可预测）

当然做这些事情并不是为了干掉副作用，而是为了 控制不确定性（unpredictability）
* 缩小范围：把不确定性移到了更小的函数里
* 集中管理：这样就可以把副作用相关代码远离核心并且集中起来控制

### Functor 函子
也就是 [容器](https://github.com/llh911001/mostly-adequate-guide-chinese/blob/master/ch8.md)，把问题代码放到容器里面，让相关操作都在容器里面，当需要时我们才从让容器里面的副作用代码运行

[Functor 函子](https://github.com/llh911001/mostly-adequate-guide-chinese/blob/master/ch8.md)

### 意义
这些方案只是为了 **将副作用带来的不确定性限制在一定范围内，让其它部分得以保持纯的特性**，并不是为了干掉副作用

## 参考资料
* [JS 函数式编程指南](https://www.gitbook.com/book/llh911001/mostly-adequate-guide-chinese/details)
* [函数式编程中如何处理副作用？](http://www.ayqy.net/blog/%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B%E4%B8%AD%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%E5%89%AF%E4%BD%9C%E7%94%A8%EF%BC%9F/)
* [How to deal with dirty side effects in your pure functional JavaScript](https://jrsinclair.com/articles/2018/how-to-deal-with-dirty-side-effects-in-your-pure-functional-javascript/)