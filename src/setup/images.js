/**
 * Setup lazy-loaded images
 */
window.addEventListener( 'load', e => {
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
}, false );
