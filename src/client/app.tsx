// import { isBrowser } from 'react-device-detect'
import { MuiThemeProvider } from '@material-ui/core/styles';
import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import theme from './theme';

// PAGES -- TODO: LazyLoad
import { Home } from './components/pages/Home';
import { Terms } from './components/pages/Terms';
import { Privacy } from './components/pages/Privacy';
import { Copyright } from './components/pages/Copyright';
import { Contact } from './components/pages/Contact';
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render((
  <MuiThemeProvider theme={theme}>
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      <Route exact path='/home' component={Home} />
      <Route exact path='/terms' component={Terms} />
      <Route exact path='/privacy' component={Privacy} />
      <Route exact path='/copyright' component={Copyright} />
      <Route exact path='/contact' component={Contact} />
    </Switch>
  </BrowserRouter>
  </MuiThemeProvider>
), document.getElementById('app'));
