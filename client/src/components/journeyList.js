import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card, Button, Collapse, Table } from "react-bootstrap";

function JourneyList() {

    const [page, setPage ] = useState(1)
    const [list, setList] = useState();
    
    useEffect(() => {
        fetch(`http://localhost:9000/journeys?page=${page}&limit=20`)
        .then((res) => res.json())
        .then((data) => setList(data.results))
    },[page])

    const nextJourneys = (change) => {
        if((page+change) <= 0) {
            
        } else {
            setPage(page+(change))
        }
    }

    return (
    <>
    <Container className="text-center">
    <h1>Journey list</h1>
        <Table>
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
        </Table>

    <button onClick={()=>nextJourneys(-1)}>Previous</button>
    <p>Page: {page}</p>
    <button onClick={()=>nextJourneys(1)}>Next</button>
    </Container>
    </>
    );
}

export default JourneyList;