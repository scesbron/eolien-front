import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import configureStore from './store';
import './index.css';
import App from './App';
import { initAuthorization } from './api';
import AppLoader from './containers/app-loader';

const store = configureStore();

initAuthorization();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <AppLoader>
          <App />
        </AppLoader>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
