/*global describe it*/
const should = require( 'should' );

const E = require( '../unit/eight/container.js' );
const { FOUR,TWENTY } = require( '../comm/number.js' );
describe( '第八章 容器', function(){
  it( 'inspect', function(){
    should( E.inspect( E.inspect ) ).be.string;
  } );
  it( 'inspectArgs', function(){
    should( E.inspect( [ E.inspect, E.inspect ] ) ).be.string;
  } );
  var container = E.Container;
  describe( 'Container', function(){
    it( 'Container', function(){
      should( container( FOUR ) ).be.object;
    } );
    it( 'Container of', function(){
      should( container.of( FOUR ) ).be.object;
    } );
  } );
  it( 'map', function(){
    should( E.map( container , [ FOUR, FOUR, FOUR ] ) ).be.Array;
  } );
  describe( 'IO', function(){
    console.log( E.ioWindow.$value());
    it( 'IO', function(){
      should( E.ioWindow.map( win => win.innerWidth ) ).be.object;
    } );
    it( 'IO run', function(){
      should( E.ioWindow.$value() ).be.object;
    } );
    it( 'IO inspect', function(){
      should( E.ioWindow.inspect() ).be.object;
    } );
  } );
} );
