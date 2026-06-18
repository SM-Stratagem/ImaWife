import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import ImAWifeApp from '../ImAWifeApp.jsx';

const showAnalytics =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ImAWifeApp />
    {showAnalytics ? <Analytics /> : null}
  </React.StrictMode>,
);
