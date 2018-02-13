/**
 * Setup services slideshow
 */
import Ajax from '../modules/Ajax';
import Loader from '../modules/Loader';
import Slideshow from '../modules/Slideshow';

// services data file endpoint
const endpoint = 'public/docs/services.json';

// loader
const loader = Loader( '#services-loader' );
loader.show( 'Loading list of services...' );

// build single service slide
const buildSlide = ( service ) => {
  let examples = '';

  if ( service.examples && Array.isArray( service.examples ) ) {
    for ( let i = 0; i < service.examples.length; ++i ) {
      examples += '<li>'+ service.examples[ i ] +'</li>';
    }
  }
  return `
  <div class="slideshow-item hidden">
    <div class="flex-grid">
      <div class="flex-50 fx-on fx-zoom-in">
        <img src="${ service.image }" width="100%" alt="${ service.name }" />
      </div>
      <div class="flex-50 fx-on fx-fade-in">
        <h3 class="text-clip pad-bottom ${ service.icon } iconLeft">${ service.name }</h3>
        <div class="pad-bottom">${ service.description }</div>
        <ul class="checklist pad-bottom">${ examples }</ul>
      </div>
    </div>
  </div>`;
};

// build and start services slideshow
const buildSlideshow = ( services ) => {
  let target = document.querySelector( '#services-slideshow' );
  let list   = target ? target.querySelector( '.slideshow-list' ) : null;
  let html   = '';

  if ( services && target && list ) {
    for ( let i = 0; i < services.length; ++i ) {
      html += buildSlide( services[ i ] );
    }
  }
  list.innerHTML = html;
  new Slideshow( target );
};

// get services data from JSON file and init
new Ajax( 'GET', endpoint, {
  complete: ( xhr, services ) => {

    // services data not yet parsed, try to parse it
    if ( typeof services === 'string' ) {
      try { services = JSON.parse( services || '[]' ); }
      catch( e ) { }
    }
    // services data looks valid, init
    if ( Array.isArray( services ) ) {
      loader.hide();
      buildSlideshow( services );
      return;
    }
    // something went wrong.
    loader.error( 'Status '+ xhr.status +' : Could not load services, try again later.' );
  }
});
