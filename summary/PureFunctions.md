# 纯函数

** 若一个函数对相同的输入，永远得到相同的输出，并且不会影响外部状态也就是不会有副作用，说就是纯函数**

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

## 延迟执行转纯函数

通过延迟执行的方式把不纯的函数转换为纯函数，

      var pureHttpCall = memoize(function(url, params){
        return function() { return $.getJSON(url, params); }
      });

因为并没有发送 http 请求，只是返回了一个函数，当调用它的时候才会发送请求
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
  
