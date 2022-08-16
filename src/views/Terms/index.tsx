import { Route, Switch } from 'react-router-dom';
import ListTermsView from './ListTermsView';

/**
 * Routes for "ClassGroups" view
 * url: /bimestres/*
 */
const TermsRoutes = () => {
  return (
    <Switch>
      <Route component={ListTermsView} />
    </Switch>
  );
};

export default TermsRoutes;
