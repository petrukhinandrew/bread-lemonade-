import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

document.body.innerHTML ='<div id="container"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('container')!);
root.render(<App/>);
