import React, { useEffect, useState } from 'react';
import logo from '@assets/img/logo.svg';
import { TwitterAuth } from '../../lib/twitterAuth';

export default function Popup() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    // Check auth status when popup opens
    chrome.storage.local.get(['is_authenticated', 'user_id'], (result) => {
      setIsAuthenticated(!!result.is_authenticated);
      setUserId(result.user_id);
    });
  }, []);

  useEffect(() => {
    console.log(userId);
  }, [userId]);

  const handleLogin = async () => {
    const twitterAuth = new TwitterAuth({
      clientId: import.meta.env.VITE_TWITTER_CLIENT_ID,
      backendUrl: import.meta.env.VITE_API_URL
    });
    
    await twitterAuth.initiateOAuth();
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <header className="flex flex-col items-center justify-center text-white">
        <img src={logo} className="h-36 pointer-events-none animate-spin-slow" alt="logo" />
        
        {isAuthenticated ? (
          <p className="text-green-400 font-medium mt-4">✓ Authenticated with Twitter</p>
        ) : (
          <button
            onClick={handleLogin}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg 
                     text-white font-medium transition-colors"
          >
            Login with Twitter
          </button>
        )}
      </header>
    </div>
  );
}
