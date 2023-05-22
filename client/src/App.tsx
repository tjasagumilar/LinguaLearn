import Homepage from './Components/Homepage/Homepage';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router';
import Navigation from './Components/Navigation/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./custom.scss";


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
      <Navigation />
      {isHomePage ? <Homepage /> : <PageBody />}
    </div>
  );

}

export default App