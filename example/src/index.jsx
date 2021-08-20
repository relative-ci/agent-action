import React from 'react';
import ReactDOM from 'react-dom';

import { Examples } from './components/examples';
import { Layout } from './components/layout';
import data from './data.json';
import './index.css';

const App = () => (
  <Layout>
    <Examples data={data} />
  </Layout>
);

function render () {
  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  );
}

render();

if (module.hot) {
  module.hot.accept('./', function() {
    render();
  });
}
