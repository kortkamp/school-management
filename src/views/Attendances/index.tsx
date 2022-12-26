import { Route, Switch } from 'react-router-dom';
import { routePaths } from '../../routes/RoutePaths';
import AttendanceView from './AttendanceView';

/**
 * Routes for "Attendances" view
 * url: /chamadas/*
 */
const ClassGroupsRoutes = () => {
  return (
    <Switch>
      {/* <Route path="/turmas/criar" component={CreateClassView} />
      <Route path="/turmas/:id" component={ClassView} /> */}
      <Route path={routePaths.attendance.path} component={AttendanceView} />
    </Switch>
  );
};

export default ClassGroupsRoutes;
