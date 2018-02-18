/**
 * Setup services slideshow and dynamic page links
 */
import Ajax from '../modules/Ajax';
import Loader from '../modules/Loader';
import Slideshow from '../modules/Slideshow';

// endpoint to static data file
const endpoint = 'public/static/data.json';

// init loader
const loader = Loader( '#services-loader' );
loader.show( 'Loading list of services...' );

// setup dynamic page links
const setupLinks = ( links ) => {
  let elms = document.querySelectorAll( '[data-action]' );

  if ( typeof links === 'object' && elms.length ) {
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
  }
};

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
  complete: ( xhr, response ) => {

    // services data not yet parsed, try to parse it
    if ( typeof response === 'string' ) {
      try { response = JSON.parse( response || '{}' ); }
      catch( e ) { }
    }
    // not looking good
    if ( !response.services ) {
      return loader.error( 'Status '+ xhr.status +' : Could not load services, try again later.' );
    }
    // data looks good, init
    loader.hide();
    buildSlideshow( response.services );
    setupLinks( response.links );
  }
});
