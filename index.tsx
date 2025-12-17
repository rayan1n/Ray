/* 
 * Property of 0.tk
 * Ray Controller Macro - v1.0.0
 * Copyright © 2024 0.tk. All rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);