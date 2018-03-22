/**
 * Setup dynamic page links
 */
import Ajax from '../modules/Ajax';

// endpoint to static data file
const endpoint = 'public/static/links.json';

// setup dynamic page links
const setupLinks = ( links ) => {
  let elms = document.querySelectorAll( '[data-action]' );
  if ( !elms.length ) return;

  for ( let i = 0; i < elms.length; ++i ) {
    elms[ i ].addEventListener( 'click', e => {
      e.preventDefault();
      let key    = e.target.getAttribute( 'data-action' ) || '';
      let parts  = key.split( ':' ); // action:source:target
      let action = parts.length ? parts.shift() : '';
      let source = parts.length ? parts.shift() : '';
      let target = parts.length ? parts.shift() : '_blank';

      if ( action === 'go' && source ) {
        let url = links[ source ] || '';
        if ( url ) window.open( url, target );
        return;
      }
      if ( action === 'reload' ) {
        return window.location.reload();
      }
      if ( action === 'back' ) {
        return window.history.back();
      }
    });
  }
};

// get services data from JSON file and init
new Ajax( 'GET', endpoint, {
  type: 'json',
  complete: ( xhr, response ) => {
    setupLinks( response.links || {} );
  }
});
