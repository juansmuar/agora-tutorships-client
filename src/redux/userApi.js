import axios from '../utils/axios';
import history from '../utils/history';
import Swal from 'sweetalert2';
import { TOKEN } from '../actions/constants';

const swalStyled = Swal.mixin({
  customClass: {
    confirmButton: 'swal__confirm',
    cancelButton: 'swal__cancel',
    title: 'swal__title',
    container: 'swal__text',
    actions: 'swal__actions',
  },
  buttonsStyling: false,
});

export async function loginUser ({ email, password }) {
  try {
    const response = await axios.post('/login', { email, password })
    const token = response.data.token;
    localStorage.setItem(TOKEN, token);
    history.push('/home');
    return (response.data);
  } catch (error) {
    console.log(error);
    return error;
  };
};

export async function fetchData (token) {
  try {
    const response = await axios.get('/login', { params: { token } });
    return (response.data);
  } catch (error) {
    console.log(error);
    return error;
  };
};

export async function registerUser (type, inputs) {
  try {
    const response = await axios.post('/register', { type, inputs });
    const token = response.data.token;
    localStorage.setItem(TOKEN, token);
    swalStyled.fire({
      icon: 'success',
      title: 'Successful Registration'
    });
    return (response.data);
  } catch (error) {
    const errorMessage = error.response.data.message;
    swalStyled.fire({
      icon: 'error',
      title: 'Oops... Please try again',
      text: errorMessage,
    });
  };
};
