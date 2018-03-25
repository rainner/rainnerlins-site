/**
 * Dropdown Class.
 * Adds dropdown functionality to some elements on the page.
 */
export default class Modal {

  // constructor
  constructor( options ) {

    // modal options
    this._options = Object.assign( {
      // modal title ( string )
      title : 'Modal Title',
      // modal body content, ( string or element )
      body: '...',
      // ...
    }, options );

    // local event handler
    this._stopProp = this._stopProp.bind( this );
    this._closeModal = this._closeModal.bind( this );
    this._onKey = this._onKey.bind( this );

    // dark overlay
    this._overlay = document.createElement( 'div' );
    this._overlay.setAttribute( 'class', 'modal-overlay' );
    this._overlay.addEventListener( 'click', this._closeModal, false );
    this._overlay.addEventListener( 'keydown', this._onKey, false );

    // main modal container
    this._container = document.createElement( 'div' );
    this._container.setAttribute( 'class', 'modal-container' );
    this._container.addEventListener( 'click', this._stopProp, false );

    // modal header section
    this._header = document.createElement( 'div' );
    this._header.setAttribute( 'class', 'modal-header' );

    // header title
    this._title = document.createElement( 'div' );
    this._title.setAttribute( 'class', 'modal-title' );
    this._title.innerHTML = String( this._options.title || '' );

    // header close button
    this._close = document.createElement( 'btn' );
    this._close.setAttribute( 'class', 'modal-close icon-close' );
    this._close.addEventListener( 'click', this._closeModal, false );

    // modal body
    this._body = document.createElement( 'div' );
    this._body.setAttribute( 'class', 'modal-body' );

    // build modal
    this._build();
  }

  // stop click propagation
  _stopProp( e ) {
    e && e.stopPropagation();
  }

  // close modal window and remove from dom
  _closeModal( e ) {
    if ( document.body.contains( this._overlay ) ) {
      this._overlay.classList.remove( 'visible' );
      setTimeout( () => { document.body.removeChild( this._overlay ); }, 1000 );
    }
  }

  // check for escape key
  _onKey( e ) {
    if ( e.keyCode == 27 ) {
      this.closeModal( e );
    }
  }

  // build modal and add to document
  _build() {
    if ( typeof this._options.body === 'string' ) {
      this._body.innerHTML = this._options.body;
    }
    else if ( this._options.body instanceof Element ) {
       this._body.appendChild( this._options.body );
    }
    this._header.appendChild( this._title );
    this._header.appendChild( this._close );
    this._container.appendChild( this._header );
    this._container.appendChild( this._body );
    this._overlay.appendChild( this._container );
    document.body.appendChild( this._overlay );
    setTimeout( () => { this._overlay.classList.add( 'visible' ); }, 300 );
  }

}
