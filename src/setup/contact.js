/**
 * Setup contact form
 */
import Ajax from '../modules/Ajax';
import Input from '../modules/Input';
import Notify from '../modules/Notify';

// form and notifications
const notify  = new Notify();
const handler = e => {
  e.preventDefault();

  let host    = window.location.hostname || 'rainnerlins.com';
  let email   = Input( e.target.email ).email().required();
  let message = Input( e.target.message ).min( 20 ).required();

  if ( !email.valid() )   return notify.warning( email.info() );
  if ( !message.valid() ) return notify.warning( message.info() );

  e.target.setAttribute( 'disabled', 'disabled' );

  new Ajax( 'POST', e.target.action, {
    data: {
      _replyto: email.val(),
      _subject: 'Dialogue with '+ email.val() +' on '+ host +'.',
      message: message.val(),
    },
    success: function( xhr, response ) {
      notify.success( response.message || 'Message sent, thanks!' );
      e.target.reset();
    },
    error: function( xhr, error ) {
      notify.error( error );
    },
    complete: function( xhr, response ) {
      e.target.removeAttribute( 'disabled' );
    },
  });
};

// add forms submit event
const forms = document.querySelectorAll( 'form.contact-form' );
for ( let i = 0; i < forms.length; ++i ) {
  forms[ i ].addEventListener( 'submit', handler );
}

