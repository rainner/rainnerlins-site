/**
 * Sanitizes and checks input fields.
 */
class InputContainer {

  // setup input
  constructor( input ) {
    this._input = ( input instanceof Element && 'value' in input ) ? input : null;
    this._value = this._input ? String( this._input.value || '' ).trim() : '';
    this._elist = []; // errors for this input
  }

  // get value
  val() {
    return this._value;
  }

  // try to focus the input
  focus() {
    if ( this._input ) {
      try { this._input.focus(); }
      catch( e ) {}
    }
    return this;
  }

  // check if input is valid
  valid() {
    if ( !this._input ) return false;
    return ( !this._elist.length ) ? true : false;
  }

  // focus input and get errors if any
  info() {
    this.focus();

    if ( this._elist.length ) {
      // format multiple errors together
      if ( this._elist.length > 1 ) {
        let last = this._elist.pop();
        return 'Value '+ this._elist.join( ', ' ) + ' and '+ last +'.';
      }
      return 'Value '+ this._elist[0] +'.';
    }
    return 'No errors.';
  }

  // value must be and e-mail address
  email() {
    this._value = this._value.replace( /[^\w\-\@\.]+/g, '' );
    return this._test( /^[\w\-\.]+\@[\w\-\.]+$/, 'must be a valid e-mail address' );
  }

  // value must be a person's name
  name() {
    this._value = this._value.replace( /[^\w\s\']+/g, '' );
    return this._test( /^[\w\s\']+$/, 'must be a valid name' );
  }

  // value must be a phone number (US 10 to 11 digits, ie: [1-]000-000-0000)
  phone() {
    this._value = this._value.replace( /[^\d]+/g, '' );
    return this._test( /^[\d]{10,11}$/, 'must be a valid phone number' );
  }

  // value must be a url
  url() {
    return this._test( /^([\w\-]+\:)?\/\/.*$/, 'must be a valid URL' );
  }

  // value must be greater than length
  min( length ) {
    length = length | 0;

    if ( length && this._value.length < length ) {
      return this._error( 'must be at least '+ length +' characters long' );
    }
    return this;
  }

  // value must be less than length
  max( length ) {
    length = length | 0;

    if ( length && this._value.length > length ) {
      return this._error( 'must be less than '+ length +' characters long' );
    }
    return this;
  }

  // value must not be empty
  required() {
    let val = this._value.replace( /[\s\uFEFF\xA0]+/g, '' );

    if ( !val.length ) {
      return this._error( 'can not be empty' );
    }
    return this;
  }

  // test value against a regex pattern and provide info if it fails
  _test( rgex, info ) {
    if ( !rgex.test( this._value ) ) {
      this._elist.push( info );
    }
    return this;
  }

  // add custom error to the list
  _error( info ) {
    this._elist.push( info );
    return this;
  }
}

/**
 * Export wrapper function
 */
export default function( input ) {
  return new InputContainer( input );
}
