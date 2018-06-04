/*global describe it*/
/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^win" }]*/
const should = require( 'should' );
const HM = require( '../unit/seven/hindley_milner.js' );
const {FOUR} = require( '../comm/number.js' );

describe( 'unit seven', function(){
  it( 'strLength', function(){
    should( HM.strLength( 'test' ) ).be.equal( FOUR );
  } );
  it( 'join', function(){
    should( HM.join( 'test' ) ).be.function;
  } );
  it( 'head', function(){
    should( HM.head( 'test' ) ).be.string;
  } );
} );
