
const {TOW,THREE} = require( '../../comm/number.js' );

/**
 * 容器
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
let Container = function( x ) {
  this.__value = x;
};

Container.of = function( x ) {
  return new Container( x ); 
};

Container.of( THREE );
//=> Container(3)

// (a -> b) -> Container a -> Container b
Container.prototype.map = function( f ){
  return Container.of( f( this.__value ) );
};
Container.of( TOW ).map( function( two ){
  return two + TOW;
} );
