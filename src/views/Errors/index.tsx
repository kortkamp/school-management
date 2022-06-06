import NotFound from './NotFound';
import Forbidden from './Forbidden';
import UnknownError from './UnknownError';

export const ErrorAPI = (code: number) => {
  switch (code) {
    case 403:
      return Forbidden;

    case 404:
      return NotFound;

    default:
      return UnknownError;
  }
};
