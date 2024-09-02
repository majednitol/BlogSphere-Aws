import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';  // <-- Import withAuthenticator HOC
import '@aws-amplify/ui-react/styles.css';                 // <-- Import Amplify UI styles

Amplify.configure(config);

const AppWithAuth = withAuthenticator(App); // <-- Wrap your App component with withAuthenticator

ReactDOM.render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
