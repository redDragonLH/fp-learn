/*global describe it*/
const should = require( 'should' );

const E = require( '../unit/eight/container.js' );
const { FOUR } = require( '../comm/number.js' );
describe( '第八章 容器', function(){
  it( 'inspect', function(){
    should( E.inspect( E.inspect ) ).be.string;
  } );
  var container = E.Container;
  it( 'Container', function(){
    should( container( FOUR ) ).be.string;
  } );
} );
