# 第六章

与命令式不同，声名式意味着我们要写**表达式**，而不是一步一步的指令

    // 命令式
    var makes = [];
    for (i = 0; i < cars.length; i++) {
      makes.push(cars[i].make);
    }

    // 声明式
    var makes = cars.map(function(car){ return car.make; });