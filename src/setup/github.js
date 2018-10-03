/**
 * Setup github repo data from api.
 */
import api from '../../assets/api/github';
import Ajax from '../modules/Ajax';
import Loader from '../modules/Loader';
import Slideshow from '../modules/Slideshow';
import DomHelper from '../modules/DomHelper';
import Utils from '../modules/Utils';

// fallback profile data endpoint
const jsonEndpoint = 'public/static/profile.json';

// init loader
const loader = Loader( '#github-loader' );
loader.show( 'Loading projects from Github...' );

// query data
const graphQlQuery = {
  query: `
    query {
      user( login: "rainner" ) {
        name,
        email,
        location,
        bio,
        avatarUrl,
        url,
        pinnedRepositories( first: 10 ) {
          edges {
            node {
              id,
              name,
              nameWithOwner,
              description,
              pushedAt,
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
  let thumbTmp = `public/images/thumb.svg`;
  let thumbUrl = `https://raw.githubusercontent.com/${ repo.nameWithOwner }/master/thumb.jpg`;
  let pushDate = Utils.dateString( repo.pushedAt );
  return `
  <div class="slideshow-item hidden">
    <div class="flex-grid flex-top">
      <div class="flex-grid-item flex-40">
        <a href="${ repo.url }" target="_blank">
          <img class="fx-on fx-drop-in thumb" src="${ thumbTmp }" data-image="${ thumbUrl }" width="100%" alt="${ repo.name }" />
        </a>
      </div>
      <div class="flex-grid-item flex-60">
        <h3 class="heading text-uppercase fx-on fx-fade-in fx-delay-1">${ repo.name }</h3>
        <div class="text-grey pad-bottom pad-top icon-clock iconLeft">Last updated &nbsp; ${ pushDate }</div>
        <div class="pad-bottom fx-on fx-fade-in fx-delay-2">${ repo.description }</div>
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
  let target = document.querySelector( '#github-projects' );
  let list   = target ? target.querySelector( '.slideshow-list' ) : null;
  let html   = '';

  if ( !repos || !target || !list ) {
    return console.warn( 'Could not build Github projects slideshow. API or DOM related error.' );
  }
  for ( let i = 0; i < repos.length; ++i ) {
    html += buildSlide( repos[ i ].node );
  }
  list.innerHTML = html;
  new Slideshow( target );
  window.setupImages();
};

// load user data from json file
const loadJsonData = () => {
  new Ajax( 'GET', jsonEndpoint, {
    type: 'json',
    complete: ( xhr, response ) => {
      if ( !response || !response.profile ) {
        return console.error( 'There was a problem loading user profile data for this page, the network tab might have more information.' );
      }
      updateUserData( response.profile );
    },
  });
};

// load user data from github
const loadGithubData = () => {
  new Ajax( 'POST', api.endpoint, {
    type: 'json',
    headers: { 'Authorization': 'bearer '+ atob( api.token ) },
    data: graphQlQuery,
    complete: ( xhr, response ) => {
      // something went wrong, try fetching data from local JSON file
      if ( !response || !response.data || Array.isArray( response.errors ) ) {
        loader.error( 'Status '+ xhr.status +' : Could not load projects, try again later.' );
        loadJsonData();
        return;
      }
      loader.hide();
      updateUserData( response.data.user );
      buildSlideshow( response.data.user.pinnedRepositories.edges );
    },
  });
};

// load data
loadGithubData();






