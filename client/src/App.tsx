import Homepage from './Components/Homepage/Homepage';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router';
import Navigation from './Components/Navigation/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./custom.scss";


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
<<<<<<< HEAD
      <Navigation />
=======
      <Navbar />
>>>>>>> parent of 0a596271 (generiranje nalog, python, react)
      {isHomePage ? <Homepage /> : <PageBody />}
    </div>
  );

}

export default App