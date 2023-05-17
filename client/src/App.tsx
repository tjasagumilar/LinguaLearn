import React, { useEffect, useState } from 'react'
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar';
import Homepage from './Components/Homepage/Homepage';
import { Outlet, useLocation } from 'react-router-dom';

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

function App() {

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div>
      <Navbar />
      {isHomePage && <Homepage /> }
      <PageBody />
      <Footer />
    </div>
  );

  /*
  const [data, setData] = useState<DataItem[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/test')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err))
  })

  return (
    <div>
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