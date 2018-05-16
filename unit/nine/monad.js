const {IO,Maybe,task,Either} = require( '../eight/container.js' );
const {ZROE,ONE,TOW} = require( '../../comm/number.js' );

const concat = require( 'ramda' ).concat;
const curry = require( 'ramda' ).curry;
const compose = require( 'ramda' ).compose;
const map = require( 'ramda' ).map;
const _ = require( 'ramda' );
const {add} = require( '../five/compose.js' );

IO.of( 'tetris' ).map( concat( 'master' ) );
// IO("tetris master")

Maybe.of( TOW ).map( add( ONE ) );
// Maybe(3)

task( [ { id: 2 }, { id: 3 } ] ).map( _.prop( 'id' ) );
// Task([2,3])

Either.of( 'The past, present and future walk into a bar...' ).map( concat( 'it was tense.' ) );
// Right("The past, present and future walk into a bar...it was tense.")


/* 
 *   join 方法
 * 
 */

/**
 * 
 * @return {Maybe || value } 
 */
Maybe.prototype.join = function() {
  return this.isNothing() ? Maybe.of( null ) : this._value;
};

// safeProp :: Key -> {Key: a} -> Maybe a
const safeProp = curry( ( x, obj ) => Maybe.of( obj[x] ) );

// safeHead :: [a] -> Maybe a
const safeHead = safeProp( ZROE );

// join :: Monad m => m (m a) -> m a 
let join = mma => mma.join();

// firstAddressStreet :: User -> Maybe Street
let firstAddressStreet = compose(
  join,
  map( safeProp( 'street' ) ),
  join,
  map( safeHead ),safeProp( 'addresses' )
);

firstAddressStreet( {
  addresses: [ { street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' } ],
} );
// Maybe({name: ’mulb})

/**
 * @return {value} 
 */
IO.prototype.join = function(){
  return this.$value();
};


