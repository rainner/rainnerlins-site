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

  let proto   = window.location.protocol || 'https:';
  let host    = window.location.host || 'rainnerlins.com';
  let email   = Input( e.target.email ).email().required();
  let message = Input( e.target.message ).min( 20 ).required();
  let subject = 'Dialogue with '+ email.val() +' on '+ host +'.';

  if ( !e.target.action || e.target.action === '#' ) return;
  if ( !email.valid() )   return notify.warning( email.info() );
  if ( !message.valid() ) return notify.warning( message.info() );

  // submit to new URL
  e.target.setAttribute( 'target', '_self' );
  e.target._next.value = proto +'//'+ host +'/#mailsent';
  e.target._subject.value = subject;
  e.target.submit();
  e.target.reset();

  // submit using AJAX
  // e.target.setAttribute( 'disabled', 'disabled' );
  // new Ajax( 'POST', e.target.action, {
  //   data: {
  //     _replyto: email.val(),
  //     _subject: subject,
  //     message: message.val(),
  //   },
  //   success: function( xhr, response ) {
  //     notify.success( response.message || 'Message sent, thanks!' );
  //     e.target.reset();
  //   },
  //   error: function( xhr, error ) {
  //     notify.error( error );
  //   },
  //   complete: function( xhr, response ) {
  //     e.target.removeAttribute( 'disabled' );
  //   },
  // });
};

// add forms submit event
const forms = document.querySelectorAll( 'form.contact-form' );
for ( let i = 0; i < forms.length; ++i ) forms[ i ].addEventListener( 'submit', handler );

// if coming back from submitted page, show alert
setTimeout( () => {
  switch ( window.location.hash ) {
    case '#mailsent'  : notify.success( 'Your message has been sent. I\'ll get back to you soon, thanks!' ); break;
    case '#mailerror' : notify.success( 'Oops, there was a problem. Try sending again, or use the e-mail address.' ); break;
  }
}, 1000 );


