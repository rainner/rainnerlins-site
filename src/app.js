/**
 * Main app entry file.
 */
import './scss/app.scss';
import './modules/Polyfills';
import './setup/github';
import './setup/links';
import './setup/dropdowns';
import './setup/tooltips';
import './setup/scroller';
import './setup/contact';
import './setup/images';

// on page loaded
window.addEventListener( 'load', e => {
  // hide spinner
  let spinner = document.querySelector( '#spinner' );
  spinner.style.display = 'none';
  // show page content
  let container = document.querySelector( '#app' );
  container.style.opacity = 1;
  // ...
}, false );
