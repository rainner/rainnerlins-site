/**
 * Setup github repo data from api.
 */
import Ajax from '../modules/Ajax';
import Loader from '../modules/Loader';
import Slideshow from '../modules/Slideshow';

// codepen profile data api endpoint
const apiEndpoint = 'https://rainner.herokuapp.com/codepen';
// const apiEndpoint = 'http://localhost:8080/codepen';

// init loader
const loader = Loader( '#codepen-loader' );
loader.show( 'Loading projects from Codepen...' );

// build single slide for a repo
const buildSlide = ( pen ) => {
  let thumb = `public/images/thumb.svg`;
  let { url, image, title, info, views, replies, likes } = pen;
  return `
  <div class="slideshow-item hidden">
    <div class="flex-grid flex-top">
      <div class="flex-grid-item flex-40">
        <a href="${ url }" target="_blank">
          <img class="fx-on fx-drop-in thumb" src="${ thumb }" data-image="${ image }" width="100%" alt="${ title }" />
        </a>
      </div>
      <div class="flex-grid-item flex-60">
        <h3 class="heading fx-on fx-fade-in fx-delay-1">${ title }</h3>
        <div class="text-grey pad-bottom pad-top">
          <span class="icon-visible iconLeft">${ views }</span> &nbsp;
          <span class="icon-heart iconLeft">${ likes }</span> &nbsp;
        </div>
        <div class="pad-bottom fx-on fx-fade-in fx-delay-2">${ info }</div>
        <div class="fx-on fx-fade-in fx-delay-4">
          <a class="form-btn bg-secondary-hover icon-ghub iconLeft" href="${ url }" target="_blank">View Project</a>
        </div>
      </div>
    </div>
    <div class="pad-bottom">&nbsp;</div>
  </div>`;
};

// build slideshow containers from list of repos
const buildSlideshow = ( pens ) => {
  let target = document.querySelector( '#codepen-projects' );
  let list   = target ? target.querySelector( '.slideshow-list' ) : null;
  let html   = '';

  if ( !pens || !target || !list ) {
    return console.warn( 'Could not build Codepen projects slideshow. API or DOM related error.' );
  }
  for ( let i = 0; i < pens.length; ++i ) {
    html += buildSlide( pens[ i ] );
  }
  list.innerHTML = html;
  new Slideshow( target );
  window.setupImages();
};

// load pens data from codepen api
const loadCodepenData = () => {
  new Ajax( 'GET', apiEndpoint, {
    type: 'json',
    complete: ( xhr, response ) => {
      // something went wrong...
      if ( !response || response.error ) {
        return loader.error( 'Status '+ xhr.status +' : Could not load projects, try again later.' );
      }
      loader.hide();
      buildSlideshow( response );
    },
  });
};

// load data
loadCodepenData();






