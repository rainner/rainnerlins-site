/**
 * Setup dynamic page links
 */
import Ajax from '../modules/Ajax';
import Modal from '../modules/Modal';

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

// setup crypto address links
const showCryptoAddressModal = ( symbol, address ) => {
  if ( !symbol || !address ) return;

  const title = 'Copy '+ symbol +' Address';
  const body  = `
  <div class="qr-wrap">
    <img class="qr-image" src="https://chart.googleapis.com/chart?chs=250x250&cht=qr&choe=UTF-8&chl=${address}" width="250" height="250" alt="${title}" />
    <div class="qr-info">Make sure to send only ${symbol} to this address.</div>
    <pre class="qr-address">${address}</pre>
  </div>`;

  new Modal( { title, body } );
};

// setup crypto address links
const setupCryptoLinks = ( data ) => {
  let target = document.querySelector( '#crytolinks' );
  if ( !target || !data || typeof data !== 'object' ) return;

  for ( let key in data ) {
    if ( !data.hasOwnProperty( key ) ) continue;

    let symbol = String( key ).toUpperCase();
    let address = String( data[ key ] ).trim();
    let link = document.createElement( 'a' );

    link.textContent = symbol;
    link.setAttribute( 'class', 'pill bg-info-hover' );
    link.setAttribute( 'title', 'Copy address' );
    link.setAttribute( 'href', '#' );
    link.addEventListener( 'click', e => {
      e.preventDefault();
      showCryptoAddressModal( symbol, address );
    });
    target.appendChild( link );
  }
};

// get services data from JSON file and init
new Ajax( 'GET', endpoint, {
  type: 'json',
  complete: ( xhr, response ) => {
    setupLinks( response.links || {} );
    setupCryptoLinks( response.crypto || {} );
  }
});
