import { push } from 'react-router-redux';

export const changeRoute = (route: string) => {
  return (dispatch) => {
    dispatch(push(route));
  };
};

export default {
  changeRoute,
};
