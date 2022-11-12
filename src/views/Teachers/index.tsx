import { Route, Switch } from 'react-router-dom';
import { CreateTeacherView } from './CreateTeacherView';
import TeachersListView from './TeachersListView';
import TeacherSubjectView from './TeacherSubjectView';

/**
 * Routes for "Teachers" view
 * url: /professores/*
 */
const TeachersRoutes = () => {
  return (
    <Switch>
      {/* <Route path="/professores/criar" component={TeachersListView} /> */}
      <Route path="/professores/disciplinas/:id" component={TeacherSubjectView} />
      <Route path="/professores/disciplinas" component={TeacherSubjectView} />
      <Route path="/professores/criar" component={CreateTeacherView} />

      <Route exact path="/professores" component={TeachersListView} />
    </Switch>
  );
};

export default TeachersRoutes;
