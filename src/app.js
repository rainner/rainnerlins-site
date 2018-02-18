/**
 * Main app entry file.
 */

// css bundle entry file
import './scss/app.scss';
// client side polyfills
import './modules/Polyfills';
// setup page elements
import './setup/github';
import './setup/services';
import './setup/contact';
import './setup/dropdowns';
import './setup/tooltips';
import './setup/scroller';

// lazy-load images for some elements
const updateImages = () => {
  let attr = 'data-image';
  let elms = document.querySelectorAll( '['+ attr +']' );

  for ( let i = 0; i < elms.length; ++i ) {
    let elm  = elms[ i ];
    let file = elm.getAttribute( attr );
    let img  = new Image();

    img.addEventListener( 'load', e => {
      // image tags
      if ( elm.tagName === 'IMG' ) {
        // replace old image with new one to trigger css animation once loaded
        let newImg = elm.cloneNode( false );
        newImg.src = file;
        elm.parentNode.replaceChild( newImg, elm );
      }
      else {
        // everything else gets a bg swap
        elm.style.backgroundImage = 'url( '+ file +' )';
      }
    }, false );

    elm.removeAttribute( attr );
    img.src = file;
  }
};

// on page loaded
window.addEventListener( 'load', e => {
  // hide spinner
  let spinner = document.querySelector( '#spinner' );
  spinner.style.display = 'none';
  // show page content
  let container = document.querySelector( '#app' );
  container.style.opacity = 1;
  // swap images
  setTimeout( updateImages, 400 );
});
