import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Onas from './Components/Onas/Onas';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Prijava from './Components/Prijava/Prijava';
import Profil from './Components/Profil/Profil';
import MojiJeziki from './Components/MojiJeziki/MojiJeziki';
import Chat from "./Components/Chat/Chat";
import IzberiJezik from './Components/MojiJeziki/IzberiJezik/IzberiJezik';
import Exercises from './Components/Naloge/Tip1/Exercises';
import Uredi from './Components/Profil/Uredi/Uredi';
import Forgot from "./Components/Prijava/Forgot/Forgot";
import Reset from "./Components/Prijava/Reset/Reset";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/onas',
        element: <Onas />,
      },
      {
        path: '/chat',
        element: <Chat />,
      },
      {
        path: '/prijava',
        element: <Prijava />,
      },
      {
        path: '/registracija',
        element: <Prijava />,
      },
      {
        path: '/profil',
        element: <Profil />,
      },
      {
        path: '/jeziki',
        element: <MojiJeziki />
      },
      {
        path: '/izberijezik',
        element: <IzberiJezik />
      },
      {
        path: '/naloge',
        element: <Exercises />
        path: '/uredi',
        element: <Uredi/>
      },
      {
        path: '/forgot',
        element: <Forgot/>
      },
      {
        path: '/reset',
        element: <Reset/>
      }
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
