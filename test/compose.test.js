/*global describe it*/
const should = require('should');
const composes = require('../unit/five/compose.js');
let f = composes.map(function(x){
  return x[0];
});
describe('map', function(){
  it('map return array', function() {
    should(f(['jumpkick', 'roundhouse', 'uppercut'])).be.a.array;
  });
});
