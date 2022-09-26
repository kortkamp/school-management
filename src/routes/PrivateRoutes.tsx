import { Route, Switch } from 'react-router-dom';

import {
  About,
  NotFound,
  Teachers,
  ClassGroups,
  Students,
  Exams,
  Terms,
  Routines,
  Schools,
  Home,
  Messages,
  Courses,
  Employees,
  Welcome,
} from '../views';
import { PrivateLayout } from './Layout';
import { routePaths } from './RoutePaths';

/**
 * List of routes available only for authenticated users
 * Also renders the "Private Layout" composition
 */
const PrivateRoutes = () => {
  return (
    <PrivateLayout>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path={routePaths.welcome.path} component={Welcome} />
        <Route path="/about" component={About} />,
        <Route path="/professores" component={Teachers} />,
        <Route path="/turmas" component={ClassGroups} />,
        <Route path="/alunos" component={Students} />,
        <Route path="/exames" component={Exams} />,
        <Route path="/bimestres" component={Terms} />,
        <Route path={routePaths.routines.path} component={Routines} />,
        <Route path={routePaths.courses.path} component={Courses} />,
        <Route path={routePaths.school.path} component={Schools} />,
        <Route path={routePaths.employees.path} component={Employees} />,
        <Route path="/mensagens" component={Messages} />,
        <Route component={NotFound} />
      </Switch>
    </PrivateLayout>
  );
};

export default PrivateRoutes;
