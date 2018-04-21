/*global describe it*/
/*eslint no-magic-numbers: 0 */
const should = require( 'should' );

const {
  ONE,
  TOW,
  THREE,
  FOUR,
  TEN,
  TWENTY,
  SIXTEEN,
} = require( '../comm/number.js' );

describe( 'comm->number', function(){
  it( 'ONE is 1', function() {
    should( ONE ).be.equal( 1 ).be.number;
  } );
  
  it( 'TOW is 2', function() {
    should( TOW ).be.equal( 2 ).be.number;
  } );
  it( 'THREE is 3', function() {
    should( THREE ).be.equal( 3 ).be.number;
  } );
  it( 'FOUR is 4', function() {
    should( FOUR ).be.equal( 4 ).be.number;
  } );
  it( 'TEN is 10', function() {
    should( TEN ).be.equal( 10 ).be.number;
  } );
  it( 'SIXTEEN is 16', function() {
    should( SIXTEEN ).be.equal( 16 ).be.number;
  } );
  it( 'TWENTY is 20', function() {
    should( TWENTY ).be.equal( 20 ).be.number;
  } );
} );
