const curry = require( 'lodash' ).curry;

let window = global ? global : window;
let add = function( x ){
  return function( y ){
    return x + y;
  };
};
const ONE = 1;
const TEN = 10;
let increment = add( ONE );
let addTen = add( TEN );


// -----------------------------------------------------------------
/**
 * 返回包含空格的数组
 * @param  {[boolean]} what [description]
 * @param  {[string]} str  [description]
 * @return {[array]}      [description]
 */
let match = curry( function( what, str ) {
  return str.match( what );
} ); 

/**
 * 查找替换
 * @param  {[RegExp]} what        [description]
 * @param  {[string]} replacement [description]
 * @param  {[string]} str         [description]
 * @return {[string]}             [description]
 */
let replace = curry( function( what, replacement, str ) {
  return str.replace( what, replacement );
} );

/**
 * [description]
 * @param  {[function]} f   [description]
 * @param  {[array]} ary [description]
 * @return {[array]}     [description]
 */
let filter = curry( function( f, ary ) {
  return ary.filter( f );
} );

/**
 * [description]
 * @param  {[function]} f   [description]
 * @param  {[array]} ary [description]
 * @return {[array]}     [description]
 */
let map = curry( function( f, ary ) {
  return ary.map( f );
} );

// 柯里化事件监听封装
/**
 * 事件监听
 * @return {function} 适用于当前环境的事件监听函数
 */

let addEvent = ( function() {
  if( window.addEventListener ) {
    return function( ele,type,fn,isCapture ) {
      ele.addEventListener( type, fn, isCapture );
    };
  } else if( window.attachEvent ) {
    return function( ele, type, fn ) {
      ele.attachEvent( 'on' + type, fn );
    };
  }
} )();

// 防抖-------
// 针对高频事件，防抖就是将多个触发间隔接近的事件函数指向，合并成一次函数执行

/**
 * 防抖
 * @param  {Function} fn          事件处理函数
 * @param  {number}   delay       延迟时间
 * @param  {Boolean}  isImmediate 是否立即执行
 * @return {function}               事件处理函数
 */
let debounce = function ( fn, delay, isImmediate ) {
  // 使用闭包，保存执行状态，控制函数调用顺序
  let timer;
  
  return function() {
    let _args = [].slice.call( arguments );
    let context = this;
    
    clearTimeout( timer );
    
    let _fn = function(){
      timer = null;
      if( !isImmediate ) {
        fn.apply( context, _args );
      }
    };
    
    // 是否滚动时立刻执行
    let callNow = !timer && isImmediate;
    
    timer = setTimeout( _fn, delay );
    
    if( callNow ) {
      fn.apply( context, _args );
    }
  };
};


/**
 * [hasSpaces description]
 * @type {Boolean}
 */
let hasSpaces = match( /\s+/g );

hasSpaces( 'hello world' );
// [ ' ' ]
hasSpaces( 'spaceless' );
// null

filter( hasSpaces, [ 'tori_spelling', 'tori amos' ] );
// ["tori amos"]

let findSpaces = filter( hasSpaces );
// function(xs) { return xs.filter(function(x) { return x.match(/\s+/g) }) }

findSpaces( [ 'tori_spelling', 'tori amos' ] );
// ["tori amos"]

let noVowels = replace( /[aeiou]/ig );
// function(replacement, x) { return x.replace(/[aeiou]/ig, replacement) }
var censored = noVowels( '*' );
// function(x) { return x.replace(/[aeiou]/ig, "*") }

censored( 'Chocolate Rain' );
// 'Ch*c*l*t* R**n'

// 练习


module.exports = {
  increment,
  addTen,
  match,
  replace,
  filter,
  map,
  hasSpaces,
  findSpaces,
  noVowels,
  censored,
  addEvent,
  debounce,
};
