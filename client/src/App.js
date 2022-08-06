import React, {useState} from 'react';
import JourneyList from './components/journeyList';
import StationList from './components/stationList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";

function App() {

  const [show, setShow] = useState('j');

  const { t, i18n } = useTranslation(["navbar", "journeys"]);

  const changeView = (name) => {
    setShow(name)
  }

  return (
    <div className="bg-light">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand className="ps-3">{t("header")}</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      
        <Container>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link onClick={()=>changeView('j')}>{t("navJourneys")}</Nav.Link>
            <Nav.Link onClick={()=>changeView('s')}>{t("navStations")}</Nav.Link>
            <Dropdown className="ml-auto">
              <Dropdown.Toggle variant="dark">{i18n.language}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => i18n.changeLanguage("Finnish")}>Suomi</Dropdown.Item>
                <Dropdown.Item onClick={() => i18n.changeLanguage("English")}>English</Dropdown.Item>
                <Dropdown.Item onClick={() => i18n.changeLanguage("Swedish")}>Svenska</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="text-center">
      {show === 'j' ?
      <JourneyList />:
      <StationList />}
      </Container>
    </div>
  );
}

export default App;
