const curry = require( 'lodash' ).curry;
const {ONE,TEN,SIXTY,ONETHOUSAND} = require( '../../comm/number.js' );
const Window = require( 'window' );
const window = new Window();
let add = function( x ){
  return function( y ){
    return x + y;
  };
};
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
// ie 环境

let iEaddEvent = ( function(){
  let oldaddEventListener = window.addEventListener;
  window.addEventListener = null;
  window.attachEvent = true;
  let attachEvent = addEvent;
  window.addEventListener = oldaddEventListener;
  window.attachEvent = null;
  return attachEvent;
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

// 节流 -------------
// 节流也是将多个触发间隔接近的事件函数执行，合并成一次函数执行，并且在指定的时间内至少执行一次事件处理函数。
// 节流实现原理跟防抖技术类似，但是比防抖多了一次函数执行判断

/**
 * [description]
 * @param  {Function} fn   事件处理函数
 * @param  {Number}   wait 延迟时间
 * @return {Function}      事件处理函数
 */
let throttle = function( fn, wait ) {
  let timer;
  let previous;
  let now;
  let diff;
  return function(){
    let _args = [].slice.call( arguments );
    let context = this;
    // 储存当前时间戳
    now = Date.now();
    let _fn = function(){
      // 储存上一次执行的时间戳
      previous = Date.now();
      timer = null;
      fn.apply( context, _args );
    };
    
    clearTimeout( timer );
    
    if ( previous !== undefined ) {
      // 时间差
      diff = now - previous;
      if( diff >= wait ){
        fn.apply( context, _args );
        previous = now;
      } else {
        timer = setTimeout( _fn, wait );
      }
    } else {
      _fn();
    }
  };
};


// 使用浏览器帧频刷新自动调用的方法(requestAnimationFrame)实现 节流

// 解决 requestAnimationFrame 兼容问题
let raFrame = window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame ||  
    window.msRequestAnimationFrame || 
    function( callback ) {
      setTimeout( callback, ONETHOUSAND / SIXTY );
    };

// 柯里化封装
/**
 * [description]
 * @param  {Function} fn [description]
 * @return {function}      [description]
 */
let rafThrottle = function( fn ) {
  let isLocked;
  return function(){
    let context = this;
    let _args = arguments;
    
    if( isLocked ) {
      return;
    }
    
    isLocked = true;
    raFrame( function(){
      isLocked = false;
      fn.apply( context, _args );
    } );
  };
};

/**
 * [createCurry description]
 * @param  {Function} fn [description]
 * @return {Function}      [description]
 */
function createCurry ( fn ){
  if( typeof fn !== 'function' ) {
    throw Error( 'fn is not function' );
  }
  // 复用第一个参数
  let args = [].slice.call( arguments, ONE );
  // 返回新函数
  return function(){
    // 收集剩余参数
    let _args = [].slice.call( arguments );
    // 返回结果
    return fn.apply( this,args.comcat( _args ) );
  };
}

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
  throttle,
  rafThrottle,
  raFrame,
  iEaddEvent,
  createCurry,
};
