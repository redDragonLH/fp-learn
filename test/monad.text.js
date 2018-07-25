/*global describe it*/

const should = require( 'should' );
const M = require( '../unit/nine/monad.js' );

describe( '第九章 洋葱', function() {
  it( 'localStorage',function(){
    should( M.localStorage ).be.type( 'object' );
  } );
} );
