/*global describe it*/

const should = require( 'should' );
const pf = require( '../unit/three/PureFunction.js' );

let squareNumber = pf.squareNumber;
let memoize = pf.memoize;

let FOUR = 4;
let SIXTEEN = 16;
describe( '第三章 纯函数', function() {
  it( 'memoize output function',function(){
    should( memoize( ( x ) => x * x ) ).be.type( 'function' );
  } );
  
  it( 'squareNumber Output 16', function() {
    should( squareNumber( FOUR ) ).be.exactly( SIXTEEN ).and.be.a.number;
  } );
} );
