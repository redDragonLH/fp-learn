## 强大的容器

函数式的程序，即通过管道把数据在一系列纯函数间传递的程序

控制流（control flow）、异常处理（error handling）、异步操作（asynchronous actions）和状态（state）作用（effects）

创建一个容器（container）,`这个容器必须能够装载任意类型的值`,这个容器将会是一个对象，但我们不会为它添加面向对象观念下的属性和方法,只存放数据的特殊盒子。

    var Container = function(x) {
      this.__value = x;
    }
    Container.of = function(x) { return new Container(x); };
    
使用 Container.of 作为构造器（constructor）

提示:
* Container 是个只有一个属性的对象。尽管容器可以有不止一个的属性，但大多数容器还是只有一个。我们很随意地把 Container 的这个属性命名为 __value。
* __value 不能是某个特定的类型，不然 Container 就对不起它这个名字了。
* 数据一旦存放到 Container，就会一直待在那儿。我们可以用 .__value 获取到数据，但这样做有悖初衷。

### 第一个 functor
容器的值，需要一种方法来让别的函数能够操作它

    // (a -> b) -> Container a -> Container b
    Container.prototype.map = function(f){
      return Container.of(f(this.__value))
    }

Container 里的值传递给 map 函数之后，就可以任我们操作；操作结束后，为了防止意外再把它放回它所属的 Container。这样做的结果是，我们能连续地调用 map，运行任何我们想运行的函数。甚至还可以改变值的类型

> functor 是实现了 map 函数并遵守一些特定规则的容器类型。

functor 就是一个签了合约的接口,functor 是范畴学里的概念

让容器自己去运用函数能给我们带来什么好处？答案是抽象，对于函数运用的抽象

*****
除此之外，还有另外一种 functor，那就是实现了 map 函数的类似容器的数据类型，这种 functor 在调用 map 的时候能够提供非常有用的行为。

    var Maybe = function(x) {
      this.__value = x;
    }

    Maybe.of = function(x) {
      return new Maybe(x);
    }
    
    Maybe.prototype.isNothing = function() {
      return (this.__value === null || this.__value === undefined);
    }

    Maybe.prototype.map = function(f) {
      return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
    }
    
Maybe 看起来跟 Container 非常类似，但是有一点不同：Maybe 会先检查自己的值是否为空，然后才调用传进来的函数。这样我们在使用 map 的时候就能避免恼人的空值了

**Maybe 最常用在那些可能会无法成功返回结果的函数中**

这种强制执行的空值检查能够把脆弱的应用升级为实实在在的、健壮的应用，这样的API保证了更加安全的软件

    //  withdraw :: Number -> Account -> Maybe(Account)
    var withdraw = curry(function(amount, account) {
      return account.balance >= amount ?
        Maybe.of({balance: account.balance - amount}) :
        Maybe.of(null);
    });

    //  finishTransaction :: Account -> String
    var finishTransaction = compose(remainingBalance, updateLedger); // <- 假定这两个函数已经在别处定义好了

    //  getTwenty :: Account -> Maybe(String)
    var getTwenty = compose(map(finishTransaction), withdraw(20));


    getTwenty({ balance: 200.00});
    // Maybe("Your balance is $180.00")

    getTwenty({ balance: 10.00});
    // Maybe(null)

## 释放容器里的值

任何事物都有一个最终尽头。那些会产生作用的函数，都要有一个结束，但是可能无法通过`return` 把输出传递到外部世界，必须要运行这样或那样的函数才能传递出去。

`应用程序所做的工作就是获取、更改和保存数据直到不再需要它们`，对数据做这些操作的函数有可能被 `map` 调用,这样的话数据就可以不用离开它温暖舒适的容器

如果我们想返回一个自定义的值然后还能继续执行后面的代码的话，是可以做到的；

    //  maybe :: b -> (a -> b) -> Maybe a -> b
    var maybe = curry(function(x, f, m) {
      return m.isNothing() ? x : f(m.__value);
    });
    
    //  getTwenty :: Account -> String
    var getTwenty = compose(
      maybe("You're broke!", finishTransaction), withdraw(20)
    );
    
    getTwenty({ balance: 200.00});
    // "Your balance is $180.00"

    getTwenty({ balance: 10.00});
    // "You're broke!"

**空值检查大多数时候都能防止在代码逻辑上偷工减料，让我们脱离危险。**

那就是 Maybe 的“真正”实现会把它分为两种类型：一种是非空值，另一种是空值。这种实现允许我们遵守 map 的 parametricity 特性，因此 null 和 undefined 能够依然被 map 调用，functor 里的值所需的那种普遍性条件也能得到满足。所以你会经常看到 Some(x) / None 或者 Just(x) / Nothing 这样的容器类型在做空值检查，而不是 Maybe。

## “纯”错误处理

throw/catch 并不十分“纯”。当一个错误抛出的时候，我们没有收到返回值，反而是得到了一个警告

