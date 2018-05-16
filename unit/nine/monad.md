# monad (洋葱)

IO等的 `of` 方法不是用来避免使用 `new` 关键字的，而是用来把值放到默认 *最小化上下文*(default minimal context) 中的,`of` 没有真正地取代构造器——它是一个称之为 pointed 的重要接口的一部分。
> pointed functor 是实现了 `of` 方法的 functor.

这里的关键是把任意值丢到容器里然后到处使用`map`的能力

      IO.of("tetris").map(concat(" master"));
      // IO("tetris master")

      Maybe.of(1336).map(add(1));
      // Maybe(1337)

      Task([{id: 2}, {id: 3}]).map(_.prop('id'));
      // Task([2,3])

      Either.of("The past, present and future walk into a bar...").map(
        concat("it was tense.")
      );
      // Right("The past, present and future walk into a bar...it was tense.")

## 混合比喻
      
      let fs = require('fs');
      
      //readFile :: String -> IO string
      let readFile = (filename) => new IO (() => fs.readFileSync(filename, 'utf-8'));
      
      // print :: String -> IO String
      let print = (x => new IO(() =>{
         console.log(x);
         return x));
       }
       
      // cat :: String -> IO (IO string)
      let cat = compose(map(print), readFile);
      
      cat('.git/config')
      // IO(IO( string ))
      
这里是想要一个 `IO` 但是它又陷进另一个`IO`里 要想使用它，必须这样调用 `map(map(f))`; 要想观察它的作用，必须要： `$vlaue().$value()`

      // cat :: String -> IO (IO String)
      let cat = compose(map(print),readFile);
      
      // catFirstChar :: String -> IO(IO String)
      let catFirstChar = compose(map(map(head)), cat);
      
      catFirstChar('.git/config')
      // IO(IO('['))
      
另一种情况：

      // safeProp :: key -> { key: a} -> maybe a
      let safeProp = curry((x,obj) => new Maybe(obj[x]));
      
      // safeHead :: [a] -> Maybe a
      let safeHead = safeProp(0);
      
      // firstAddressStreet :: User -> Maybe (maybe (maybe Street))
      let firstAddressStreet = compose(map(map(safeProp('street'))), map(safeHead), safeProp('assresses'));
      
      firstAddressStreet({addresses: [{street: {name: 'mulb', number: 8848}, postcode: 'WC2N'}]});
      // Maybe(Maybe(Maybe({name:mulb},number: 8848)))
      
的 functor 同样是嵌套的，函数中三个可能的失败都用了 Maybe 做预防也很干净整洁,但是调用者调用三次 map 才能取到值。这种嵌套 functor 的模式会时不时地出现，而且是 monad 的主要使用场景。

` 说monad 像洋葱，那是因为当我们用 map 剥开嵌套的 functor 以获取它里面的值的时候，就像剥洋葱一样让人忍不住想哭`

#### join 方法
 如果有两层相同类型的嵌套，可以用 `join` 方法把它们压扁到一块去。这种结合的能力，functor 之间的联姻，就是 monad 之所以成为 monad的原因。
 > monad 是可以变扁(flatten) 的 pointed functor 
 
 一个 functor，只要它定义个了一个 join 方法和一个 of 方法，并遵守一些定律，那么它就是一个 monad。join 的实现并不太复杂，我们来为 Maybe 定义一个：
 
       Maybe.prototype.join = functor join(){
         return this.inNothing() ? Maybe.of(null) : this.$vlaue
       }
       
如果有一个 `Maybe(Maybe(x))` ,那么 `$value` 将会移除多余的一层，然后就能安心的从那开始进行 `map`。要不然，我们就将会只有一个 Maybe，因为从一开始就没有任何东西被 map 调用。

`firstAddressStreet` 例子

      //  join :: Monad m => m (m a) -> m a
      var join = function(mma){ return mma.join(); }

      //  firstAddressStreet :: User -> Maybe Street
      var firstAddressStreet = compose(
        join, map(safeProp('street')), join, map(safeHead), safeProp('addresses')
      );

      firstAddressStreet(
        {addresses: [{street: {name: 'Mulburry', number: 8402}, postcode: "WC2N" }]}
      );
      // Maybe({name: 'Mulburry', number: 8402})
      
给`IO` 加 `jion`

      IO .prototype.join = function() {
        return this.$value();
      }
同样是简单的移除一层容器。还没有提及纯粹性的问题，仅仅是移除过度紧缩的包裹中的一层

      //  log :: a -> IO a
      var log = function(x) {
        return new IO(function() { console.log(x); return x; });
      }

      //  setStyle :: Selector -> CSSProps -> IO DOM
      var setStyle = curry(function(sel, props) {
        return new IO(function() { return jQuery(sel).css(props); });
      });

      //  getItem :: String -> IO String
      var getItem = function(key) {
        return new IO(function() { return localStorage.getItem(key); });
      };

      //  applyPreferences :: String -> IO DOM
      var applyPreferences = compose(
        join, map(setStyle('#main')), join, map(log), map(JSON.parse), getItem
      );


      applyPreferences('preferences').unsafePerformIO();
      // Object {backgroundColor: "green"}
      // <div style="background-color: 'green'"/>
      
## chain 函数

总是在紧跟着 map 的后面调用 join。让我们把这个行为抽象到一个叫做 chain 的函数里。

