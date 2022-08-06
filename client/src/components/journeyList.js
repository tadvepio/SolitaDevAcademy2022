import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from './loadingSpinner';
import { Container, Form, Col, Row, Table, Button, ListGroup } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

function JourneyList() {

    const [page, setPage ] = useState(1)
    const [list, setList] = useState();
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(true);
    const [stationRecommendations, setStationRecommendations] = useState();
    const [inputChange, setInputChange] = useState('');
    const [sort, setSort] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    const searchEl = useRef();
    
    const { t } = useTranslation("journeys");

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            await fetch(`${API_URL}/journeys?page=${page}&limit=20`)
            .then((res) => res.json())
            .then((data) => setList(data.results))
            setLoading(false)
        }
        fetchData()
    },[API_URL, page])

    const nextJourneys = async (change) => {
        setLoading(true)
        if((page+change) <= 0) {
            setLoading(false)
        } else {
            setPage(page+(change))
            setLoading(true)
            console.log(sort)
            const response = await fetch(`${API_URL}/journeys?page=${page+(change)}&limit=20&sort=${sort}`, {
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
        const response = await fetch(`${API_URL}/journeys?page=${page}&limit=20&sort=${sort}`, {
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
        const response = await fetch(`${API_URL}/search`, {
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
    <Container className="text-center bg-white">
    <Form ref={searchEl} onSubmit={search} className="mb-5 bg-light p-5 rounded">
    <Row className="bg-dark rounded p-4">
    <Row style={{fontSize: '35px'}} className="mb-3 text-light d-flex justify-content-center">{t("journeys")}</Row>
        {/* Departure and return station input fields */}
        <Col>
        <Form.Label className="text-light">{t("departureStation")}</Form.Label>
        <Form.Control type="text" 
                    autoComplete="off" 
                    name="Departure station name" 
                    value={form.DepartureName} 
                    placeholder={t("departureStation")}
                    onChange={(e) => handleChange(e)} />
            {stationRecommendations && inputChange ==='Departure station name' ? 
            <ListGroup style={{overFlow:"auto", maxHeight:"0vh"}}>
                {stationRecommendations.slice(0, 5).map((item, index) => 
            <ListGroup.Item action key={index} onClick={()=>handleField(item.Nimi, "Departure station name")}> {item.Nimi} </ListGroup.Item>
            )}
            </ListGroup> : 
            <></>
        }
        </Col>
        <Col>
        <Form.Label className="text-light">{t("ReturnStation")}</Form.Label>
        <Form.Control type="text" autoComplete="off" name="Return station name" value={form.ReturnName} placeholder={t("ReturnStation")} onChange={(e) => handleChange(e)}/>
        {stationRecommendations && inputChange==='Return station name' ? 
            <ListGroup style={{overFlow:"auto", maxHeight:"0vh"}}>
                {stationRecommendations.slice(0, 5).map((item, index) => 
            <ListGroup.Item action key={index} onClick={()=>handleField(item.Nimi, "Return station name")}> {item.Nimi} </ListGroup.Item>
            )}
            </ListGroup> : 
            <></>
        }
        </Col>

        {/* Sort field */}
        <Col>
                <Form.Label className="text-light">{t("Sort")}</Form.Label>
                <Form.Select name="sort" onChange={(e)=>setSort(e.target.value)} defaultValue="-">
                    <option>-</option>
                    <option value="Covered distance (m)">{t("Covered distance")}</option>
                    <option value="Duration (sec)">{t("Duration")}</option>
                </Form.Select>
        </Col>
        <Row>
        <Col className="mt-5"><Button variant="light" type="submit" className="">{t("Search")}</Button></Col>
        </Row>
        {/* Filter by distance and/or duration */}
        {/* <Row>
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
        </Row> */}
    </Row>
</Form>

    {loading ? <LoadingSpinner /> :
    <Container style={{height:"100vh"}}>
        {list.length ?
        <>
            <Row>
            <Col>
                <Button onClick={()=>nextJourneys(-1)}>{t("previous")}</Button>
            </Col>
            <Col>
                <p>Page: {page}</p>
            </Col>
            <Col>
                <Button onClick={()=>nextJourneys(1)}>{t("next")}</Button>
            </Col>
        </Row>
            <Table striped responsive="lg">
            <tbody>
            <tr>
                <th>{t("departureStation")}</th>
                <th>{t("ReturnStation")}</th>
                <th>{t('Covered distance')}</th>
                <th>{t('Duration')}</th>
            </tr>
            {list.map((item, index) => 
            <tr key={index}>
                <td>{item['Departure station name']}</td>
                <td>{item['Return station name']}</td>
                <td>{parseFloat(item['Covered distance (m)']/1000).toFixed(3).replace('.',',')} km</td>
                <td>{parseFloat(item['Duration (sec)']/60).toFixed(2).replace('.',',')} {t("minutes")}</td>
            </tr>)}
            </tbody>
            </Table>
            <Row>
            <Col>
                <Button onClick={()=>nextJourneys(-1)}>{t("previous")}</Button>
            </Col>
            <Col>
            <p>Page: {page}</p>
            </Col>
            <Col>
                <Button onClick={()=>nextJourneys(1)}>{t("next")}</Button>
            </Col>
        </Row> 
            </>
            
        : (<p>{t("noResults")}</p>)}
    </Container>

    }
    </Container>
    </>
    );
}

export default JourneyList;