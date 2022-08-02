import React, {useState} from 'react';
import JourneyList from './components/journeyList';
import StationList from './components/stationList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

function App() {

  const [show, setShow] = useState('j');

  const changeView = (name) => {
    setShow(name)
  }

  return (
    <div className="bg-light">
      <Navbar style={{position: "sticky", top: 0}} collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Nav className="me-auto">
          <Nav.Link><button onClick={()=>changeView('j')}>Journeys</button></Nav.Link>
          <Nav.Link><button onClick={()=>changeView('s')}>Stations</button></Nav.Link>
      </Nav>
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
