/**
 * Setup github repo data from api.
 */
import Ajax from '../modules/Ajax';
import Loader from '../modules/Loader';
import Slideshow from '../modules/Slideshow';
import DomHelper from '../modules/DomHelper';

// endpoint info
const github_api = 'https://api.github.com/graphql';
const github_key = '3b37b9c8ad1cf60329cb95c01e224604cde0666d'; // read-only

// init loader
const loader = Loader( '#projects-loader' );
loader.show( 'Loading list of projects...' );

// query data
const graphQlQuery = {
  query: `
    query {
      user( login: "rainner" ) {
        name,
        avatarUrl,
        url,
        bio,
        email,
        location,
        pinnedRepositories( first: 10 ) {
          edges {
            node {
              name,
              description,
              url
            }
          }
        }
      }
    }`
};

// update user data throughout the page with data from github
const updateUserData = ( data ) => {
  DomHelper( '.logo-link' ).updateLogo( data.name, '/' );
  DomHelper( '.user-name' ).updateName( data.name );
  DomHelper( '.contact-link' ).updateContact( data.email, 'Website Development' ); // keep text
  DomHelper( '.user-email' ).updateContact( data.email, 'Website Development', data.email );
  DomHelper( '.user-avatar' ).updateAvatar( data.avatarUrl, data.url );
  DomHelper( '.user-bio' ).updateBio( data.bio );
  DomHelper( '.user-location' ).updateLocation( data.location, 'https://google.com/maps/place/'+ data.location );
  DomHelper( '.contact-form' ).updateContactForm( 'https://formspree.io/'+ data.email );
};

// build single slide for a repo
const buildSlide = ( repo ) => {
  return `
  <div class="slideshow-item hidden">
    <div class="flex-grid flex-top">
      <div class="flex-grid-item flex-40">
        <a href="${ repo.url }" target="_blank">
          <img class="fx-on fx-drop-in" src="public/images/thumb.svg" data-image="${ repo.url }/master/thumb.jpg" width="100%" alt="${ repo.name }" />
        </a>
      </div>
      <div class="flex-grid-item flex-60">
        <h3 class="heading fx-on fx-fade-in fx-delay-1">${ repo.name }</h3>
        <div class="text-small text-grey pad-bottom fx-on fx-fade-in fx-delay-2">${ repo.description }</div>
        <div class="text-small text-clip pad-bottom fx-on fx-fade-in fx-delay-3">
          <a href="${ repo.url }" target="_blank">${ repo.url }</a>
        </div>
        <div class="fx-on fx-fade-in fx-delay-4">
          <a class="form-btn bg-secondary-hover icon-ghub iconLeft" href="${ repo.url }" target="_blank">View Repository</a>
        </div>
      </div>
    </div>
    <div class="pad-bottom">&nbsp;</div>
  </div>`;
};

// build slideshow containers from list of repos
const buildSlideshow = ( repos ) => {
  let target = document.querySelector( '#projects-slideshow' );
  let list   = target ? target.querySelector( '.slideshow-list' ) : null;
  let html   = '';

  if ( repos && target && list ) {
    for ( let i = 0; i < repos.length; ++i ) {
      html += buildSlide( repos[ i ].node );
    }
  }
  list.innerHTML = html;
  new Slideshow( target );
};

// get data from github graphql api
new Ajax( 'POST', github_api, {
  type: 'json',
  headers: { 'Authorization': 'bearer '+ github_key },
  data: graphQlQuery,
  complete: ( xhr, response ) => {
    if ( !response || !response.data || Array.isArray( response.errors ) ) {
      return loader.error( 'Status '+ xhr.status +' : Could not load projects, try again later.' );
    }
    loader.hide();
    updateUserData( response.data.user );
    buildSlideshow( response.data.user.pinnedRepositories.edges );
  },
});





