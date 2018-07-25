/*eslint no-global-assign: "error"*/
/*globals localStorage:true*/
const {IO,Maybe,task,Either,getJSON} = require( '../eight/container.js' );
const {ZROE,ONE,TOW} = require( '../../comm/number.js' );

const jQuery = require( 'jquery' );
const concat = require( 'ramda' ).concat;
const curry = require( 'ramda' ).curry;
const compose = require( 'ramda' ).compose;
const map = require( 'ramda' ).map;
const _ = require( 'ramda' );
const {add} = require( '../five/compose.js' );

// typeof 在判断时就算变量不存在也不会报错
// if ( typeof window === 'undefined' || window === null ) {
//   const Window = require( 'window' );
// 
//   const window = new Window();
// }

if ( typeof localStorage === 'undefined' || localStorage === null ) {
  const LocalStorage = require( 'node-localstorage' ).LocalStorage;
  localStorage = new LocalStorage( './localStorage' );
}
localStorage.setItem( 'preferences', '23333' );

// ----------------------------正式内容----------------------------// 



IO.of( 'tetris' ).map( concat( 'master' ) );
// IO("tetris master")

Maybe.of( TOW ).map( add( ONE ) );
// Maybe(3)

task( [ { id: 2 }, { id: 3 } ] ).map( _.prop( 'id' ) );
// Task([2,3])

Either.of( 'The past, present and future walk into a bar...' ).map( concat( 'it was tense.' ) );
// Right("The past, present and future walk into a bar...it was tense.")


/* 
 *   join 方法
 * 
 */

/**
 * 
 * @return {Maybe || value } 
 */
Maybe.prototype.join = function() {
  return this.isNothing() ? Maybe.of( null ) : this._value;
};

// safeProp :: Key -> {Key: a} -> Maybe a
const safeProp = curry( ( x, obj ) => Maybe.of( obj[x] ) );

// safeHead :: [a] -> Maybe a
const safeHead = safeProp( ZROE );

// join :: Monad m => m (m a) -> m a 
let join = mma => mma.join();

// firstAddressStreet :: User -> Maybe Street
let firstAddressStreet = compose(
  join,
  map( safeProp( 'street' ) ),
  join,
  map( safeHead ),safeProp( 'addresses' )
);

firstAddressStreet( {
  addresses: [ { street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' } ],
} );
// Maybe({name: ’mulb})

/**
 * @return {value} 
 */
IO.prototype.join = function(){
  return this.$value();
};

// 同样是简单地移除了一层容器。没有提及纯粹性的问题，仅仅是移除过度紧缩的包裹中的一层而已。

// log :: a -> IO a

let log = ( x ) => new IO( () => {
  // console.log( x ); 
  return x ;
} );  //打印数据，但是放到IO里

// setStyle :: selector -> CSSProps -> IO DOM
let setStyle = curry( ( sel, props ) => new IO( () => jQuery( sel ).css( props )  ) ); //参数 dom 和 样式属性

// getItem :: String -> IO String
let getItem = ( key ) => new IO( () => localStorage.getItem( key ) ); // 获取本地储存里的 内容

let applyPreferences = compose( join, map( setStyle( '#main' ) ), join, map( log ), map( JSON.parse ), getItem );
applyPreferences( 'preferences' );
// applyPreferences('preferences').unsafePerformIO();
// Object {backgroundColor: "green"}
// <div style="background-color: 'green'"/>

/*
 *
 * chain 函数
 *
 * map 后面紧跟着一个 join 函数，可以把这个行为抽象到一个叫做 chain 的函数里
 * 
 */

// chain :: Monad m => ( a -> m b) -> m a -> m b
let chain = curry( ( f, m ) => m.map( f ).join() );  // 或者compose(join, map(f))(m)

// 重构 firstAddressStreet  和 applyPreferences 
// // map/join
/*
 *  var firstAddressStreet = compose(
 *    join, map(safeProp('street')), join, map(safeHead), safeProp('addresses')
 *  );
*/
//  chain
let firstAddressStreetChain = compose(
  chain( safeProp( 'street' ) ), chain( safeHead ), safeProp( 'addresses' ) 
);
  
firstAddressStreetChain( {
  addresses: [ { street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' } ],
} );
// map/join
/*
 * var applyPreferences = compose(
 *  join, map(setStyle('#main')), join, map(log), map(JSON.parse), getItem
 * );
*/
let applyPreferencesChain = compose(
  chain( setStyle( '#main' ) ), join, map( log ), map( JSON.parse ), getItem 
);
applyPreferencesChain( 'preferences' );
/**
 * 因为 chain 可以轻松地嵌套多个作用，因此我们就能以一种纯函数式的方式表示 序列 和 变量赋值
 * 
 */
// getJSON :: url -> Params -> Task JSON
// querySelector :: selector -> IO DOM

getJSON( './authenticate', { username: 'stale', passWord: 'crackers'} )
  .chain( ( user ) => getJSON( './friends', { userId: user.id } ) );
// Task([{name: 'seimith', id: 14}, {name: 'Ric', id: 39}]);

module.exports = {
  localStorage,
};
