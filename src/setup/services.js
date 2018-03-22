/**
 * Setup services slideshow and dynamic page links
 */
import Ajax from '../modules/Ajax';
import Loader from '../modules/Loader';
import Slideshow from '../modules/Slideshow';

// endpoint to static data file
const endpoint = 'public/static/services.json';

// init loader
const loader = Loader( '#services-loader' );
loader.show( 'Loading list of services...' );

// build single service slide
const buildSlide = ( service ) => {
  let examples = '';
  if ( Array.isArray( service.examples ) ) {
    for ( let i = 0; i < service.examples.length; ++i ) {
      examples += '<li>'+ service.examples[ i ] +'</li>';
    }
  }
  return `
  <div class="slideshow-item hidden">
    <div class="flex-grid flex-top">
      <div class="flex-grid-item flex-50">
        <img class="fx-on fx-drop-in" src="public/images/default-thumb.svg" data-image="${ service.image }" width="100%" alt="${ service.name }" />
      </div>
      <div class="flex-grid-item flex-50">
        <h3 class="heading ${ service.icon } iconLeft fx-on fx-fade-in fx-delay-1">${ service.name }</h3>
        <div class="pad-bottom fx-on fx-fade-in fx-delay-2">${ service.description }</div>
        <ul class="checklist pad-bottom fx-on fx-fade-in fx-delay-3">${ examples }</ul>
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
  type: 'json',
  complete: ( xhr, services ) => {
    if ( !services ) return loader.error( xhr.status +' : Could not load services.' );
    loader.hide();
    buildSlideshow( services );
  }
});
