import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { auth } from '../../Config/firebase';
import logging from '../../Config/logging';
import { useNavigate } from 'react-router';
import "./Navigation.css";


const Navigation = () => {

  const [uporabnik, setUporabnik] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        logging.info('User detected.');
        setDisplayName(user.displayName || 'upime');
        setUporabnik(true);
      } else {
        logging.info('No user detected.');
        setUporabnik(false);
      }
    });
  }, []);

  const history = useNavigate();

  const handleLogout = () => {
    auth.signOut()
      .then(() => history('/prijava'))
      .catch(error => logging.error(error));
  };

  if (uporabnik) {
    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">LinguaLearn</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Domov</Nav.Link>
              <Nav.Link href="/onas">O nas</Nav.Link>
              <NavDropdown title={displayName} id="basic-nav-dropdown">
                <NavDropdown.Item href="/profil">Profil</NavDropdown.Item>
                <NavDropdown.Item href="/jeziki">Moji jeziki</NavDropdown.Item>
                <NavDropdown.Item href="/chat">Chat</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}> Odjava</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  } else {
    return (
      <Navbar bg="light" expand="lg" >
        <Container>
          <Navbar.Brand href="/">LinguaLearn</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Domov</Nav.Link>
              <Nav.Link href="/onas">O nas</Nav.Link>
              <Nav.Link href="/prijava">Prijava</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

}

export default Navigation;