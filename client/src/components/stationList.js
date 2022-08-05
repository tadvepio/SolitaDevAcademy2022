import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from "react-bootstrap";
import LoadingSpinner from './loadingSpinner';
import SingleStation from './singleStation';

function StationList() {

    const [page, setPage ] = useState(1)
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetch(`http://localhost:9000/stations?page=${page}&limit=20&sort=Name`)
        .then((res) => res.json())
        .then((data) => setList(data.results))
    },[])

    const nextStations = (change) => {
        if((page+change) <= 0) {
            
        } else {
            setPage(page+(change))
            fetch(`http://localhost:9000/stations?page=${page+change}&limit=20&sort=Name`)
            .then((res)=>res.json())
            .then((data) => setList(data.results))
        }
    }

    const handleChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        const value = e.target.value
        const response = await fetch(`http://localhost:9000/search`, {
            method: "POST",
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({value})
        })
        const data = await response.json()
        setList(data)
        console.log(list[0])
        setLoading(false);
    }

    return (
    <>
    <h1>Station list</h1>
    <Form className="mb-5">
        <Row>
            <Col>
            <Form.Label>Filter station name</Form.Label>
            <Form.Control type="text" placeholder="Station name" onChange={(e)=>handleChange(e)}/>
            </Col>
        </Row>
    </Form>

    {loading ? <LoadingSpinner /> :
    <>
        {list ? list.map((item, index) =>
            <div key={index}>
                <SingleStation {...item} />
            </div>
            )
            :  
            ( <div>Loading</div> )
        }

        <Row>
            <Col>
            <Button onClick={()=>nextStations(-1)}>Previous</Button>
            </Col>
            <Col>
            <p>Page: {page}</p>
            </Col>
            <Col><Button onClick={()=>nextStations(1)}>Next</Button></Col>
        </Row>
        </>
    }
    </>
    );
}

export default StationList;