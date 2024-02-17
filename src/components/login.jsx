import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
      });

      // Save the token in the browser's local storage
      localStorage.setItem('authToken', response.data.token);

      console.log(response.data);
      // Redirect the user to the protected route
      navigate('/home');
    } catch (error) {
      console.error(error);
      // Check if the error is from the Dummy JSON API
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;