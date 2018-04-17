/**
* 第三章，纯函数
* @type {[type]}
*/

// const _ = require('lodash');

/**
 * 可缓存性
 */

/**
 * memoize
 * @param  {[type]} f [description]
 * @return {[function]}   [description]
 * 简单实现
 */
let memoize = function( f ) {
  let cache = {};
  return function() {
    let argStr = JSON.stringify( arguments );
    cache[ argStr ] = cache[ argStr ] || f.apply( f, arguments );
    return cache[ argStr ];
  };
};
 
let squareNumber = memoize( function( x ){
  return x * x; 
} );
 
// test
const FOUR = 4;
squareNumber( FOUR );
module.exports = {
  squareNumber,
  memoize,
};
