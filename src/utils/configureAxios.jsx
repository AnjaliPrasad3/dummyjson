import axios from 'axios';

const configureAxios = () => {
  const token = localStorage.getItem('authToken');

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    console.error('Token not found in local storage');
  }
};

export default configureAxios;