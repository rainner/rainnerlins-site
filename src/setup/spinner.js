/**
 * Remove page spinner
 */
window.addEventListener( 'load', e => {
  let spinner = document.querySelector( '#spinner' );
  let app = document.querySelector( '#app' );

  spinner.style.display = 'none';
  app.style.opacity = 1;
}, false );
