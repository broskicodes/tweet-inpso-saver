const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev 
  ? 'http://localhost:8000'
  : 'https://api.builderepidemic.com';

export const APP_URL = isDev
  ? 'http://localhost:3000'
  : 'https://tweetmaestro.com';
