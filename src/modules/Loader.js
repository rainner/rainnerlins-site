/**
 * Basic function for controlling the common page _targets.
 */
export default function( selector ) {
  const _target = document.querySelector( selector || '' );

  return {

    // show the _target with message
    show: ( message ) => {
      if ( _target ) {
        _target.textContent = message || '';
        _target.classList.remove( 'error' );
        _target.classList.remove( 'done' );
      }
      return this;
    },

    // show error state with message
    error: ( message ) => {
      if ( _target ) {
        _target.textContent = message || '';
        _target.classList.add( 'error' );
        _target.classList.remove( 'done' );
      }
      return this;
    },

    // hide the _target
    hide: ( message ) => {
      if ( _target ) {
        _target.textContent = '';
        _target.classList.add( 'done' );
      }
      return this;
    },

  }
}
