const should = require('should');
const pf = require('../../unit/three/PureFunction.js');

let squareNumber = pf.squareNumber;

describe('PureFunction', function() {
  it('squareNumber Output 16', function() {
    should(squareNumber(4)).be.exactly(16).and.be.a.number;
  });
})