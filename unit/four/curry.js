const curry = require('lodash').curry;

let add = function(x){
  return function(y){
    return x + y;
  };
};
var increment = add(1);
var addTen = add(10);


 // -----------------------------------------------------------------
/**
 * 返回包含空格的数组
 * @param  {[boolean]} what [description]
 * @param  {[string]} str  [description]
 * @return {[array]}      [description]
 */
let match = curry(function(what,str) {
  return str.match(what);
}); 

/**
 * 查找替换
 * @param  {[boolean]} what        [description]
 * @param  {[string]} replacement [description]
 * @param  {[string]} str         [description]
 * @return {[string]}             [description]
 */
let replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement)
});


module.exports ={
  increment,
  addTen,
  match,
  replace,
}