/**
 * Setup dropdown menus
 */
import Dropdown from '../modules/Dropdown';

window.addEventListener( 'load', e => {
  let elms = document.querySelectorAll( '.dropdown-menu' );
  for ( let i = 0; i < elms.length; ++i ) new Dropdown( elms[ i ] );
}, false );
