import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Utils from './class/utils';
import { RasigaAppProvider } from './components/RasigaAppContext';


if(Utils.usecache){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('ServiceWorker registrado con éxito: ', registration);
      }).catch(error => {
        console.log('Error en el registro del ServiceWorker: ', error);
      });
    });
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RasigaAppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RasigaAppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
