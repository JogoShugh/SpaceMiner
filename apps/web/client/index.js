import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';

export const render = (appEl) => {
  ReactDOM.render((
    <App />
  ), appEl);
};
