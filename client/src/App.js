import React, {useState} from 'react';
import JourneyList from './components/journeyList';
import StationList from './components/stationList';

function App() {

  const [show, setShow] = useState('j');

  const changeView = (name) => {
    setShow(name)
  }

  return (
    <div>
      <button onClick={()=>changeView('j')}>Journeys</button>
      <button onClick={()=>changeView('s')}>Stations</button>
      {show === 'j' ?
      <JourneyList />:
      <StationList />}
    </div>
  );
}

export default App;
