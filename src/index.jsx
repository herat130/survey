import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import allReducer from './reducers';
import App from './components/App';
import polyfillForApp from './utils/polyfill';
import ErrorPage from './components/ErrorPage';
import * as action from './actions/surey.action';

const middleWare = applyMiddleware(thunk, logger);
const store = createStore(allReducer, middleWare);

/** For Cross browser web app required polyfills has been added */
polyfillForApp();

// initial data fetch required in case user directly move to start-survey route 
action.surveyFetch()
  .then(fetchAction => store.dispatch(fetchAction))
  .then(() => {
    ReactDOM.render(<Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>, document.getElementById('app-root'));
  }).catch(error => <ErrorPage error={error} />);

global.qtn = store.getState(); // for debugging use only