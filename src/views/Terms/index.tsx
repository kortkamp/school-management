import { Route, Switch } from 'react-router-dom';
import ListTermsView from './ListTermsView';
import CreateTermView from './CreateTermView';

/**
 * Routes for "ClassGroups" view
 * url: /bimestres/*
 */
const TermsRoutes = () => {
  return (
    <Switch>
      <Route path="/bimestres/criar" component={CreateTermView} />
      <Route path="/bimestres/:id" component={CreateTermView} />
      <Route component={ListTermsView} />
    </Switch>
  );
};

export default TermsRoutes;
