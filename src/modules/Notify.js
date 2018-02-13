/**
 * Notify Class.
 * Adds notification alrts to a fixed container on the page.
 */
export default class Notify {

  // class constructor
  constructor( options ) {
    this._options = Object.assign( {
      // delay for removing notice from DOM to allow for css animation to complete (ms)
      toggleDuration: 500,
      // default auto close timeout
      timeout: 5000,
      // ...
    }, options );

    this._container = null;
    this._close = this._close.bind( this );
    this._init();
  }

  // create container
  _init() {
    let id = 'js-notify-wrap';
    this._container = document.getElementById( id );

    if ( !this._container ) {
      this._container = document.createElement( 'div' );
      this._container.setAttribute( 'id', id );
      this._container.setAttribute( 'class', 'notify-wrap' );
      document.body.appendChild( this._container );
    }
  }

  // close alert on click
  _close( alert ) {
    if ( !alert || !this._container ) return;
    if ( alert._sto ) clearTimeout( alert._sto );

    alert.classList.add( 'notify-closed' ); // animate out

    setTimeout( () => {
      if( this._container.contains( alert ) ) {
        this._container.removeChild( alert );
      }
      if( this._container.hasChildNodes() !== true ) {
        this._container.classList.remove( 'enabled' );
      }
    }, this._options.toggleDuration );
  }

  // new alert
  insert( type, info, timeout ) {
    if ( !this._container ) return;

    type = ( type && typeof type === 'string' ) ? type : 'info';
    info = ( info && typeof info === 'string' ) ? info : 'Unspecified alert.';

    let alert = document.createElement( 'div' );
    alert.setAttribute( 'class', 'notify-alert notify-'+ type );
    alert.innerHTML = '<div class="notify-message">'+ info +'</div>';

    let close = document.createElement( 'div' );
    close.setAttribute( 'class', 'notify-close' );
    close.addEventListener( "click", e => { this._close( alert ) } );

    alert.appendChild( close );
    this._container.appendChild( alert );
    this._container.classList.add( 'enabled' );

    if ( timeout === false ) return;
    timeout = ( timeout || this._options.timeout || 3000 ) | 0;
    alert._sto = setTimeout( e => { this._close( alert ) }, timeout );
  }

  // add success alert
  success( info, timeout ) {
    this.insert( 'success', info, timeout );
  }

  // add success alert
  warning( info, timeout ) {
    this.insert( 'warning', info, timeout );
  }

  // add success alert
  error( info, timeout ) {
    this.insert( 'error', info, timeout );
  }

  // add success alert
  info( info, timeout ) {
    this.insert( 'info', info, timeout );
  }

}
