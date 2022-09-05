import { Route, Switch } from 'react-router-dom';
import { routeNames } from '../../routes';
import CreateSchoolConfigurationsView from './CreateSchoolConfigurationsView';
import UpdateSchoolInfoView from './UpdateSchoolInfoView';
import SelectSchoolView from './SelectSchoolView';

/**
 * Routes for "ClassGroups" view
 * url: /bimestres/*
 */
const TermsRoutes = () => {
  const { create, configure, select } = routeNames.school;
  return (
    <Switch>
      <Route path={create.path} component={UpdateSchoolInfoView} />
      <Route path={configure.path} component={CreateSchoolConfigurationsView} />
      <Route path={select.path} component={SelectSchoolView} />
      {/* <Route component={CreateSchoolsView} /> */}
    </Switch>
  );
};

export default TermsRoutes;
