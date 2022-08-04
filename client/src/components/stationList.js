import React, { useEffect, useState } from 'react';
import { Table } from "react-bootstrap";
import SingleStation from './singelStation';

function StationList() {

    const [page, setPage ] = useState(1)
    const [list, setList] = useState([]);
    
    useEffect(() => {
        fetch(`http://localhost:9000/stations?page=${page}&limit=20`)
        .then((res) => res.json())
        .then((data) => setList(data.results))
    },[page])

    const nextStations = (change) => {
        if((page+change) <= 0) {
            
        } else {
            setPage(page+(change))
        }
    }

    return (
    <>
    <h1>Station list</h1>
    
        <Table>
        <tbody>
        {list ? list.map((item, index) =>
            <SingleStation {...item}/>
            )
            :  
            ( <tr><td>Loading</td></tr> )
        }
        </tbody>
        </Table>

    <button onClick={()=>nextStations(-1)}>Previous</button>
    <p>Page: {page}</p>
    <button onClick={()=>nextStations(1)}>Next</button>
    </>
    );
}

export default StationList;