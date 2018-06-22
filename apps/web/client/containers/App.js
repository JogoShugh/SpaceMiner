import React, { Component } from 'react';
import styled, { injectGlobal } from 'react-emotion';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import Error from '../components/Error';
import FourOhFourPage from '../pages/FourOhFourPage';
import Home from '../pages/Home';

class RouteBoundary extends Component {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true, info, });
  }

  render() {
    const { hasError, info } = this.state;
    if (hasError) {
      return <Error stack={info.componentStack} />;
    }
    return this.props.children;
  }
}

const AppContent = styled.div`
  flex: 1 1 auto;
`;
injectGlobal`
body {
  background: lightgray;
  margin: 0;
  padding: 0;
}
`;

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route>
        <RouteBoundary>
          <AppContent>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route component={FourOhFourPage} />
            </Switch>
          </AppContent>
        </RouteBoundary>
      </Route>
    </Switch>
  </BrowserRouter>
);

export default hot(module)(App);
