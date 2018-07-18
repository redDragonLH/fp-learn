const curry = require( 'ramda' ).curry;

//  strLength :: String -> Number 
//  类型签名 输入字符串，返回数字
var strLength = function( s ){
  return s.length;
};
//  join :: String -> [String] -> String
//  接受两个字符串，返回一个字符串
var join = curry( function( what, xs ){
  return xs.join( what );
} );
//  match :: Regex -> String -> [String]
var match = curry( function( reg, s ){
  return s.match( reg );
} );
//  replace :: Regex -> String -> String -> String
var replace = curry( function( reg, sub, s ){
  return s.replace( reg, sub );
} );
//  head :: [a] -> a
var head = function( xs ){
  return xs[0]; 
};
//  id :: a -> a
var id = function( x ){ 
  return x; 
};
//  map :: (a -> b) -> [a] -> [b]
var map = curry( function( f, xs ){
  return xs.map( f );
} );

module.exports = {
  strLength,
  join,
  match,
  replace,
  head,
  id,
  map,
};
