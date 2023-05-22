import React, { useEffect, useState } from 'react'
import Footer from './Components/Footer/Footer';
import Homepage from './Components/Homepage/Homepage';
import { useLocation} from 'react-router-dom';
import { auth } from './Config/firebase';
import logging from './Config/logging';
import {Spinner} from "reactstrap";
import { Outlet } from 'react-router';
import Navigation from './Components/Navigation/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./custom.scss"


/*
interface DataItem {
  id: number;
  ime: number
}
*/

const PageBody = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
 /*
interface Slika {
  url: string
}
*/

function App() {

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div>
      <Navigation/>
      {isHomePage ? <Homepage /> : <PageBody />}
    </div>
  );

  /*
  const [data, setData] = useState<DataItem[]>([])
  const [slika, setSlika] = useState<Slika>()

  useEffect(() => {
    fetch('http://localhost:5000/test')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err))
  })

  return (
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err =>console.log(err))
  })         
  
  useEffect(() => {
    fetch('http://localhost:5000')
      .then(res => res.json())
      .then(slika => setSlika(slika))
      .catch(err => console.log(err))
  }, []);
  
  return(          
    <div>
{slika && <img src={slika.url} alt="Pixabay Image" />}
      <table>
        <thead>
          <th>Id</th>
          <th>Ime</th>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.id}</td>
              <td>{d.ime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
  */
}

export default App