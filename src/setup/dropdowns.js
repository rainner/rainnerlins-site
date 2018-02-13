/**
 * Setup dropdown menus
 */
import Dropdown from '../modules/Dropdown';

const elms = document.querySelectorAll( '.dropdown-menu' );

for ( let i = 0; i < elms.length; ++i ) {
  new Dropdown( elms[ i ] );
}
