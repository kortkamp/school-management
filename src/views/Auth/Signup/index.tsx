import { Route, Switch } from 'react-router-dom';
import SignupView from './Signup';
import ConfirmEmailView from './ConfirmEmail';
import ConfirmSubscription from './ConfirmSubscription';

/**
 * Routes for "Signup" flow
 * url: /auth/signup/*
 */
const SignupRoutes = () => {
  return (
    <Switch>
      <Route path="/auth/signup/confirm-email" component={ConfirmEmailView} />
      <Route path="/auth/signup/confirm-registration" component={ConfirmSubscription} />

      <Route path="/auth/signup" component={SignupView} />
      <Route component={SignupView} />
    </Switch>
  );
};

export default SignupRoutes;
