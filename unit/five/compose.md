# 代码组合（compose）

例：

    var compose = function(f,g) {
      return function(x) {
        return f(g(x));
      };
    };

`组合` 看起来像是饲养函数,选择两个需要的函数，让它们结合，产生一个新的函数
    
    var toUpperCase = function(x) { return x.toUpperCase(); };
    var exclaim = function(x) { return x + '!'; };
    var shout = compose(exclaim, toUpperCase);

    shout("send in the clowns");
    //=> "SEND IN THE CLOWNS!"

在 `compose`的定义中，`g`将先于`f`执行，这就创建了一个从右到左的数据流，这样的可读性远远高于嵌套一大堆函数调用，

    // 结合律（associativity）
    var associative = compose(f, compose(g, h)) == compose(compose(f, g), h);
    // true
    
如果我们想把字符串变为大写，可以这么写：

    compose(toUpperCase, compose(head, reverse));

    // 或者
    compose(compose(toUpperCase, head), reverse);
    
运用结合律能为我们带来强大的灵活性，还有对执行结果不会出现意外的那种平和心态

**结合律的一大好处是任何一个函数分组都可以被拆开来，然后再以它们自己的组合方式打包在一起**

    var loudLastUpper = compose(exclaim, toUpperCase, head, reverse);

    // 或
    var last = compose(head, reverse);
    var loudLastUpper = compose(exclaim, toUpperCase, last);

    // 或
    var last = compose(head, reverse);
    var angry = compose(exclaim, toUpperCase);
    var loudLastUpper = compose(angry, last);

## pointfree
**函数无须提及将要操作的数据是什么样的。**一等公民的函数、柯里化（curry）以及组合协作起来非常有助于实现这种模式。

    // 非 pointfree，因为提到了数据：word
    var snakeCase = function (word) {
    return word.toLowerCase().replace(/\s+/ig, '_');
    };

    // pointfree
    var snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
    
这里所做的事情就是通过管道把数据在接受单个参数的函数间传递。利用 curry，我们能够做到让每个函数都先接收数据，然后操作数据，最后再把数据传递到下一个函数那里去。另外注意在 pointfree 版本中，不需要 word 参数就能构造函数；而在非 pointfree 的版本中，必须要有 word 才能进行进行一切操作。

      // 非 pointfree，因为提到了数据：name
      var initials = function (name) {
        return name.split(' ').map(compose(toUpperCase, head)).join('. ');
      };

      // pointfree
      var initials = compose(join('. '), map(compose(toUpperCase, head)), split(' '));

      initials("hunter stockton thompson");
      // 'H. S. T'
      
**pointfree 模式能够帮助我们减少不必要的命名，让代码保持简洁和通用。**对函数式代码来说，pointfree 是非常好的石蕊试验，因为它能告诉我们一个函数是否是接受输入返回输出的小函数。比如，while 循环是不能组合的。不过你也要警惕，pointfree 就像是一把双刃剑，有时候也能混淆视听。并非所有的函数式代码都是 pointfree 的，不过这没关系。可以使用它的时候就使用，不能使用的时候就用普通函数。

## debug
组合的一个常见错误是，在没有局部调用之前，就组合类似 map 这样接受两个参数的函数。
    // 错误做法：我们传给了 `angry` 一个数组，根本不知道最后传给 `map` 的是什么东西。
    var latin = compose(map, angry, reverse);

    latin(["frog", "eyes"]);
    // error


    // 正确做法：每个函数都接受一个实际参数。
    var latin = compose(map(angry), reverse);

    latin(["frog", "eyes"]);
    // ["EYES!", "FROG!"])

如果在 debug 组合的时候遇到了困难，那么可以使用下面这个实用的，但是不纯的 trace 函数来追踪代码的执行情况。

    var trace = curry(function(tag, x){
    console.log(tag, x);
    return x;
    });

    var dasherize = compose(join('-'), toLower, split(' '), replace(/\s{2,}/ig, ' '));

    dasherize('The world is a vampire');
    // TypeError: Cannot read property 'apply' of undefined
    
**组合将成为我们构造程序的工具，而且幸运的是，它背后是有一个强大的理论做支撑的**

## 范畴学
范畴学是数学中的一个抽象分支，能够形式化诸如集合论，类型论，群论，以及逻辑学等数学分支中的一些概念。**范畴学主要处理对象，态射，和变化式，而这些概念和编程的联系非常紧密**

在范畴学中，有一个概念叫做...范畴。有着以下这些组件（component）的搜集（collection）就构成了一个范畴

* 对象的搜集
* 态射的搜集
* 态射的组合
* identity 这个独特的态射

### 对象的收集
对象就是数据类型，例如`string`、`Boolean`、`Number`和`Object`。通常我们把数据类型视作所有可能的值的一个集合（set）。像 Boolean 就可以看作是 [true, false] 的集合，Number 可以是所有实数的一个集合。**把类型当作集合对待我们就可以利用集合论处理类型**
### 态射的搜集
态射是标准的、普通的纯函数。
### 态射的组合
这就是本章介绍的新玩意儿——组合。我们已经讨论过 compose 函数是符合结合律的，这并非巧合，结合律是在范畴学中对任何组合都适用的一个特性

![组合](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/images/cat_comp2.png)

    var g = function(x){ return x.length; };
    var f = function(x){ return x === 4; };
    var isFourLetterWord = compose(f, g);

### identity 这个独特的态射
名为 `id` 的实用函数。这个函数接受随便什么输入然后原封不动地返回它：

    var id = function(x){ return x; };
    
id 函数跟组合一起使用简直完美。下面这个特性对所有的一元函数（unary function）（一元函数：只接受一个参数的函数） f 都成立：

      // identity
      compose(id, f) == compose(f, id) == f;
      // true

除了类型和函数，还有什么范畴呢？还有很多，比如我们可以定义一个有向图（directed graph），以节点为对象，以边为态射，以路径连接为组合。还可以定义一个实数类型（Number），以所有的实数为对象，以 >= 为态射（实际上任何偏序（partial order）或全序（total order）都可以成为一个范畴）

## 总结
组合像一系列管道那样把不同的函数联系在一起，数据就可以也必须在其中流动——毕竟纯函数就是输入对输出，所以打破这个链条就是不尊重输出，就会让我们的应用一无是处。
我们认为组合是高于其他所有原则的设计原则，这是因为组合让我们的代码简单而富有可读性。另外范畴学将在应用架构、模拟副作用和保证正确性方面扮演重要角色。