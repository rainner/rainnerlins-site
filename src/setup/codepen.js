/**
 * Setup github repo data from api.
 */
import Ajax from '../modules/Ajax';
import Loader from '../modules/Loader';
import Slideshow from '../modules/Slideshow';

// codepen profile data api endpoint
const apiEndpoint = 'https://cpv2api.com/pens/showcase/rainner';

// init loader
const loader = Loader( '#codepen-loader' );
loader.show( 'Loading projects from Codepen...' );

// build single slide for a repo
const buildSlide = ( pen ) => {
  let thumbTmp = `public/images/thumb.svg`;
  let thumbUrl = ( String( pen.images.small || '' ) || thumbTmp ).replace( /http\:/g, 'https:' );
  let penUrl   = `https://codepen.io/rainner/full/${ pen.id }/`;
  let penViews = String( pen.views || '' ).replace( /[^\d\,]+/g, '' ) + ' Views';
  let penLikes = String( pen.loves || '' ).replace( /[^\d\,]+/g, '' ) + ' Likes';
  return `
  <div class="slideshow-item hidden">
    <div class="flex-grid flex-top">
      <div class="flex-grid-item flex-40">
        <a href="${ penUrl }" target="_blank">
          <img class="fx-on fx-drop-in thumb" src="${ thumbTmp }" data-image="${ thumbUrl }" width="100%" alt="${ pen.title }" />
        </a>
      </div>
      <div class="flex-grid-item flex-60">
        <h3 class="heading fx-on fx-fade-in fx-delay-1">${ pen.title }</h3>
        <div class="text-grey pad-bottom pad-top">
          <span class="icon-visible iconLeft">${ penViews }</span> &nbsp;
          <span class="icon-heart iconLeft">${ penLikes }</span> &nbsp;
        </div>
        <div class="pad-bottom fx-on fx-fade-in fx-delay-2">${ pen.details }</div>
        <div class="fx-on fx-fade-in fx-delay-4">
          <a class="form-btn bg-secondary-hover icon-ghub iconLeft" href="${ penUrl }" target="_blank">View Project</a>
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
      if ( !response || !response.data || response.error ) {
        return loader.error( 'Status '+ xhr.status +' : Could not load projects, try again later.' );
      }
      loader.hide();
      buildSlideshow( response.data );
    },
  });
};

// load data
loadCodepenData();






