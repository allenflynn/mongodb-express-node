import axios from 'axios';
import { showAlert } from './alert';

export const update = async (data, type) => {
  const url =
    type === 'settings'
      ? '/api/v1/users/updateSettings'
      : 'api/v1/users/updatePassword';
  try {
    const res = await axios.patch(url, data);
    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`
      );
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
