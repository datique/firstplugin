import React from 'react';
import PropTypes from 'prop-types';
import Car from './car.js'
import Covid from './safeture.js'
//import Covid from './covid.js'
//import Covid from './covid19.js'


export function makeHelloWorld({ i18nHelper, dispatchersHelper, storeHelper, selectorsHelper }) {
  function HelloWorld({ t }) {

    return (
      <div>

        <Covid storeHelper={storeHelper} selectorsHelper={selectorsHelper} />
      </div>

    );
  }



  HelloWorld.propTypes = {
    t: PropTypes.func.isRequired,
  };



  return i18nHelper.withTranslation({ wait: true })(HelloWorld);
}
