/**
 * DomHelper Module.
 * Helps update DOM data by providing a set of functions
 * to be used on target elements, simiar to jQuery.
 */
export default function DomHelper( selector ) {

  let _list = [];

  if ( selector instanceof Element ) {
    _list.push( selector ) ;
  }
  else if ( typeof selector === 'string' ) {
    _list = document.querySelectorAll( selector );
  }
  else if ( Array.isArray( selector ) ) {
    for ( let i = 0; i < selector.length; ++i ) {
      if ( selector[ i ] instanceof Element ) {
        _list.push( selector[ i ] );
      }
    }
  }

  // chainable object
  return {

    // add list of classes to element
    addClass( clist ) {
      clist = this._clist( clist );

      return this._each( elm => {
        for ( let i = 0; i < clist.length; ++i ) {
          elm.classList.add( clist[ i ] );
        }
      });
    },

    // remove list of classes from element
    removeClass( clist ) {
      clist = this._clist( clist );

      return this._each( elm => {
        for ( let i = 0; i < clist.length; ++i ) {
          elm.classList.remove( clist[ i ] );
        }
      });
    },

    // update logo elements with name and optional link
    updateLogo( name, link ) {
      let names = String( name || '' ).trim().split( /\s+/g );
      let final = '';

      for ( let i = 0; i < names.length; ++i ) {
        final += ( i % 2 ) ? '<b>'+ names[ i ] +'</b>' : names[ i ];
      }
      return this._each( elm => {
        if ( link ) this._link( elm, link );
        this._html( elm, final );
      });
    },

    // update elements to have user name as text
    updateName( name ) {
      name = String( name || '' ).trim().replace( /\s+/g, ' ' );

      return this._each( elm => {
        this._text( elm, name );
      });
    },

    // update elements that will trigger a mailto click for email address
    updateContact( email, subject, text ) {
      email   = String( email || '' ).replace( /[^\w\-\.\,\@\#\$]+/g, '' );
      subject = String( subject || '' ).trim();

      let link = 'mailto:'+ email;
      if ( subject ) link += '?subject='+ encodeURIComponent( subject );

      return this._each( elm => {
        if ( text ) this._text( elm, text );
        this._link( elm, link );
      });
    },

    // update elements to have source or bg avatar image
    updateAvatar( image, link ) {
      return this._each( elm => {
        if ( link ) this._link( elm, link );
        this._image( elm, image );
      });
    },

    // update elements to have user bio text
    updateBio( bio ) {
      return this._each( elm => {
        this._text( elm, bio );
      });
    },

    // update elements to have user location and link to maps
    updateLocation( location, link ) {
      location = String( location || '' ).trim().replace( /\s+/g, ' ' );
      link     = String( link || '' ).replace( /\s+/g, '+' );

      return this._each( elm => {
        if ( link ) this._link( elm, link );
        this._text( elm, location );
      });
    },

    // update contact form elements to point to a link
    updateContactForm( link ) {
      return this._each( elm => {
        this._link( elm, link );
      });
    },

    // call function on each element in local list
    _each( cb ) {
      if ( typeof cb === 'function' ) {
        for ( let i = 0; i < _list.length; ++i ) {
          cb.call( this, _list[ i ] );
        }
      }
      return this;
    },

    // set source for image tag, or element background
    _image( elm, image ) {
      if ( elm.tagName === 'IMG' ) { elm.src = image; }
      else { elm.style.backgroundImage = 'url( '+ image +' )'; }
    },

    // set source link for anchor, form, or element click
    _link( elm, link ) {
      if ( elm.tagName === 'A' ) { elm.href = link; }
      else if ( elm.tagName === 'FORM' ) { elm.action = link; }
      else { elm.addEventListener( 'click', e => { window.open( link, '_blank' ); } ); }
    },

    // set html for element
    _html( elm, html ) {
      elm.innerHTML = html || '';
    },

    // set text for element
    _text( elm, text ) {
      elm.textContent = text || '';
    },

    // convert list of class names in a string into an array of classes
    _clist( clist ) {
      return String( clist || '' ).trim().replace( /[^\w\s\-]+/g, '' ).split( /\s+/g );
    },

  }
}
