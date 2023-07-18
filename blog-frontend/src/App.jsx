import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <Router>
      <div>
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-white font-bold text-lg">
                    My Blog
                  </Link>
                </div>
              </div>
              {isLoggedIn && (
                <div className="flex space-x-4">
                  <Link
                    to="/home"
                    className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/"
                    onClick={handleLogout}
                    className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Home username={username} onLogout={handleLogout} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/home"
            element={<Home username={username} onLogout={handleLogout} />}
          />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
