const {IO,Maybe,task,Either} = require( '../eight/contain.js' );
const {ONE,TOW} = require( '../../comm/number.js' );

const concat = require( 'ramda' ).concat;
const _ = require( 'ramda' );
const {add} = require( '../five/compose.js' );

IO.of( 'tetris' ).map( concat( 'master' ) );
// IO("tetris master")

Maybe.of( TOW ).map( add( ONE ) );
// Maybe(3)

task.of( [ { id: 2 }, { id: 3 } ] ).map( _.prop( 'id' ) );
// Task([2,3])

Either.of( 'The past, present and future walk into a bar...' ).map( concat( 'it was tense.' ) );
// Right("The past, present and future walk into a bar...it was tense.")
