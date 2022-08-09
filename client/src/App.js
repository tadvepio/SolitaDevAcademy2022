import React, {useState, useEffect } from 'react';
import JourneyList from './components/journeyList';
import StationList from './components/stationList';
import AddJourney from './components/addJourney';
import AddStation from './components/addStation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Navbar, Container, Nav, Dropdown, Row } from "react-bootstrap";

function App() {

  const [show, setShow] = useState('j');
  const { t, i18n } = useTranslation(["navbar", "journeys"]);

  const changeView = (name) => {
    setShow(name)
  }

  useEffect( () => {
      navigator.language !== "fi" ? i18n.changeLanguage("en")
      :
      i18n.changeLanguage(navigator.language)
},[i18n])

  return (
    <div className="bg-light" style={{height:"100vh", width:"100%"}}>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand className="ps-3">{t("header")}</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      
        <Container>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link onClick={()=>changeView('j')}>{t("navJourneys")}
            </Nav.Link>
            <Nav.Link onClick={()=>changeView('s')}>{t("navStations")}</Nav.Link>
            <Dropdown className="ml-auto">
              <Dropdown.Toggle variant="dark">Add new</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => changeView('aj')}>Journey</Dropdown.Item>
                <Dropdown.Item onClick={() => changeView('as')}>Station</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="ml-auto">
              <Dropdown.Toggle variant="dark">{i18n.language}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => i18n.changeLanguage("fi")}>Suomi</Dropdown.Item>
                <Dropdown.Item onClick={() => i18n.changeLanguage("en")}>English</Dropdown.Item>
                <Dropdown.Item onClick={() => i18n.changeLanguage("swe")}>Svenska</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="text-center" style={{width:"90%"}}>
      { show === 'j' ? <JourneyList /> : null }
      { show === 's' ? <StationList /> : null }
      { show == 'aj' ? <AddJourney /> : null }
      { show === 'as' ? <AddStation /> : null }
      </Container>
      <Row className="mt-4 text-white" style={{display:"flex", backgroundColor:"#292b2c", height:"5vh", position:"relative", bottom:"0", width:"100%", margin:"0"}}>
      </Row>
    </div>
  );
}

export default App;
