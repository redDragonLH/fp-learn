/*global describe it*/
const should = require('should');
const composes = require('../unit/five/compose.js');
let f = function(x){
  return x[0];
};
describe('第五章 组合', function(){
  it('map return array', function() {
    should(composes.map(f,['jumpkick', 'roundhouse', 'uppercut'])).be.a.array;
  });
  it('compose return function', function() {
    should(composes.compose(composes.map,f)).be.a.function;
  });
  it('toUpperCase return string', function() {
    should(composes.toUpperCase('string')).be.a.string;
  });
  it('exclaim return string', function() {
    should(composes.exclaim('string')).be.a.string;
  });
  it('shout return string', function() {
    should(composes.shout('string')).be.a.string;
  });
  it('head return string', function() {
    should(composes.head(['string','array'])).be.a.string;
  });
  
  it('reverse return array', function() {
    should(composes.reverse(['string','array'])).be.a.array;
  });
  it('last return string', function() {
    should(composes.last(['string','array'])).be.a.string;
  });
  it('isLastInStock return false', function() {
    should(composes.isLastInStock(composes.CARS)).be.a.string;
  });
  it('nameOfFirstCar return false', function() {
    should(composes.nameOfFirstCar(composes.CARS)).be.equal('Ferrari FF').be.a.string;
  });
  it('add return 3', function() {
    should(composes.add(1,2)).be.equal(3).be.a.number;
  });
  it('averageDollarValue return number', function() {
    should(composes.averageDollarValue(composes.CARS)).be.a.number;
  });
});

