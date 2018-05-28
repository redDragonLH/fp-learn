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


either 接受两个函数（而不是一个）和一个静态值为参数。这两个函数的返回值类型一致：

    // either :: (a->c)-><b -> c> -> Either a b -> c
    const either = curry((f, g, e) => {
      let result;
      
      switch (e.constructor) {
        case Left:
          result = f(e.$value);
          break;
        case Right:
          result = g(e.$value);
          break;
        // No Default;
      }
      return result;
    })
<!--  -->

#### 拿到容器内的数据

    Class IO {
      static of( x ) {
        return new IO( ()=>x );
      }
      constructor( fn ) {
        this.$value = fn ;
      }
      map( fn ){
        return new IO( compose( fn, this.$value ) );
      }
      inspect(){
        return `IO( ${inspect( this.$value )})`;
      }
    }

`IO` 的 `_value` 总是一个函数,`IO` 把非纯执行动作（impure action）捕获到包裹函数里，目的是延迟执行这个非纯动作。就这一点而言，我们认为 IO 包含的是被包裹的执行动作的返回值，而不是包裹函数本身。这在 of 函数里很明显：`IO(function(){ return x })`` 仅仅是为了延迟执行，其实我们得到的是 `IO(x)`。

  let io_window = new IO( () => window );
  
## 王老先生有作用。。。。

    //  getFromStorage :: String -> (_ -> String)
    var getFromStorage = function(key) {
      return function() {
        return localStorage[key];
      }
    }

`io`

    class IO{
      static of(x){
        return new IO( () => X ); /返回一个新的 IO 
      }
      constructor( fn ) { // 初始化函数
        this.$value = fn;  // 内部属性__value 等于 f(函数) 
      }
      map( fn ) {  // 组合一个函数与内部的value方法，返回一个新的 IO
        return new IO(compose(fn,this.$value));
      }
      inspect(){
        return `IO(${inspect(this.$value)})`;
      }
    };

  
`IO` 跟之前的 `functor` 不同的地方在于，它的` __value` 总是一个函数

`IO` 把非纯执行动作（impure action ） 捕获到包裹函数里，目的是延迟执行这个非纯动作。
`IO` 包含的是被包裹的执行动作的返回值，而不是包裹函数本身。这在 `of` 函数里面很明显 ： `IO(function(){return x})` 仅仅是为了延迟执行，其实我们得到的是`IO(X)`

使用实例

    // io_window :: IO window
    let io_window = new IO( () => window );
    
    io_window.map( win => win.innerWidth );
    
    io_window.map( _.prop( 'location' ).map( _.prop( 'href' ) ).map(split('/')) );
    
    // $ :: String -> IO [DOM]
    let $ = (selector) => return new IO( ()=> document.querySelectorAll( selector ) );
    
调用IO ，获取数据
    ////// 纯代码库: lib/params.js ///////

    //  url :: IO String
    var url = new IO(function() { return window.location.href; });

    //  toPairs =  String -> [[String]]
    var toPairs = compose(map(split('=')), split('&'));

    //  params :: String -> [[String]]
    var params = compose(toPairs, last, split('?'));

    //  findParam :: String -> IO Maybe [String]
    var findParam = function(key) {
      return map(compose(Maybe.of, filter(compose(eq(key), head)), params), url);
    };

    ////// 非纯调用代码: main.js ///////

    // 调用 __value() 来运行它！
    findParam("searchTerm").__value();
    // Maybe(['searchTerm', 'wafflehouse'])
    
把 url 包裹在一个 IO 里，然后把这头野兽传给了调用者；一双手保持的非常干净。你可能也注意到了，我们把容器也“压栈”了，要知道创建一个 IO(Maybe([x])) 没有任何不合理的地方。我们这个“栈”有三层 functor（Array 是最有资格成为 mappable 的容器类型）

## 异步任务
`跟 IO 在精神上相似，但是用法上又千差万别`

        // Node readfile example:
        //=======================

        var fs = require('fs');

        //  readFile :: String -> Task(Error, JSON)
        var readFile = function(filename) {
          return new Task(function(reject, result) {
            fs.readFile(filename, 'utf-8', function(err, data) {
              err ? reject(err) : result(data);
            });
          });
        };

        readFile("metamorphosis").map(split('\n')).map(head);
        // Task("One morning, as Gregor Samsa was waking up from anxious dreams, he discovered that
        // in bed he had been changed into a monstrous verminous bug.")


        // jQuery getJSON example:
        //========================

        //  getJSON :: String -> {} -> Task(Error, JSON)
        var getJSON = curry(function(url, params) {
          return new Task(function(reject, result) {
            $.getJSON(url, params, result).fail(reject);
          });
        });

        getJSON('/video', {id: 10}).map(_.prop('title'));
        // Task("Family Matters ep 15")

        // 传入普通的实际值也没问题
        Task.of(3).map(function(three){ return three + 1 });
        // Task(4)

`map` 就是 `then`，`Task` 就是一个 `promise`。

与 `IO` 类似，`Task` 在我们给它绿灯之前是不会运行的。事实上，正因为它要等我们的命令，`IO` 实际就被纳入到了 `Task` 名下，代表所有的异步操作——`readFile` 和 `getJSON` 并不需要一个额外的 `IO` 容器来变纯。更重要的是，当我们调用它的 `map` 的时候，`Task` 工作的方式与 `IO` 几无差别：都是把对未来的操作的指示放在一个时间胶囊里，就像家务列表（`chore chart`）那样——真是一种精密的拖延术。

调用 `fork` 方法才能运行 `Task`，这种机制与 `unsafePerformIO` 类似。但也有不同，不同之处就像 `fork` 这个名称表明的那样，它会 `fork` 一个子进程运行它接收到的参数代码，其他部分的执行不受影响，主线程也不会阻塞。当然这种效果也可以用其他一些技术比如线程实现，但这里的这种方法工作起来就像是一个普通的异步调用，而且 `event loop` 能够不受影响地继续运转。

        // Pure application
        //=====================
        // blogTemplate :: String

        //  blogPage :: Posts -> HTML
        var blogPage = Handlebars.compile(blogTemplate);

        //  renderPage :: Posts -> HTML
        var renderPage = compose(blogPage, sortBy('date'));

        //  blog :: Params -> Task(Error, HTML)
        var blog = compose(map(renderPage), getJSON('/posts'));


        // Impure calling code
        //=====================
        blog({}).fork(
          function(error){ $("#error").html(error.message); },
          function(page){ $("#main").html(page); }
        );

        $('#spinner').show();

这里的控制流是线性的。只需要从下读到上，从右读到左就能理解代码，即便这段程序实际上会在执行过程中到处跳来跳去。这种方式使得阅读和理解应用程序的代码比那种要在各种回调和错误处理代码块之间跳跃的方式容易得多。

## 理论
functor 的概念来自于范畴学，并满足一些定律

同一律

      // identity
      map(id) === id;

      // composition
      compose(map(f), map(g)) === map(compose(f, g));

范畴学中，functor 接受一个范畴的对象和态射（morphism），然后把它们映射（map）到另一个范畴里去。根据定义，这个新范畴一定会有一个单位元（identity），也一定能够组合态射；

把范畴想象成一个有着多个对象的网络，对象之间靠态射连接。那么 functor 可以把一个范畴映射到另外一个，而且不会破坏原有的网络。如果一个对象 a 属于源范畴 C，那么通过 functor F 把 a 映射到目标范畴 D 上之后，就可以使用 F a 来指代 a 对象

![态射链接多个对象的网络](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/images/catmap.png)

`Maybe` 就把类型和函数的范畴映射到这样一个范畴：即每个对象都有可能不存在，每个态射都有空值检查的范畴。

这个结果在代码中的实现方式是用 map 包裹每一个函数，用 functor 包裹每一个类型。这样就能保证每个普通的类型和函数都能在新环境下继续使用组合。从技术上讲，代码中的 functor 实际上是把范畴映射到了一个包含类型和函数的子范畴（sub category）上，使得这些 functor 成为了一种新的特殊的 endofunctor。

可以用一张图来表示这种态射及其对象的映射：

![态射及其对象的映射](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/images/functormap.png)

这张图除了能表示态射借助 functor F 完成从一个范畴到另一个范畴的映射之外，我们发现它还符合交换律，也就是说，顺着箭头的方向往前，形成的每一个路径都指向同一个结果。不同的路径意味着不同的行为，但最终都会得到同一个数据类型。这种形式化给了我们原则性的方式去思考代码——无须分析和评估每一个单独的场景，只管可以大胆地应用公式即可。

      //  topRoute :: String -> Maybe(String) 
      var topRoute = compose(Maybe.of, reverse); 

      //  bottomRoute :: String -> Maybe(String)
      var bottomRoute = compose(map(reverse), Maybe.of);


      topRoute("hi");
      // Maybe("ih")

      bottomRoute("hi");
      // Maybe("ih")

or
    
![例子](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/images/functormapmaybe.png)

functor 也能嵌套使用：

      var nested = Task.of([Right.of("pillows"), Left.of("no sleep for you")]);

      map(map(map(toUpperCase)), nested);
      // Task([Right("PILLOWS"), Left("no sleep for you")])

`nested` 是一个将来的数组，数组的元素有可能是程序抛出的错误。我们使用 `map` 剥开每一层的嵌套，然后对数组的元素调用传递进去的函数。可以看到，这中间没有回调、`if/else` 语句和 `for` 循环，只有一个明确的上下文。的确，我们必须要 `map(map(map(f)))` 才能最终运行函数。不想这么做的话，可以组合 `functor`

      var Compose = function(f_g_x){
        this.getCompose = f_g_x;
      }

      Compose.prototype.map = function(f){
        return new Compose(map(map(f), this.getCompose));
      }

      var tmd = Task.of(Maybe.of("Rock over London"))

      var ctmd = new Compose(tmd);

      map(concat(", rock on, Chicago"), ctmd);
      // Compose(Task(Maybe("Rock over London, rock on, Chicago")))

      ctmd.getCompose;
      // Task(Maybe("Rock over London, rock on, Chicago"))
      
