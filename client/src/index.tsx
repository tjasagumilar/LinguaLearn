import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Onas from './Components/Onas/Onas';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Prijava from './Components/Prijava/Prijava';
import LogoutPage from "./Components/Prijava/LogoutPage/LogoutPage";

const router = createBrowserRouter([
  {
      path: '/',
      element: <App/>,
      children: [
          {
              path: '/onas',
              element: <Onas/>,
          },
          {
            path: '/prijava',
            element: <Prijava/>,
          },
          {
            path: '/registracija',
            element: <Prijava/>,
          },
          {
            path: '/logout',
            element: <LogoutPage name={"Opa!"}/>,
          }
      ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
