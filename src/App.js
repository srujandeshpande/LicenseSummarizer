import { Route, Switch, BrowserRouter } from "react-router-dom";
import ROUTES from "./routes";
import React from 'react';

import LicensePage from './pages/LicensePage.js';


function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={ROUTES.licensepage} component={LicensePage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
