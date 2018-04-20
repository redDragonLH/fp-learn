# 第六章

与命令式不同，声名式意味着我们要写**表达式**，而不是一步一步的指令

    // 命令式
    var makes = [];
    for (i = 0; i < cars.length; i++) {
      makes.push(cars[i].make);
    }

    // 声明式
    var makes = cars.map(function(car){ return car.make; });
    
-------
    // 命令式
    var authenticate = function(form) {
      var user = toUser(form);
      return logIn(user);
    };
    
    // 声明式
    var authenticate = compose(logIn, toUser);
  虽然命令式的版本并不一定就是错的，但还是硬编码了那种一步接一步的执行方式。而 compose 表达式只是简单地指出了这样一个事实：用户验证是 toUser 和 logIn 两个行为的组合。这再次说明，声明式为潜在的代码更新提供了支持，使得我们的应用代码成为了一种高级规范（high level specification）。
  因为声明式代码不指定执行顺序，所以它天然地适合进行并行运算。它与纯函数一起解释了为何函数式编程是未来并行计算的一个不错选择——我们真的不需要做什么就能实现一个并行／并发系统。

