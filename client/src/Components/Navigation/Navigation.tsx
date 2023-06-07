import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { auth } from '../../Config/firebase';
import logging from '../../Config/logging';
import { useNavigate } from 'react-router';
import './Navigation.css';
import LeaderBoard from '../LeaderBoard/LeaderBoard';
import { BASE_URL } from '../../api';

const Navigation = () => {
  const [uporabnik, setUporabnik] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        logging.info('User detected.');
        setDisplayName(user.displayName || ' ');
        setUporabnik(true);
        fetch(`${BASE_URL}/uporabnik?uid=${user.uid}`)
            .then((response) => response.json())
            .then((data) => {
              setDisplayName(data.username);
            })
            .catch((error) => {
              console.log(error);
            });
      } else {
        logging.info('No user detected.');
        setUporabnik(false);
      }
    });
  }, []);

  const history = useNavigate();

  const handleLogout = () => {
    auth
        .signOut()
        .then(() => history('/prijava'))
        .catch((error) => logging.error(error));
  };

  return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand className="d-flex align-items-center" href="/">
            <span className="me-2">LinguaLearn</span>
          </Navbar.Brand>
          <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="ms-auto"
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Domov</Nav.Link>
              <Nav.Link href="/onas">O nas</Nav.Link>
              {uporabnik && (
                  <NavDropdown title={displayName} id="basic-nav-dropdown">
                    <NavDropdown.Item href="/profil">Profil</NavDropdown.Item>
                    <NavDropdown.Item href="/jeziki">Moji jeziki</NavDropdown.Item>
                    <NavDropdown.Item href="/chat">Klepet</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Odjava
                    </NavDropdown.Item>
                  </NavDropdown>
              )}
              {!uporabnik && <Nav.Link href="/prijava">Prijava</Nav.Link>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};

export default Navigation;
