/**
 * Common used utils
 */
export default {

  // get date string for args, or current time
  dateString( dateStr, addTime ) {
    let output  = '';
    let date    = new Date( dateStr || Date.now() );
    let year    = date.getUTCFullYear();
    let month   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][ date.getMonth() ];
    let day     = date.getUTCDate();
    let minute  = date.getMinutes();
    let fullh   = date.getHours();
    let hour    = ( fullh > 12 ) ? ( fullh - 12 ) : fullh;
    let ampm    = ( fullh > 12 ) ? 'PM' : 'AM';
    let _p      = function( n ) { return ( n < 10 ) ? '0'+ n : ''+ n; };

    hour   = ( hour === 0 ) ? 12 : hour;
    output = month + '/' + _p( day ) + '/' + year;
    return ( addTime ) ? output + ' ' + _p( hour ) + ':' + _p( minute ) + ' ' + ampm : output;
  },

  // ...
}
