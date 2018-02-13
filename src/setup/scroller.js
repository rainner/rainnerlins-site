/**
 * Setup page scroll related events.
 */
import Scroller from '../modules/Scroller';

const scroller = new Scroller();
const header = document.querySelector( '.header-wrap' );
const bttwrap = document.querySelector( '#btt' );
const btns = document.querySelectorAll( '[data-scroll]' );
const hash = window.location.hash || '';

// toggle some things when scrolling up
scroller.onUp( sp => {
  header.classList.remove( 'hidden' );
  bttwrap.classList.remove( 'visible' );
});

// toggle some things when scrolling down
scroller.onDown( sp => {
  header.classList.add( 'hidden' );
  bttwrap.classList.add( 'visible' );
});

// change header to transparent when near the top
scroller.lessThan( 150, sp => {
  header.classList.remove( 'solid' );
});

// change header to solid when scrolling down
scroller.moreThan( 150, sp => {
  header.classList.add( 'solid' );
});

// buttons that trigger page scroll
for ( let i = 0; i < btns.length; ++i ) {
  btns[ i ].addEventListener( 'click', e => {
    e.preventDefault();

    // where to scroll to (elm, num, etc)
    let target = String( e.target.getAttribute( 'data-scroll' ) || '' ).trim();
    if ( !target ) return;

    // jump to target
    scroller.jumpTo( target, function( pos ) {
      this.resetCallbacks();
      // going to an element by id, update hash and hide header
      if ( /^\#/.test( target ) ) {
        window.location.hash = target;
        header.classList.add( 'hidden' );
      } else {
        window.location.hash = '';
      }
    });
  });
}

// resume scroll position on page load
if ( hash ) {
  setTimeout( () => { scroller.jumpTo( hash ); }, 1000 );
}

