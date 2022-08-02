import React, { useEffect, useState } from 'react';

function JourneyList() {

    const [page, setPage ] = useState(1)
    const [list, setList] = useState();
    
    useEffect(() => {
    console.log(page)
    fetch(`http://localhost:9000/journeys?page=${page}&limit=20`)
    .then((res) => res.json())
    .then((data) => setList(data.results))
    },[page])

    const nextJourneys = () => {
    setPage(page+1)
    }

    return (
    <>
    <h1>Journey list</h1>
    <p>Page: {page}</p>
        <table>
        <tbody>
        <tr>
            <th>Departure station</th>
            <th>Return station</th>
            <th>{'Covered distance'}</th>
            <th>{'Duration'}</th>
        </tr>
        {list ? list.map((item, index) => 
        <tr key={index}>
            <td>{item['Departure station name']}</td>
            <td>{item['Return station name']}</td>
            <td>{parseFloat(item['Covered distance (m)'])/1000} km</td>
            <td>{parseFloat(item['Duration (sec)']/60).toFixed(2)} minutes</td>
        </tr>
        )
        : (<tr><td>Loading</td></tr>)
    }
    </tbody>
        </table>

    <button onClick={nextJourneys}>Next</button>
    </>
    );
}

export default JourneyList;