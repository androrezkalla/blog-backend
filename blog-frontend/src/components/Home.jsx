import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home({ onLogout }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/auth/current_user')
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setUsername(data.user.username);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); 
        navigate('/'); 
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Hello, {username}!
        </h1>
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
