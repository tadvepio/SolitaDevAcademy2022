import React, { useEffect, useState } from 'react';

function App() {

  const [list, setList] = useState();
  useEffect(() => {
    fetch('http://localhost:9000/journeys?page=1&limit=20')
    .then((res) => res.json())
    .then((data) => setList(data.results))
  },[])
  return (
      <table>
        <tbody>
        <tr>
          <th>Departure station</th>
          <th>Return station</th>
          <th>{'Covered distance (m)'}</th>
          <th>{'Duration sec (s)'}</th>
        </tr>
      {list ? list.map((item, index) => 
        <tr key={index}>
          <td>{item['Departure station name']}</td>
          <td>{item['Return station name']}</td>
          <td>{item['Covered distance (m)']}</td>
          <td>{item['Duration (sec)']}</td>
        </tr>
      )
      : (<tr><td>Nothing</td></tr>)
    }
    </tbody>
      </table>
  );
}

export default App;
