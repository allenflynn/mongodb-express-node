import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (name, email, password, confirm) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        confirm
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Signup successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (error) {
    console.log(error.response);
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (error) {
    console.log(error.response);
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get('/api/v1/users/logout');
    if ((res.data.status = 'success'))
      // location.reload(true);
      location.assign('/');
  } catch (error) {
    console.log(error.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
