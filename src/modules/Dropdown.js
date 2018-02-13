/**
 * Dropdown Class.
 * Adds dropdown functionality to some elements on the page.
 */
export default class Dropdown {

  // constructor
  constructor( container ) {
    this._container  = ( typeof container === 'object' ) ? container : null;
    this._trigger    = this._container ? this._container.querySelector( '.dropdown-trigger' ) : null;
    this._content    = this._container ? this._container.querySelector( '.dropdown-content' ) : null;
    this._showMenu   = this._showMenu.bind( this );
    this._hideMenu   = this._hideMenu.bind( this );
    this._toggleMenu = this._toggleMenu.bind( this );
    this._clickOut   = this._clickOut.bind( this );
    this._visible    = false;
    this._sto        = null;
    this._setup();
  }

  // setup dropdown
  _setup() {
    if ( this._container && this._trigger && this._content ) {
      if ( this._container.hasAttribute( "data-dropdown" ) ) return;
      this._container.setAttribute( "data-dropdown", 1 );
      this._content.addEventListener( 'mouseup', this._hideMenu, false );
      this._content.addEventListener( 'mouseleave', this._hideMenu, false );
      this._trigger.addEventListener( 'click', this._toggleMenu, false );
      document.addEventListener( 'click', this._clickOut );
      this._hideMenu();
    }
  }

  // cleanup
  _destroy() {
    if ( this._container && this._trigger && this._content ) {
      this._container.removeAttribute( "data-dropdown" );
      this._content.removeEventListener( 'mouseup', this._hideMenu, false );
      this._content.removeEventListener( 'mouseleave', this._hideMenu, false );
      this._trigger.removeEventListener( 'click', this._toggleMenu, false );
      document.removeEventListener( 'click', this._clickOut );
      this._hideMenu();
    }
  }

  // show dropdown
  _showMenu( e ) {
    e && e.stopPropagation();

    if ( this._container && this._trigger && this._content ) {
      let box      = this._trigger.getBoundingClientRect();
      let posx     = box.left + ( this._trigger.offsetWidth / 2 );
      let posy     = box.top + ( this._trigger.offsetHeight / 2 );
      let client   = this._client();
      let centerx  = client.width / 2;
      let centery  = client.height / 2;

      if ( posy < centery ) this._content.classList.add( 'top' );
      if ( posx > centerx ) this._content.classList.add( 'right' );
      if ( posy > centery ) this._content.classList.add( 'bottom' );
      if ( posx < centerx ) this._content.classList.add( 'left' );
      this._container.classList.add( 'visible' );
      this._visible = true;
    }
  }

  // hide dropdown
  _hideMenu( e ) {
    if ( this._container && this._content ) {
      if ( this._sto ) clearTimeout( this._sto );
      this._sto = setTimeout( () => {
        this._container.classList.remove( 'visible' );
        this._content.classList.remove( 'top' );
        this._content.classList.remove( 'right' );
        this._content.classList.remove( 'bottom' );
        this._content.classList.remove( 'left' );
        this._visible = false;
      }, 100 );
    }
  }

  // toggle menu from trigger
  _toggleMenu( e ) {
    if ( this._visible ) { this._hideMenu( e ); }
    else { this._showMenu( e ); }
  }

  // detect click outside container
  _clickOut( e ) {
    if ( !this._container.contains( e.target ) ) {
      this._hideMenu( e );
    }
  }

  // get client size
  _client() {
    let _w = window;
    let _d = document.documentElement;
    let _b = document.body;
    return {
      width  : Math.max( 0, _w.innerWidth || _d.clientWidth || _b.clientWidth || 0 ),
      height : Math.max( 0, _w.innerHeight || _d.clientHeight || _b.clientHeight || 0 ),
    }
  }
}
