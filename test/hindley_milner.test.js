/*global describe it*/
/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^win" }]*/
const should = require( 'should' );
const HM = require( '../unit/seven/hindley_milner.js' );
const {FOUR} = require( '../comm/number.js' );

describe( '第七章', function(){
  it( 'strLength', function(){
    should( HM.strLength( 'test' ) ).be.equal( FOUR );
  } );
  it( 'join', function(){
    should( HM.join( 'test' ) ).be.function;
  } );
  it( 'head', function(){
    should( HM.head( 'test' ) ).be.string;
  } );
  it( 'replace', function(){
    should( HM.replace( /test/,'test','test' ) ).be.string;
  } );
  it( 'match', function(){
    should( HM.match( /test/ , 'test' ) ).be.object;
  } );
  it( 'id', function(){
    should( HM.id( 'test' ) ).be.string;
  } );
  it( 'map', function(){
    should( HM.map( HM.id ,[ FOUR,FOUR ] ) ).be.object;
  } );
} );
