/*eslint  */
const {ONE,TOW,THREE,TEN,TWENTY} = require( '../../comm/number.js' );
const {match,filter} = require( '../four/curry.js' );
const {add,id,last,head} = require( '../five/compose.js' );
const _ = require( 'ramda' );
const $ = require( 'jquery' );

const Postgres = require( 'pg' );
const Handlebars = require( 'Handlebars' );
const compose = require( 'ramda' ).compose;
const curry = require( 'ramda' ).curry;
const concat = require( 'ramda' ).concat;
const prop = require( 'ramda' ).prop;
const split = require( 'ramda' ).split;
const eq = require( 'ramda' ).split;
const sortBy = require( 'ramda' ).sortBy;
const moment = require( 'moment' ); //日期插件

const Window = require( 'window' );
 
const window = new Window();

function inspect ( x ) {
  return ( typeof x === 'function' ) ? inspectFn( x ) : inspectArgs( x );
}

function inspectFn( f ) {
  return ( f.name ) ? f.name : f.toString();
}

function inspectArgs( args ) {
  return args.reduce( function( acc, x ){
    return acc += inspect( x );
  }, '(' ) + ')';
}


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

// fortune :: Number -> String
const fortune = compose( concat( 'If you survive, you will be ' ), toString, add( ONE ) );

// either :: (a->c) -> (b->c) -> Either a b -> c
const either = curry( ( f, g, e ) =>{
  let result;
  
  switch ( e.constructor ) {
  case Left:
    result = f( e.$value );
    break;
  case Right:
    result = g( e.$value );
    break;
  }
  
  return result;
} );

// consoles :: User ->
const consoles = compose( either( id, fortune ),getAge( moment() ) );
consoles( {birthDate:'2005-12-12'} );
consoles( {birthdate: 'balloons!'} );

// -----------------------------------------------------

// getFromStorage :: String -> (_ -> String)
// const getFromStorage = key => () => window.localStorage[key];

class IO {
  static of( x ) {
    return new IO( () => x );
  }

  constructor( fn ) {
    this.$value = fn;  // 可以直接使用 实例.$value()运行获取内部数据
  }

  map( fn ) {
    return new IO( compose( fn, this.$value ) );
  }

  inspect() {
    return `IO( ${ inspect( this.$value ) } )`;
  }
}

// iowindow :: IO iowindow
const ioWindow = new IO( () => window );

ioWindow.map( win => win.innerWidth );

// window.location.href = 'http:localhost:8000/blog/posts';

ioWindow.map( prop( 'location' ) ).map( prop( 'href' ) ).map( split( '/' ) );

// url :: IO String
let url = new IO( () => window.location.href );

// toPairs :: String -> [[String]]
let toPairs = compose( map( split( '=' ) ), split( '&' ) );

// params :: String -> [[String]]
let params = compose( toPairs, last, split( '?' ) );

// findParam :: String -> IO Maybe [String]
const findParam = key => map( compose( Maybe.of, filter( compose( eq( key ), head ) ), params ), url );

// run it by calling $value()!
findParam( 'searchTerm' ).$value();   // 运行$value函数
// Just([['searchTerm', 'wafflehouse']])

//  -------------------------------------------------------------------------------------------------------
// 异步任务
//  -------------------------------------------------------------------------------------------------------

let fs = require( 'fs' );
let {task} = require( 'folktale/concurrency/task' );
// readFile :: String -> Task(Error,JSON)
let readFile = filename => task( ( reject, result ) => {
  fs.readFile( filename, 'utf-8', ( err, data ) => ( err ? reject( err ) : result( data ) ) );
} );

readFile( 'metamorphosis' ).map( split( '\n' ) ).map( head );

// jQuery getJSON example:
//========================

//  getJSON :: String -> {} -> task(Error, JSON)
var getJSON = curry( function( url, params ) {
  return task( function( reject, result ) {
    $.getJSON( url, params, result ).fail( reject );
  } );
} );

getJSON( '/video', { id: 10 } ).map( _.prop( 'title' ) );
// task("Family Matters ep 15")

// 传入普通的实际值也没问题
task( THREE ).map( function( three ){ 
  return three + ONE;
} );
// Task(4)
// Pure application
//=====================
// blogTemplate :: String
let blogTemplate = 'test';
//  blogPage :: Posts -> HTML
var blogPage = Handlebars.compile( blogTemplate );

//  renderPage :: Posts -> HTML
var renderPage = compose( blogPage, sortBy( 'date' ) );

//  blog :: Params -> Task(Error, HTML)
var blog = compose( map( renderPage ), getJSON( '/posts' ) );

// Impure calling code
//=====================
blog( { } ).fork(
  function( error ){ 
    $( '#error' ).html( error.message ); 
  },
  function( page ){ 
    $( '#main' ).html( page ); 
  }
);

$( '#spinner' ).show();

// Postgres.connect :: Url -> IO DbConnection
// runQuery :: DbConnection -> ResultSet
// readFile :: String -> Task Error String

// Pure application
//====================

//dburl :: Confing -> Either Error url
let dbUrl = ( c ) => ( c.name && c.pass && c.host && c.bd ) ? Right.of( 'db:pg://' + c.uname + ':' + c.pass + '@' + c.host + '5432/' + c.db ) : Left.of( Error( 'invalid config' ) );

// connectDB :: Config -> Either Error (IO DbConnection)
let connectDB = compose( map( Postgres.connect ), dbUrl );

// getConfig :: Filename -> Task Error (Either Error (IO DbConnection))
let getConfig = compose( map( compose( connectDB,JSON.parse ) ) , readFile );

getConfig( 'db.json' ).fork(
  Error( 'couldn not read file' ), either( )
);

module.exports = {
  IO,
  Maybe,
  task,
  Either,
  getJSON,
};
