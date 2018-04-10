const should = require('should');
const locacurry = require('../../unit/four/curry.js');
const curry = require('lodash').curry;

let increment = locacurry.increment;
let addTen = locacurry.addTen;
let match = locacurry.match;
let replace = locacurry.replace;

describe('第四章 柯里化', function(){
  it('increment add 2 equal 3', function(){
    should(increment(2)).be.equal(3);
  });
  it('addTen add 10 equal 20', function(){
    should(addTen(10)).be.equal(20);
  });
  it('match return array', function() {
    should(match(/\s+/g, "hello world")).be.array;
  })
  var hasSpaces = match(/\s+/g);
  it('hasSpaces return array', function() {
    should(hasSpaces( "hello world")).be.array;
  })
});