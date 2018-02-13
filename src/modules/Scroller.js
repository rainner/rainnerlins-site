/**
 * Scroller Class.
 * For calling custom function based on scroll position, or to auto-scroll.
 */
export default class Scroller {

  // constructor
  constructor( target ) {
    let _t = document.scrollingElement || document.documentElement || window;

    this._target    = ( typeof target === 'object' ) ? target : _t;
    this._pos       = 0;
    this._to        = 0;
    this._min       = 0;
    this._max       = 0;
    this._ease      = 8;
    this._scrolling = true;
    this._callbacks = [];
    this._jumpcb    = null;
    this._onTick    = this._onTick.bind( this );
    this._onScroll  = this._onScroll.bind( this );
    this._loop      = this._loop.bind( this );

    this._sint = setInterval( this._onTick, 200 );
    window.addEventListener( 'scroll', this._onScroll, false );
  }

  // when scroll position changes
  onChange( callback ) {
    this._addCallback( false, 0, callback );
  }

  // when scroll direction is going up
  onUp( callback ) {
    this._addCallback( 'up', 0, callback );
  }

  // when scroll direction is going down
  onDown( callback ) {
    this._addCallback( 'down', 0, callback );
  }

  // when scroll position is more than given pos
  moreThan( pos, callback ) {
    this._addCallback( 'more', pos, callback );
  }

  // when scroll position is less than given pos
  lessThan( pos, callback ) {
    this._addCallback( 'less', pos, callback );
  }

  // auto scroll page to a target destination
  jumpTo( dest, callback ) {
    let _h = Math.max( 0, Math.floor( this._target.scrollHeight || 0, this._target.clientHeight || 0 ) );

    this._pos = this._target.scrollTop | 0;
    this._to  = this._pos;
    this._max = Math.floor( _h - this._target.clientHeight || 0 );

    if ( typeof dest === "number" ) {
      this._to = dest;
    }
    else if ( typeof dest === "object" && dest instanceof Element ) {
      this._to = ( this._pos + dest.getBoundingClientRect().top ) || this._pos;
    }
    else if ( typeof dest === "string" ) {
      dest = dest.trim();
      if ( /^(up|top)$/i.test( dest ) ) { this._to = this._min; } else
      if ( /^(middle|center)$/i.test( dest ) ) { this._to = this._max / 2; } else
      if ( /^(down|bottom)$/i.test( dest ) ) { this._to = this._max; } else
      if ( /^([0-9]+)$/.test( dest ) ) { this._to = parseInt( dest ); }
      else {
        let node = document.querySelector( dest );
        this._to = node ? ( this._pos + node.getBoundingClientRect().top ) : this._pos;
      }
    }
    this._to = Math.max( this._min, Math.min( this._to, this._max ) );
    this._jumpcb = callback;
    this._loop();
  }

  // reset callbacks that only fire once, so they can fire agan
  resetCallbacks() {
    for ( let i = 0; i < this._callbacks.length; ++i ) {
      this._callbacks[ i ].called = false;
    }
  }

  // called from setInterval ticks
  _onTick() {
    if ( !this._scrolling ) return;
    let sp = this._target.scrollTop | 0;

    for ( let i = 0; i < this._callbacks.length; ++i ) {
      let cb = this._callbacks[ i ];

      if ( cb.trigger ) {

        if ( cb.trigger === 'up' ) {
          if ( !cb.called && sp < this._pos ) cb.callback( sp );
          cb.called = ( sp < this._pos );
        }
        else if ( cb.trigger === 'down' ) {
          if ( !cb.called && sp > this._pos ) cb.callback( sp );
          cb.called = ( sp > this._pos );
        }
        else if ( cb.trigger === 'more' ) {
          if ( !cb.called && sp > cb.position ) cb.callback( sp );
          cb.called = ( sp > cb.position );
        }
        else if ( cb.trigger === 'less' ) {
          if ( !cb.called && sp < cb.position ) cb.callback( sp );
          cb.called = ( sp < cb.position );
        }
        continue;
      }
      cb.called = false;
      cb.callback( sp );
    }
    this._pos = sp;
    this._scrolling = false;
  }

  // page scrolling detected
  _onScroll( e ) {
    this._scrolling = true;
  }

  // add custom callback to the list
  _addCallback( trigger, position, callback ) {
    if ( typeof callback !== 'function' ) return;
    this._callbacks.push({
      called   : false,         // if already called
      trigger  : trigger,       // how to call it (more/less than, or none)
      position : position | 0,  // when to call it, or none
      callback : callback,      // custom callback
    });
  }

  // auto-scroll animation loop
  _loop() {
    if ( Math.abs( this._to - this._pos ) < 1 ) {
      this._target.scrollTop = this._to;
      this._scrolling = false;

      if ( typeof this._jumpcb === 'function' ) {
        this._jumpcb.call( this, this._to ); // call once and reset
        this._jumpcb = null;
      }
      return;
    }
    this._pos += ( this._to - this._pos ) / this._ease;
    this._target.scrollTop = this._pos;
    requestAnimationFrame( this._loop );
  }

}
