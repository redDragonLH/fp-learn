const _ = require('ramda');
// const reduce = require( 'lodash' ).reduce;
const curry = require( 'lodash' ).curry;

let reduce = curry(function(f, a, xs) {
    return xs.reduce(f, a);
});
let map = curry(function (f, xs) {
    return xs.map(f);
});
/**
 * compose
 * @param  {function} f [description]
 * @param  {function} g [description]
 * @return {function}   [description]
 */
const compose = function(f,g){
  // console.log(g);
  return function(x) {
    return f(g(x));
  };
};
/**
 * debug
 * @param  {[type]} tag [description]
 * @param  {[type]} x   [description]
 * @return {[type]}     [description]
 */
let trace = curry(function(tag, x){  
  console.log(tag, x); // eslint-disable-line no-console
  return x;
});
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
var reverse = reduce(function(acc, x){ 
  return [x].concat(acc); 
}, []);
/**
 * 获取数组最后一个元素
 * 
 * @type {[type]}
 */
let last = compose(head,reverse);
last(['jumpkick', 'roundhouse', 'uppercut']);
//=> 'uppercut'

// 练习-----

// 示例数据
let CARS = [
    {name: 'Ferrari FF', horsepower: 660, dollarValue: 700000, inStock: true},
    {name: 'Spyker C12 Zagato', horsepower: 650, dollarValue: 648000, inStock: false},
    {name: 'Jaguar XKR-S', horsepower: 550, dollarValue: 132000, inStock: false},
    {name: 'Audi R8', horsepower: 525, dollarValue: 114200, inStock: false},
    {name: 'Aston Martin One-77', horsepower: 750, dollarValue: 1850000, inStock: true},
    {name: 'Pagani Huayra', horsepower: 700, dollarValue: 1300000, inStock: false}
  ];

// 练习 1:
// ============
// 使用 _.compose() 重写下面这个函数。提示：_.prop() 是 curry 函数
  // var isLastInStock = function(cars) {
  //   var last_car = _.last(cars);
  //   return _.prop('in_stock', last_car);
  // };

let isLastInStock = compose(_.prop('inStock'), _.last);
isLastInStock(CARS);

// 练习 2:
// ============
// 使用 _.compose()、_.prop() 和 _.head() 获取第一个 car 的 name

let nameOfFirstCar =  _.compose(_.prop('name'),_.head());
nameOfFirstCar(CARS);

// 练习 3:
// ============
// 使用帮助函数 _average 重构 averageDollarValue 使之成为一个组合


let add = curry(function(x, y) {
    return x + y;
});
let _average = function(xs) {
   return reduce(add, 0, xs) / xs.length; 
 }; // <- 无须改动

// let averageDollarValue = function(cars) {
//   var dollar_values = map(function(c) { return c.dollar_value; }, cars);
//   return _average(dollar_values);
// };

var averageDollarValue = _.compose(_average, _.map(_.prop('dollarValue')));
averageDollarValue(CARS);

module.exports = {
  reduce,
  map,
  compose,
  trace,
  toUpperCase,
  exclaim,
  shout,
  head,
  reverse,
  last,
  isLastInStock,
  nameOfFirstCar,
  add,
  _average,
  averageDollarValue,
  CARS
};