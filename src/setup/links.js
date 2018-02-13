/**
 * Setup custom click events on elements.
 */
const linkmap = {
  github: 'https://github.com/rainner?tab=repositories&type=source',
  codepen: 'https://codepen.io/rainner',
  stackoverflow: 'https://stackoverflow.com/users/5760318/rainner',
  twitter: 'https://twitter.com/raintek_',
  instagram: 'https://instagram.com/raintek_',
  email: 'mailto:info@rainnerlins.com',
};

const elms = document.querySelectorAll( '[data-action]' );

for ( let i = 0; i < elms.length; ++i ) {
  elms[ i ].addEventListener( 'click', e => {
    e.preventDefault();

    let key    = e.target.getAttribute( 'data-action' ) || '';
    let parts  = key.split( ':' ); // action:source:target
    let action = parts.length ? parts.shift() : '';
    let source = parts.length ? parts.shift() : '';
    let target = parts.length ? parts.shift() : '_blank';

    // no action needed
    if ( !action || action === 'none' ) {
      return;
    }
    // launch a new tab/window for source
    if ( action === 'go' && source ) {
      let url = linkmap[ source ] || '';
      if ( url ) window.open( url, target );
      return;
    }
    // reload the page
    if ( action === 'reload' ) {
      return window.location.reload();
    }
    // go back
    if ( action === 'back' ) {
      return window.history.back();
    }
    // ...
  });
}




