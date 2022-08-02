import React, { useEffect, useState } from 'react';

function StationList() {

    const [page, setPage ] = useState(1)
    const [list, setList] = useState([]);
    
    useEffect(() => {
    console.log(page)
    fetch(`http://localhost:9000/stations?page=${page}&limit=20`)
    .then((res) => res.json())
    .then((data) => setList(data.results))
    },[page])

    const nextStations = () => {
    setPage(page+1)
    }

    return (
    <>
    <h1>Station list</h1>
    <p>Page: {page}</p>
        <table>
        <tbody>
        <tr>
            <th>Name</th>
        </tr>
        {list ? list.map((item, index) => 
        <tr key={index}>
            <td>{item.Name}</td>
        </tr>
        )
        : (<tr><td>Loading</td></tr>)
    }
    </tbody>
        </table>

    <button onClick={nextStations}>Next</button>
    </>
    );
}

export default StationList;