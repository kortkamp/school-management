import { Route, Switch } from 'react-router-dom';
import { CreateTeacherView } from '../Users/CreateUserView';
import { TeachersListView } from '../Users/UsersListView';
import TeacherClassGroupView from './TeacherClassGroupView';
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
      <Route path="/professores/turmas/:id" component={TeacherClassGroupView} />
      <Route path="/professores/turmas" component={TeacherClassGroupView} />
      <Route path="/professores/criar" component={CreateTeacherView} />

      <Route exact path="/professores" component={TeachersListView} />
    </Switch>
  );
};

export default TeachersRoutes;
