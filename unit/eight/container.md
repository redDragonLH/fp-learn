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