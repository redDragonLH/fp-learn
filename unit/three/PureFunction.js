 /**
  * 第三章，纯函数
  * @type {[type]}
  */

const _ = require('lodash');

/**
 * 可缓存性
 */

/**
 * memoize
 * @param  {[type]} f [description]
 * @return {[function]}   [description]
 * 简单实现
 */
 var memoize = function(f) {
   var cache = {};
 
   return function() {
     var arg_str = JSON.stringify(arguments);
     cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
     return cache[arg_str];
   };
 };
 
 let squareNumber  = memoize(function(x){ return x*x; });
 
 console.log(squareNumber(4));
 module.exports = {
   squareNumber,
   memoize
 }