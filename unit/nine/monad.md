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

      //  chain :: Monad m => (a -> m b) -> m a -> m b
      var chain = curry(function(f, m){
        return m.map(f).join(); // 或者 compose(join, map(f))(m)
      });

`chain` 叫做 `>>=`（读作 bind）或者 `flatMap`；都是同一个概念的不同名称罢了

用 `chain`重构上面两个例子

      // map/join
      var firstAddressStreet = compose(
        join, map(safeProp('street')), join, map(safeHead), safeProp('addresses')
      );

      // chain
      var firstAddressStreet = compose(
        chain(safeProp('street')), chain(safeHead), safeProp('addresses')
      );
-------------

      // map/join
      var applyPreferences = compose(
        join, map(setStyle('#main')), join, map(log), map(JSON.parse), getItem
      );

      // chain
      var applyPreferences = compose(
        chain(setStyle('#main')), chain(log), map(JSON.parse), getItem
      );

`chain`可以轻松嵌套多个作用，因此我们就能以一种纯函数的方式来表示 `序列(sequence)`和 `变量赋值(variable assignment)`

      // getJSON :: Url -> Params -> Task JSON
      // querySelector :: Selector -> IO DOM
      
      getJSON('/authenticate', {username: 'stale', password: 'crackers'})
        .chain(function(user) { // 获取得到的数据再调用API获取数据。 嵌套两个getJSON
          return getJSON('/friends', {user_id: user.id});
      });
      // Task([{name: 'Seimith', id: 14}, {name: 'Ric', id: 39}]);

      querySelector("input.username").chain(function(uname) {
        return querySelector("input.email").chain(function(email) {
          return IO.of(  
            "Welcome " + uname.value + " " + "prepare for spam at " + email.value
          ); // 嵌套两个获取DOM操作最后再嵌套数据操作
        });
      });
      // IO("Welcome Olivia prepare for spam at olivia@tremorcontrol.net");
      
      Maybe.of(3).chain(function(three) {
        return Maybe.of(2).map(add(three));
      });
      // Maybe(5);
      
      Maybe.of(null).chain(safeProp('address')).chain(safeProp('street'));
      // Maybe(null);
      
也可以用 `compose` 写上面的例子，但是需要几个帮助函数，而且这种风格怎么说都要通过闭包进行明确的变量赋值。相反，我们用了插入式的`chain`。

`chain`可以自动从任意类型的 `map` 和`join` 衍生出来，就行这样

       t.prototype.chain = function(f) { 
         return this.map(f).join(); 
       }

如果`chain`是简单地通过结束调用 `of` 后把值放回容器这种方式定义的，那么就会造成一个有趣的后果，即可以从 `chain`那里衍生出一个`map`。同样地，我们还可以用 chain(id) 定义 join。

## 理论
结合律，不太熟悉的结合律

      // 结合律
      compose(join, map(join)) == compose(join, join)
    
这个定律表明了monad 的嵌套本质，所以结合律关心的是如何让内层或外层的容器类型`join`，然后取得同样的结果
![monad结合律](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/images/monad_associativity.png)

从左上角往下，先用 `jion` 合并 `M(M(M a))` 最外层的两个 `M`,然后往右，再调用一次 `join` ，就得到了我们想要的 `M a`。或者，从左上角往右，先打开最外围的 `M`,用 `map(join)` 合并内层的两个 `M`,然后再向下调用一次`join`，也能得到 `M a`。不管是先合并内层还是先合并外层的 `M`,最后都会得到相同的  `M a`,这就是结合律，。值得注意的是 `map(join) != join`。两种方式的中间步骤可能会有不同的值，但是最后一个`join`调用后最终结果是一样的。

      //同一律
      compose(join, of) == compose(join, map(of)) == id

这表明，对任意的monad `M`,`of`和`join`相当于 `id`。也可以使`map(of)`由内而外实现相同效果。
![三角同一律](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/images/triangle_identity.png)

如果从左上角开始往右，可以看到`of` 的确把`M a`丢到另一个`M`容器里去了。然后再往下`join`，就得到了`M a`，跟一开始就调用 `id`的的结果一样。从右上角往左，可以看到如果我们通过 `map`进到`M`里面，然后对普通值 `a` 调用`of`，最后得到的还是`M (M a)`;再调用一次 `join`将会把我们带回原点，即`M a`

尽管这里写的是 of，实际上对任意的 monad 而言，都必须要使用明确的 M.of。

是范畴遵循的定律！不我们需要一个组合函数来给出一个完整定义：

      var mcompose = function(f, g) {
       return compose(chain(f), chain(g));
      }

      // 左同一律
      mcompose(M, f) == f

      // 右同一律
      mcompose(f, M) == f

      // 结合律
      mcompose(mcompose(f, g), h) == mcompose(f, mcompose(g, h))

毕竟它们是范畴学里的定律。monad 来自于一个叫 `“Kleisli 范畴”`的范畴，这个范畴里边所有的对象都是 `monad`，所有的态射都是联结函数（chained funtions）。