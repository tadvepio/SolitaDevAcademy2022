import React, {useState, useEffect } from 'react';
import JourneyList from './components/journeyList';
import StationList from './components/stationList';
import AddJourney from './components/addJourney';
import AddStation from './components/addStation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Navbar, Container, Nav, Dropdown, Row } from "react-bootstrap";
import hsl from './img/hsl.png'

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
    <div style={{height:"100%", width:"100%", backgroundColor:"#94cdf2"}}>
      <Navbar collapseOnSelect style={{backgroundColor:"#007ac9", borderBottom:"solid 1px"}} expand="lg" variant="dark">
      <Navbar.Brand className="ps-3"><img src={hsl} alt="hsl icon" style={{height:"40px"}}/>{t("header")}</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      
        <Container fluid>
        <Navbar.Collapse id="responsive-navbar-nav" className="ml-auto">
          <Nav className="me-auto my-2 my-lg-0">
            <Nav.Link style={{color:'white'}} onClick={()=>changeView('j')}>{t("navJourneys")}
            </Nav.Link>
            <Nav.Link style={{color:'white'}} onClick={()=>changeView('s')}>{t("navStations")}</Nav.Link>
            <Dropdown className="ml-auto">
              <Dropdown.Toggle style={{backgroundColor:"#007ac9", border:"none"}} variant="dark">{t("add")}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => changeView('aj')}>{t("newJourney")}</Dropdown.Item>
                <Dropdown.Item onClick={() => changeView('as')}>{t("newStation")}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="ml-auto">
              <Dropdown.Toggle style={{backgroundColor:"#007ac9", border:"none"}} variant="dark">{i18n.language}</Dropdown.Toggle>
              <Dropdown.Menu className="me-2">
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
      { show === 'aj' ? <AddJourney /> : null }
      { show === 'as' ? <AddStation /> : null }
      </Container>
      <Row className="mt-4 text-white" style={{display:"flex", backgroundColor:"#007ac9", height:"5vh", position:"relative", bottom:"0", width:"100%", margin:"0"}}>
      </Row>
    </div>
  );
}

export default App;
