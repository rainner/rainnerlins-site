/**
 * Setup tooltips.
 */
import Tooltip from '../modules/Tooltip';

const tooltip = new Tooltip();
const elms = document.querySelectorAll( '[title]' );

for ( let i = 0; i < elms.length; ++i ) {
  tooltip.select( elms[ i ] );
}
