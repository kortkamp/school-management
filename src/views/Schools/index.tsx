import { Route, Switch } from 'react-router-dom';

import CreateSchoolConfigurationsView from './CreateSchoolConfigurationsView';
import UpdateSchoolInfoView from './UpdateSchoolInfoView';
import SelectSchoolView from './SelectSchoolView';
import { routePaths } from '../../routes/RoutePaths';

/**
 * Routes for "ClassGroups" view
 * url: /bimestres/*
 */
const TermsRoutes = () => {
  const { data, configure, select } = routePaths.school;
  return (
    <Switch>
      <Route path={data.path} component={UpdateSchoolInfoView} />
      <Route path={configure.path} component={CreateSchoolConfigurationsView} />
      <Route path={select.path} component={SelectSchoolView} />
      {/* <Route component={CreateSchoolsView} /> */}
    </Switch>
  );
};

export default TermsRoutes;
