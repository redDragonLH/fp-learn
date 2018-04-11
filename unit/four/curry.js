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
 * @param  {[RegExp]} what        [description]
 * @param  {[string]} replacement [description]
 * @param  {[string]} str         [description]
 * @return {[string]}             [description]
 */
let replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement);
});

/**
 * [description]
 * @param  {[function]} f   [description]
 * @param  {[array]} ary [description]
 * @return {[array]}     [description]
 */
let filter = curry(function(f,ary) {
  return ary.filter(f);
})

/**
 * [description]
 * @param  {[function]} f   [description]
 * @param  {[array]} ary [description]
 * @return {[array]}     [description]
 */
let map = curry(function(f,ary) {
  return ary.map(f);
})

/**
 * [hasSpaces description]
 * @type {Boolean}
 */
let hasSpaces = match(/\s+/g);

hasSpaces("hello world");
// [ ' ' ]
hasSpaces("spaceless");
// null

filter(hasSpaces, ["tori_spelling", "tori amos"]);
// ["tori amos"]

let findSpaces = filter(hasSpaces);
// function(xs) { return xs.filter(function(x) { return x.match(/\s+/g) }) }

findSpaces(["tori_spelling", "tori amos"]);
// ["tori amos"]

let noVowels = replace(/[aeiou]/ig);
// function(replacement, x) { return x.replace(/[aeiou]/ig, replacement) }
var censored = noVowels("*");
// function(x) { return x.replace(/[aeiou]/ig, "*") }

censored("Chocolate Rain");
// 'Ch*c*l*t* R**n'
module.exports ={
  increment,
  addTen,
  match,
  replace,
  filter,
  map,
  hasSpaces,
  findSpaces,
  noVowels,
  censored
}