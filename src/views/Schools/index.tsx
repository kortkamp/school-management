import { Route, Switch } from 'react-router-dom';
import CreateSchoolsView from './CreateSchoolsView';

/**
 * Routes for "ClassGroups" view
 * url: /bimestres/*
 */
const TermsRoutes = () => {
  return (
    <Switch>
      <Route path="/escola/criar" component={CreateSchoolsView} />
      {/* <Route component={CreateSchoolsView} /> */}
    </Switch>
  );
};

export default TermsRoutes;
