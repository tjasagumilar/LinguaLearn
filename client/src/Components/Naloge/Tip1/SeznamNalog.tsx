import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import './SeznamNalog.css'; 

const SeznamNalog = () => {
  return (
    <Container fluid>
      <div className="container-wrapper">
        <Container>

          <a href="/destination1">
            <Container className="custom-container bg" style={{ width: '1000px', height: '300px' }}>
              <div className="container-content">
                <h3>Prevajanje povedi</h3>
                <hr></hr>
                <p>Ta sekcija omogoča prevajanje celotnih povedi.</p>
              </div>
            </Container>
          </a>
          <br />

          <a href="/destination2">
            <Container className="custom-container bg" style={{ width: '1000px', height: '300px' }}>
              <div className="container-content">
                <h3>Prevajanje posameznih besed</h3>
                <hr></hr>
                <p>Ta sekcija omogoča prevajanje posameznih besed v izbranem jeziku.</p>
              </div>
            </Container>
          </a>
          <br />

          <a href="/destination3">
            <Container className="custom-container bg" style={{ width: '1000px', height: '300px' }}>
              <div className="container-content">
                <h3>Prepoznavanje slik</h3>
                <hr></hr>
                <p>Ta sekcija vam omogoča opisovanje vsebine slike s pomočjo besedila.</p>
              </div>
            </Container>
          </a>
          <br />
          <a href="/destination4">
            <Container className="custom-container bg" style={{ width: '1000px', height: '300px' }}>
              <div className="container-content">
                <h3>Naključna naloga</h3>
                <hr></hr>
                <p>Ta sekcija je sestavljena iz mešanice različnih vrst nalog.</p>
              </div>
            </Container>
          </a>
          <br/>
        </Container>
      </div>
    </Container>
  );
};

export default SeznamNalog;
