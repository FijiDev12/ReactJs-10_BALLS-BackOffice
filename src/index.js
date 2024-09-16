import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "/node_modules/primeflex/primeflex.css"
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense>
    <App />
  </Suspense>
);
