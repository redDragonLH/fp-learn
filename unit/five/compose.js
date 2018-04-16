
const reduce = require( 'lodash' ).reduce;
/**
 * compose
 * @param  {function} f [description]
 * @param  {function} g [description]
 * @return {function}   [description]
 */
const compose = function(f,g){
  return function(x) {
    return f(g(x));
  };
};

/**
 * toUpperCase
 * @param  {function} x [description]
 * @return {function}   [description]
 */
let toUpperCase = function(x) {
  return x.toUpperCase();
};

/**
 * exclaim
 * @param  {function} x [description]
 * @return {function}   [description]
 */
let exclaim = function(x) {
  return x + '!';
};

/**
 * [shout description]
 * @type {string}
 */
const shout = compose(exclaim,toUpperCase);

shout('send in the clowns');

/**
 *  取列表第一个元素
 * @param  {array} x [description]
 * @return {string}   [description]
 */
let head = function(x) {
  return x[0];
};

/**
 * 反转列表
 * @param  {string} acc [description]
 * @param  {array} x   [description]
 * @return {function}     [description]
 */
let reverse = reduce(function(acc, x){ 
  return [x].concat(acc); 
}, []);

/**
 * 获取数组最后一个元素
 * 
 * @type {[type]}
 */
let last = compose(head,reverse);

last(['jumpkick', 'roundhouse', 'uppercut']);
// console.log(last(['jumpkick', 'roundhouse', 'uppercut']));
//=> 'uppercut'