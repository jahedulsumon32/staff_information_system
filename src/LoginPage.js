import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure you have axios installed
import './css/login.css'; // Adjust the path if necessary

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const base_url = process.env.REACT_APP_API_URL; // Ensure this is set in your .env file

  // Check for existing token in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    setSuccess(''); // Reset success message

    try {
      const response = await axios.post(`${base_url}/login`, { email, password });
      const token = response.data.session_id;
      localStorage.setItem('authToken', token);

      setSuccess('Login successful!');
      setIsLoggedIn(true);

      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } catch (error) {
      setError('Invalid email or password');
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    
    <div className='card-container-login'>
      <div className="login-page">
        <main className="form-signin text-center content-center">
        {!isLoggedIn ? (
          <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

            {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
            {success && <div className="alert alert-success">{success}</div>} {/* Display success message */}

            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            <p className="mt-5 mb-3 text-muted">&copy; 2017–2024</p>
          </form>
            ) : (
              // If user is logged in, show logout button
              <div className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md md:ml-auto w-full">
                <h3 className="text-3xl font-extrabold mb-12">Welcome back!</h3>
                <p className="text-lg">You are already logged in.</p>
                <button
                  onClick={handleLogout}
                  className="w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-800 focus:outline-none"
                >
                  Log out
                </button>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
