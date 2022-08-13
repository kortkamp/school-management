import { Route, Switch } from 'react-router-dom';
import { routeNames } from '../../routes';
import CreateSchoolConfigurationsView from './CreateSchoolConfigurationsView';
import UpdateSchoolInfoView from './UpdateSchoolInfoView';

/**
 * Routes for "ClassGroups" view
 * url: /bimestres/*
 */
const TermsRoutes = () => {
  const { create, configure } = routeNames.school;
  return (
    <Switch>
      <Route path={create.path} component={UpdateSchoolInfoView} />
      <Route path={configure.path} component={CreateSchoolConfigurationsView} />
      {/* <Route component={CreateSchoolsView} /> */}
    </Switch>
  );
};

export default TermsRoutes;
