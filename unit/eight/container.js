
const {TOW,THREE,TEN,TWENTY} = require( '../../comm/number.js' );
const {match} = require( '../four/curry.js' );
const {add,compose} = require( '../five/compose.js' );
const _ = require( 'ramda' );
const curry = require( 'lodash' ).curry;
const moment = require( 'moment' ); //日期插件


//  map :: Functor f => (a -> b) -> f a -> f b
const map = curry( function( f, anyFunctorAtAll ) {
  return anyFunctorAtAll.map( f );
} );

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
Container.prototype.map = function( f ) {
  return Container.of( f( this.__value ) );
};

Container.of( TOW ).map( function( two ) {
  return two + TOW;
} );

/*---------------*/
let Maybe = function ( x ) {
  this._value = x;
};

Maybe.of = function( x ) {
  return new Maybe( x );
};

Maybe.prototype.isNothing = function( ) {
  return ( this._value === null || this._value === undefined );
};

Maybe.prototype.map = function ( f ) {
  return this.isNothing() ? Maybe.of( null ) : Maybe.of( f( this._value ) );
};

Maybe.of( 'Malkovich Malkovich' ).map( match( /a/ig ) );
//=> Maybe(['a', 'a'])
 
Maybe.of( null ).map( match( /a/ig ) );
//=> Maybe(null)

Maybe.of( { name: 'Dinah', age: TEN } ).map( _.prop( 'age' ) ).map( add( TEN ) );
//=> Maybe(24)

/**
 * 例子
 */
// maybe 最常用在那些可能会无法成功返回结果的函数中

// safeHead :: [a] -> Maybe(a)
let safeHead = function ( xs ) {
  return Maybe.of( xs[0] );
};

let streeName = compose( map( _.prop( 'street' ) ),safeHead, _.prop( 'addresses' ) );
streeName( {addresses: [] } );
// Maybe(null)

streeName( { addresses: [ { street: 'Shady Ln.', number: 4201 } ] } );
// Maybe("Shady Ln.")

// 明确返回一个 Maybe（null） 来表明失败

//  withdraw :: Number -> Account -> Maybe(Account)
let withdraw = curry( function( amount, account ) {
  return account.balance >= amount ? Maybe.of( {balance:account.balance - amount } ) : Maybe.of( null );
} );

let remainingBalance = function(){
};
let updateLedger = function(){
  
};
//  finishTransaction :: Account -> String
let finishTransaction = compose( remainingBalance, updateLedger );

//  getTwenty :: Account -> Maybe(String)
let getTwenty = compose( map( finishTransaction ) , withdraw( TWENTY ) );

getTwenty( { balance: 200.00} );
// Maybe("Your balance is $180.00")
getTwenty( { balance: 10.00} );
// Maybe(null)
// 这里的 null 是有意的。我们不用 Maybe(String) ，而是用 Maybe(null) 来发送失败的信号，这样程序在收到信号后就能立刻停止执行。这一点很重要：如果 withdraw 失败了，map 就会切断后续代码的执行，因为它根本就不会运行传递给它的函数，即 finishTransaction

//  maybe :: b -> (a -> b) -> Maybe a -> b
var maybe = curry( function( x, f, m ) {
  return m.isNothing() ? x : f( m.__value );
} );

//  getTwenty :: Account -> String
var getTwenty_ = compose(
  maybe( 'You\'re broke!', finishTransaction ), withdraw( TWENTY )
);


getTwenty_( { balance: 200.00 } );
// "Your balance is $180.00"

getTwenty_( { balance: 10.00 } );
// "You're broke!"

// 错误处理

class Either {
  static of( x ) {
    return new Right( x );
  }

  constructor( x ) {
    this.$value = x;
  }
}

class Left extends Either {
  map( ) {
    return this;
  }
  inspect() {
    return `Left(${this.$value})`;
  }
}
class Right extends Either {
  map( f ) {
    return Either.of( f( this.$value ) );
  }
  inspect() {
    return `Right( ${this.$value} )`;
  }
}
const left = x => new Left( x );
// getAge :: Date -> User -> Either(String, Number)
const getAge = curry( ( now, user ) => {
  const birthDate = moment( user.birthDate, 'YYYY-MM-DD' );

  return birthDate.isValid()
    ? Either.of( now.diff( birthDate, 'years' ) )
    : left( 'Birth date could not be parsed' );
} );

getAge( moment(), {  birthDate: '2005-12-12' } );
// Right(12)

getAge( moment(), { birthDate: 'July 4, 2001' } );
// Left('Birth date could not be parsed')

