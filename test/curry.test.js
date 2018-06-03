/*global describe it*/
/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^win" }]*/
const should = require( 'should' );
const locacurry = require( '../unit/four/curry.js' );
// const curry = require('lodash').curry;
const Window = require( 'window' );
const window = new Window();
const {ONE,TOW,THREE,TEN,TWENTY,ONETHOUSAND} = require( '../comm/number.js' );
let increment = locacurry.increment;
let addTen = locacurry.addTen;
let match = locacurry.match;
let replace = locacurry.replace;
let filter = locacurry.filter;
let map = locacurry.map;
let hasSpaces = locacurry.hasSpaces;
let findSpaces = locacurry.findSpaces;
let noVowels = locacurry.noVowels;
let censored = locacurry.censored;
let addEvent = locacurry.addEvent;
let debounce = locacurry.debounce;
let throttle = locacurry.throttle;
let rafThrottle = locacurry.rafThrottle;
let raFrame = locacurry.raFrame;
let iEaddEvent = locacurry.iEaddEvent;
let createCurry = locacurry.createCurry;
let TIME = 10;
let kfunction = function(){};
describe( '第四章 柯里化', function(){
  describe( 'unit four start example', function(){
    it( 'increment add 2 equal 3', function(){
      should( increment( TOW ) ).be.equal( THREE );
    } );
    it( 'addTen add 10 equal 20', function(){
      should( addTen( TEN ) ).be.equal( TWENTY );
    } );
  } );
  
  describe( 'match', function(){
    it( 'match return array', function() {
      should( match( /\s+/g, 'hello world' ) ).be.array;
    } );
    
    it( 'hasSpaces return array', function() {
      should( hasSpaces( 'hello world' ) ).be.array;
    } );
  } );
  describe( 'replace', function(){
    it( 'replace optput ok is a string',function(){
      should( replace( /\s+/g,' ', 'ok' ) ).be.equal( 'ok' ).be.string;
    } );
    
    let replaceSpaces = replace( /\s+/g );
    it( 'replaceSpaces optput ok is a string',function(){
      should( replaceSpaces( ' ', 'ok' ) ).be.equal( 'ok' ).be.string;
    } );
    
    it( 'noVowels output string',function(){
      should( noVowels( 'Chocolate Rain', '*' ) ).be.equal( '*' ).be.string;
    } );
    it( 'censored output string',function(){
      should( censored( 'Chocolate Rain' ) ).be.equal( 'Ch*c*l*t* R**n' ).be.string;
    } );
  } );
  describe( 'filter',function(){
    it( 'filter output array',function(){
      should( filter( hasSpaces, [ 'tori_spelling', 'tori amos' ] ) ).be.array;
    } );
    it( 'findSpaces output array', function(){
      should( findSpaces( [ 'tori_spelling', 'tori amos' ] ) [ 0 ] ).be.equal( 'tori amos' ).be.string;
    } );
  } );
  describe( 'map',function(){
    it( 'map output array',function(){
      should( map( function( x ){
        return x === ONE ? true : false;
      },
      [ ONE,ONE,TOW ] ) ).be.array;
    } );
  } );
  describe( 'curry function', function () {
    describe( 'addEvent', function () {
      let div = window.document.createElement( 'div' );
      it( 'addEvent in node is undefined' ,function(){
        should( addEvent ).be.a.function;
      } );
      it( 'addEvent' ,function(){
        should( addEvent( div, 'click', function(){},false ) ).be.a.undefined;
      } );
      it( 'IE attachEvent' ,function(){
        should( iEaddEvent( div, 'click', function(){} ) ).be.a.undefined;
      } );
    } );
    describe( 'debounce', function () {
      it( 'debounce' ,function(){
        should( debounce ).be.a.function;
      } );
      let testdebounce = debounce( kfunction, ONETHOUSAND, false );
      it( 'debounce return function' ,function(){
        should( testdebounce() ).be.a.function;
      } );
      let test2debounce = debounce( kfunction, ONETHOUSAND, true );
      it( 'debounce return function' ,function(){
        should( test2debounce() ).be.a.function;
      } );
    } );
    describe( 'throttle', function () {
      it( 'throttle' ,function(){
        should( throttle ).be.a.function;
      } );
      it( 'throttle return function' ,function(){
        let testthrottle = throttle( kfunction, TIME );
        testthrottle( kfunction, TIME );
        testthrottle( kfunction, TIME );
        testthrottle( kfunction, TIME );
        should( testthrottle() ).be.a.function;
      } );
    } );
    describe( 'rafThrottle', function () {
      it( 'rafThrottle' ,function(){
        should( rafThrottle ).be.a.function;
      } );
      it( 'rafThrottle return function' ,function(){
        let testrafThrottle = rafThrottle( kfunction );
        testrafThrottle();
        should( testrafThrottle() ).be.a.function;
      } );
    } );
    it( 'raFrame' ,function(){
      should( raFrame( function(){} ) ).be.a.function;
    } );
  } );
  describe( 'createCurry', function () {
    function createCurryTest( a, b ){
      return a + b;
    }
    it( 'createCurry return function' ,function(){
      should( createCurry( createCurryTest,ONE ) ).be.a.function;
    } );
    it( 'Curry function' ,function(){
      should( createCurry( createCurryTest , ONE )( ONE ) ).be.a.number;
    } );
  } );
} );
