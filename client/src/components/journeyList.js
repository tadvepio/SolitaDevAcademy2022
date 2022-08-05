import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from './loadingSpinner';
import { Container, Form, Col, Row, Table, Button, ListGroup } from "react-bootstrap";

function JourneyList() {

    const [page, setPage ] = useState(1)
    const [list, setList] = useState();
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(true);
    const [stationRecommendations, setStationRecommendations] = useState();
    const [inputChange, setInputChange] = useState('')
    const [sort, setSort] = useState('')

    const searchEl = useRef();
    
    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            await fetch(`http://localhost:9000/journeys?page=${page}&limit=20`)
            .then((res) => res.json())
            .then((data) => setList(data.results))
            setLoading(false)
        }
        fetchData()
    },[])

    const nextJourneys = async (change) => {
        setLoading(true)
        if((page+change) <= 0) {
            setLoading(false)
        } else {
            setPage(page+(change))
            setLoading(true)
            console.log(sort)
            const response = await fetch(`http://localhost:9000/journeys?page=${page+(change)}&limit=20&sort=${sort}`, {
                method: "POST",
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form)
            })
            const data = await response.json()
            setList(data.results)
            setLoading(false);
        }
    }

    const search = async (e) => {
        e.preventDefault();
        setLoading(true)
        setPage(1)
        console.log(sort)
        const response = await fetch(`http://localhost:9000/journeys?page=${page}&limit=20&sort=${sort}`, {
            method: "POST",
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        const data = await response.json()
        setList(data.results)
        setLoading(false);
    }

    const handleChange = async (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        const formCopy = form;
        formCopy[name] = value;
        setForm(formCopy => ({
            ...form,
            ...formCopy
        }));
        setInputChange(name)
        if (value.length >= 2)
        {
        const response = await fetch(`http://localhost:9000/search`, {
            method: "POST",
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({value})
        })
        const data = await response.json()
        setStationRecommendations(data)
        } else {
            setStationRecommendations([])
        }
    }

    const handleField = (v,n) => {
        searchEl.current.elements[n].value = v;
        const formCopy = form;
        formCopy[n] = v;
        setForm(formCopy => ({
            ...form,
            ...formCopy
        }));
        setStationRecommendations([])
    }

    return (
    <>
    <Container className="text-center">
    <h1>Journey list</h1>
 
    <Form ref={searchEl} onSubmit={search}>
    <Row>

        {/* Departure and return station input fields */}
        <Col>
        <Form.Label>Departure station</Form.Label>
        <Form.Control type="text" 
                    autoComplete="off" 
                    name="Departure station name" 
                    value={form.DepartureName} 
                    placeholder="Departure station"
                    onChange={(e) => handleChange(e)} />
            {stationRecommendations && inputChange ==='Departure station name' ? 
            <ListGroup>
                {stationRecommendations.map((item, index) => 
            <ListGroup.Item key={index} onClick={()=>handleField(item.Nimi, "Departure station name")}> {item.Nimi} </ListGroup.Item>
            )}
            </ListGroup> : 
            <></>
        }
        </Col>
        <Col>
        <Form.Label>Return station</Form.Label>
        <Form.Control type="text" autoComplete="off" name="Return station name" value={form.ReturnName} placeholder="Return station" onChange={(e) => handleChange(e)}/>
        {stationRecommendations && inputChange==='Return station name' ? 
            <ListGroup>
                {stationRecommendations.map((item, index) => 
            <ListGroup.Item key={index} onClick={()=>handleField(item.Nimi, "Return station name")}> {item.Nimi} </ListGroup.Item>
            )}
            </ListGroup> : 
            <></>
        }
        </Col>

        {/* Sort field */}
        <Col>
                <Form.Label>Sort by</Form.Label>
                <Form.Select name="sort" onChange={(e)=>setSort(e.target.value)} defaultValue="-">
                    <option>-</option>
                    <option value="Covered distance (m)">Distance</option>
                    <option value="Duration (sec)">Duration</option>
                </Form.Select>
        </Col>

        {/* Filter by distance and/or duration */}
        <Row>
            <h2>Filters</h2>
        </Row>
        <Row>
            <Col>
                <Form.Label>Distance</Form.Label>
                <Form.Select name="Covered distance (m)" onChange={(e)=>handleChange(e)}>
                    <option value="1000">0-1 km</option>
                    <option value="5000">1-5 km</option>
                    <option value="10000">5-10 km</option>
                    <option value="20000">10-20 km</option>
                    <option value="">more than 20 km</option>
                </Form.Select>
            </Col>
            <Col>
                <Form.Label>Duration</Form.Label>
                <Form.Select name="Duration (sec)" onChange={(e)=>handleChange(e)}>
                    <option value="60">0-1 min</option>
                    <option value="600">1-10 min</option>
                    <option value="1800">10-30 min</option>
                    <option value="3600">30-60 min</option>
                    <option value="">60 and more</option>
                </Form.Select>
            </Col>
            <Col>
        <Button type="submit">Search</Button>
        </Col>
        </Row>
    </Row>
</Form>

    {loading ? <LoadingSpinner /> :
    <Container>
        {list.length ?
        <>
            <Row>
            <Col>
                <Button onClick={()=>nextJourneys(-1)}>Previous</Button>
            </Col>
            <Col>
                <p>Page: {page}</p>
            </Col>
            <Col>
                <Button onClick={()=>nextJourneys(1)}>Next</Button>
            </Col>
        </Row>
            <Table>
            <tbody>
            <tr>
                <th>Departure station</th>
                <th>Return station</th>
                <th>{'Covered distance'}</th>
                <th>{'Duration'}</th>
            </tr>
            {list.map((item, index) => 
            <tr key={index}>
                <td>{item['Departure station name']}</td>
                <td>{item['Return station name']}</td>
                <td>{parseFloat(item['Covered distance (m)']/1000).toFixed(3)} km</td>
                <td>{parseFloat(item['Duration (sec)']/60).toFixed(2)} minutes</td>
            </tr>)}
            </tbody>
            </Table>
            <Row>
            <Col>
                <Button onClick={()=>nextJourneys(-1)}>Previous</Button>
            </Col>
            <Col>
            <p>Page: {page}</p>
            </Col>
            <Col>
                <Button onClick={()=>nextJourneys(1)}>Next</Button>
            </Col>
        </Row> 
            </>
            
        : (<p>No results</p>)}
    </Container>

    }
    </Container>
    </>
    );
}

export default JourneyList;