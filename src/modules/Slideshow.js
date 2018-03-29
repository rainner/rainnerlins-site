/**
 * Slideshow Class.
 * Handler class for custom slideshow containers.
 */
export default class Slideshow {

  // constructor
  constructor( target, options ) {
    // options
    this._options = Object.assign( {
      // css class prefix for inner elements
      prefixClass: 'slideshow',
      // class for active slide and controls
      activeClass: 'slide-active',
      // class for slide going next
      nextClass: 'slide-next',
      // class for slide going back
      backClass: 'slide-back',
      // auto skip to next slide
      autoplay: true,
      // loop around when skipping
      loop: true,
      // how long to wait
      delay: 10000,
      // ...
    }, options );

    // slideshow related elements
    this._target = ( target instanceof Element ) ? target : null;
    this._backEl = this._target ? this._target.querySelector( '.'+ this._options.prefixClass +'-back' ) : null;
    this._nextEl = this._target ? this._target.querySelector( '.'+ this._options.prefixClass +'-next' ) : null;
    this._navEl  = this._target ? this._target.querySelector( '.'+ this._options.prefixClass +'-nav' )  : null;
    this._listEl = this._target ? this._target.querySelector( '.'+ this._options.prefixClass +'-list' ) : null;

    // local props
    this._slides = this._listEl ? this._listEl.children : [];
    this._total  = this._slides.length | 0;
    this._last   = this._total ? ( this._total - 1 ) : 0;
    this._first  = 0;
    this._index  = 0;
    this._dircls = '';
    this._xpos   = null;
    this._ypos   = null;
    this._sint   = null;

    // init
    this._onMouseOver  = this._onMouseOver.bind( this );
    this._onMouseOut   = this._onMouseOut.bind( this );
    this._onTouchStart = this._onTouchStart.bind( this );
    this._onTouchMove  = this._onTouchMove.bind( this );
    this._onTick       = this._onTick.bind( this );
    this._init();
  }

  // go to the next slide
  next() {
    if ( !this._options.loop && this._index === this._last ) return;
    this._index = ( this._index === this._last ) ? this._first : ( this._index + 1 );
    this._dircls = this._options.nextClass;
    this.select( this._index );
  }

  // go to the previous slide
  back() {
    if ( !this._options.loop && this._index === this._first ) return;
    this._index = ( this._index === this._first ) ? this._last : ( this._index - 1 );
    this._dircls = this._options.backClass;
    this.select( this._index );
  }

  // select a slide by index
  select( index ) {
    index = index | 0;
    let slide = this._slides[ index ] || null;

    // no need if these fail
    if ( !this._target || !this._total || !slide ) return;

    // reset all slides and buttons
    for ( let i = 0; i < this._slides.length; ++i ) {
      if ( this._navEl ) this._navEl.children[ i ].classList.remove( this._options.activeClass );
      this._slides[ i ].classList.remove( this._options.activeClass );
      this._slides[ i ].classList.remove( this._options.nextClass );
      this._slides[ i ].classList.remove( this._options.backClass );
    }
    // set active slide and button
    if ( this._navEl ) this._navEl.children[ index ].classList.add( this._options.activeClass );
    if ( this._dircls ) slide.classList.add( this._dircls );
    slide.classList.add( this._options.activeClass );

    // save index and clear selected direction class
    this._index = index;
    this._dircls = '';
  }

  // user interaction
  _onMouseOver() {
    this._stopInterval();
  }

  // idle
  _onMouseOut() {
    this._startInterval();
  }

  // on touch start
  _onTouchStart( e ) {
    this._stopInterval();
    this._xpos = e.touches[0].clientX || 0;
    this._ypos = e.touches[0].clientY || 0;
  }

  // on touch move (swipe)
  _onTouchMove( e ) {
    if ( !this._xpos || !this._ypos ) return;

    let xUp   = e.touches[0].clientX || 0;
    let yUp   = e.touches[0].clientY || 0;
    var xDiff = this._xpos - xUp;
    var yDiff = this._ypos - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
      if ( xDiff > 0 ) { this.next(); } // swipe right
      else { this.back(); } // swipe left
    }
    this._xpos = null;
    this._ypos = null;
  }

  // autoplay tick
  _onTick() {
    if ( !document.hasFocus() ) return;
    this.next();
  }

  // start auto skip interval
  _startInterval() {
    this._stopInterval();
    if ( this._options.autoplay && this._total > 1 ) {
      this._sint = setInterval( this._onTick, this._options.delay );
    }
  }

  // stop auto skip interval
  _stopInterval() {
    if ( this._sint ) {
      clearTimeout( this._sint );
      this._sint = null;
    }
  }

  // init slideshow for target
  _init() {
    if ( !this._target ) {
      return console.warn( 'No valid slideshow target element.' );
    }
    // setup target container and input events
    this._target.style.position = 'relative';
    this._target.addEventListener( 'mouseover', this._onMouseOver, false );
    this._target.addEventListener( 'mouseout', this._onMouseOut, false );
    this._target.addEventListener( 'touchstart', this._onTouchStart, false );
    this._target.addEventListener( 'touchmove', this._onTouchMove, false );
    this._target.addEventListener( 'touchend', this._onMouseOut, false );

    // setup back button
    if ( this._backEl ) {
      let btn = document.createElement( 'button' );
      btn.addEventListener( 'click', e => { e.preventDefault(); this.back(); } );
      this._backEl.appendChild( btn );
    }
    // setup next button
    if ( this._nextEl ) {
      let btn = document.createElement( 'button' );
      btn.addEventListener( 'click', e => { e.preventDefault(); this.next(); } );
      this._nextEl.appendChild( btn );
    }
    // setup nav buttons
    if ( this._navEl ) {
      for ( let i = 0; i < this._slides.length; ++i ) {
        let btn = document.createElement( 'button' );
        btn.addEventListener( 'click', e => { e.preventDefault(); this.select( i ); } );
        this._navEl.appendChild( btn );
      }
    }
    // select first slide
    this.select( this._index );
    this._startInterval();
  }

}
