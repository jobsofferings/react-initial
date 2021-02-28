import React from 'react';
import logo from './logo.svg';
import { ConfigProvider } from 'antd';
import { ApolloProvider } from 'react-apollo';
import antdConfig from './config/antdConfig';
import apolloClient from 'src/apollo/apolloClient'
import './App.less';
import './reset.less'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ConfigProvider {...antdConfig}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
