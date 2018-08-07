# 函数式中学到的方法
## 柯里化

用处：参数复用，函数复用，保留了数学的函数定义

> 在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成**一系列使用一个参数的函数**的技术。 --维基百科

例子：

      function add(a, b) {
          return a + b;
      }

      // 执行 add 函数，一次传入两个参数即可
      add(1, 2) // 3

      改造成curry模式
      function add (x){
        return function(y){
          return x + y;
        }
      }
      var addTen = add(10);
      
      addTen(2);
      // 12


这是一种 “预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数
### 柯里化实现

#### 简单版


    var curry = function (fn) {
        var args = [].slice.call(arguments, 1); // 获取多余参数并转换为数组
        // 返回携带 参数 的匿名函数
        return function() {
            var newArgs = args.concat([].slice.call(arguments));//获取剩余参数并并入数组
            return fn.apply(this, newArgs); // 运行方法
        };
    };

####  简单版修改


      function sub_curry(fn) {
          var args = [].slice.call(arguments, 1);
          return function() {
              return fn.apply(this, args.concat([].slice.call(arguments)));
          };
      }

      function curry(fn, length) {

          length = length || fn.length;

          var slice = Array.prototype.slice;

          return function() {
              if (arguments.length < length) {
                  var combined = [fn].concat(slice.call(arguments));
                  return curry(sub_curry.apply(this, combined), length - arguments.length);
              } else {
                  return fn.apply(this, arguments);
              }
          };
      }