import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from './loadingSpinner';
import { Container, Form, Col, Row, Table, Button, ListGroup } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

function JourneyList() {

    const [page, setPage ] = useState(1)
    const [list, setList] = useState();
    const [form, setForm] = useState({});
    const [errMessage, setErrMessage] = useState(false)
    const [loading, setLoading] = useState(true);
    const [stationRecommendations, setStationRecommendations] = useState();
    const [inputChange, setInputChange] = useState('');
    const [sort, setSort] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    const searchEl = useRef();
    
    const { t } = useTranslation("journeys");

    /** Get all stations when opening page */
    useEffect(() => {
        setLoading(true)
        setPage(1)
        const fetchData = async () => {
            try {
            await fetch(`${API_URL}/journeys?page=${page}&limit=20`)
            .then((res) => res.json())
            .then((data) => setList(data))
            setErrMessage(false);
            setLoading(false)
        } catch (err) {
            console.log(err)
            setErrMessage(true)
            setLoading(false)
        }
        }
        fetchData()
    },[])

    /* Get pages for next and previous journey list */
    const nextJourneys = async (change) => {
        setLoading(true)
        if((page+change) <= 0) {
            setLoading(false)
        } else {
            setPage(page+(change))
            setLoading(true)
            const response = await fetch(`${API_URL}/journeys?page=${page+(change)}&limit=20&sort=${sort}`, {
                method: "POST",
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form)
            })
            const data = await response.json()
            setList(data)
            setLoading(false);
        }
    }

    /* Post form to find journeys */
    const search = async (e) => {
        e.preventDefault();
        setLoading(true)
        setPage(1)
        const response = await fetch(`${API_URL}/journeys?page=${page}&limit=20&sort=${sort}`, {
            method: "POST",
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        const data = await response.json()
        setList(data)
        setLoading(false);
    }

    /* Gets station recommendations on search based on current value on input fields */
    const handleChange = async (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
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

    /* Clicking on suggested station will set it to form */
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

    /* Checks onBlur if suggestion is selected. Set it to form or delete keyvalue pair */
    const checkSelected = (e) => {
        e.preventDefault();
        const name = e.target.name
        const value = e.target.value
        if (searchEl.current.elements[name].value === form[name]){
            const formCopy = form;
            formCopy[name] = value;
            setForm(formCopy => ({
                ...form,
                ...formCopy
            }));
            setStationRecommendations([])
        }
        else {
            searchEl.current.elements[name].value = '';
            const formCopy = form;
            delete formCopy[name];
            setForm(formCopy => ({
                ...form,
                ...formCopy
            }));
            setStationRecommendations([])
            
        }
    }

    /* Handle filter entries to form */
    const handleFilters = (e) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        const formCopy = form
        if (value === '') {
        delete formCopy[name];
        setForm(formCopy => ({
            ...form,
            ...formCopy
        })) }
        else {
            formCopy[name] = value;
            setForm(formCopy => ({
                ...form,
                ...formCopy
            }));
        }
    }

    return (
    <>
    <Container className="text-center bg-white">
    <Form ref={searchEl} onSubmit={search} className="bg-light p-5 rounded">
    <Row className="bg-dark rounded p-4">
    <Row style={{fontSize: '35px'}} className="mb-3 text-light d-flex justify-content-center">{t("journeys")}</Row>
        
        {/* Departure station input field */}

        <Col>
        <Form.Label className="text-light">{t("departureStation")}</Form.Label>
        <Form.Control type="text" 
                    autoComplete="off" 
                    name="Departure station name" 
                    value={form.DepartureName} 
                    placeholder={t("departureStation")}
                    onChange={(e) => handleChange(e)} 
                    onBlur={(e)=>checkSelected(e)}/>
            {stationRecommendations && inputChange ==='Departure station name' ? 
            <ListGroup style={{overFlow:"auto", maxHeight:"0vh"}}>
                {stationRecommendations.slice(0, 5).map((item, index) => 
            <ListGroup.Item action key={index} onMouseDown={()=>handleField(item.Nimi, "Departure station name")}> {item.Nimi} </ListGroup.Item>
            )}
            </ListGroup> : 
            <></>
        }
        </Col>
        <Col>
        
        {/* Return station input field */ }

        <Form.Label className="text-light">{t("ReturnStation")}</Form.Label>
        <Form.Control type="text" 
                    autoComplete="off" 
                    name="Return station name" 
                    value={form.ReturnName} 
                    placeholder={t("ReturnStation")} 
                    onChange={(e) => handleChange(e)}
                    onBlur={(e)=>checkSelected(e)}/>
        {stationRecommendations && inputChange==='Return station name' ? 
            <ListGroup style={{overFlow:"auto", maxHeight:"0vh"}}>
                {stationRecommendations.slice(0, 5).map((item, index) => 
            <ListGroup.Item action key={index} onMouseDown={()=>handleField(item.Nimi, "Return station name")}> {item.Nimi} </ListGroup.Item>
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
                    <option value={["Departure station name", 1]}>{t("departureStation")} (abc...)</option>
                    <option value={["Departure station name", -1]}>{t("departureStation")} (cba...)</option>
                    <option value={["Return station name", 1]}>{t("ReturnStation")} ↓</option>
                    <option value={["Return station name", -1]}>{t("ReturnStation")} ↑</option>
                    <option value={["Covered distance (m)", -1]}>{t("Covered distance")} ↓</option>
                    <option value={["Covered distance (m)", 1]}>{t("Covered distance")} ↑</option>
                    <option value={["Duration (sec)", -1]}>{t("Duration")} ↓</option>
                    <option value={["Duration (sec)", 1]}>{t("Duration")} ↑</option>
                </Form.Select>
        </Col>

        <Row variant="dark">
            {/* Filters */}
        </Row>
                        <Row className="d-flex justify-content-center text-light mt-2">{t("Covered distance")}</Row>
                        <Row>
                                <Col>
                                <Form.Label className="text-light">{t("moreThan")} (km)</Form.Label>
                                <Form.Control type="number"
                                    min="0" 
                                    autoComplete="off" 
                                    name="distMore" 
                                    value={form.distMore} 
                                    placeholder="km"
                                    onChange={(e)=>handleFilters(e)}/>
                                </Col>
                                <Col>
                                <Form.Label className="text-light">{t("lessThan")} (km)</Form.Label>
                                <Form.Control type="number"
                                    min={0}
                                    autoComplete="off" 
                                    name="distLess" 
                                    value={form.distLess} 
                                    placeholder="km"
                                    onChange={(e)=>handleFilters(e)}/>
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center text-light mt-2">{t("Duration")}</Row>
                            <Row>
                                <Col>
                                <Form.Label className="text-light">{t("moreThan")} (min)</Form.Label>
                                <Form.Control 
                                    type="number"
                                    min="0"
                                    autoComplete="off" 
                                    name="durMore" 
                                    value={form.durMore} 
                                    placeholder="min"
                                    onChange={(e)=>handleFilters(e)}/>
                                </Col>
                                <Col>
                                <Form.Label className="text-light">{t("lessThan")} (min)</Form.Label>
                                <Form.Control 
                                    type="number"
                                    min="0" 
                                    autoComplete="off" 
                                    name="durLess" 
                                    value={form.durLess} 
                                    placeholder="min"
                                    onChange={(e)=>handleFilters(e)}/>
                                </Col>
                            </Row>
                            <Col className="mt-5">
            <Button variant="light" type="submit" className="">{t("Search")}</Button>
        </Col>
    </Row>
</Form>

    {loading ? <LoadingSpinner /> :
    <Container className="bg-light" style={{height:"100%"}}>
        {list ?
        <>
            <Row className="mb-2">
                <ListGroup horizontal className="d-flex justify-content-center">
                <Col>
                {page === 1 ? <ListGroup.Item className="list-group-item border-0"> -</ListGroup.Item> :
                <ListGroup.Item action className="list-group-item border-0" onClick={()=>nextJourneys(-1)}><FaArrowLeft style={{color:"darkblue"}}/> {t("previous")}</ListGroup.Item>}
                </Col>
                <Col>
                    <ListGroup.Item className="list-group-item border-0"> Page {page} of {list.last}</ListGroup.Item>
                </Col>
                <Col>{page === parseInt(list.last) ? <></> :<ListGroup.Item action className="list-group-item border-0" onClick={()=>nextJourneys(1)}>{t("next")} <FaArrowRight style={{color:"darkblue"}}/></ListGroup.Item>}
                </Col></ListGroup>
            </Row>
            <Row className="mb-3">
        </Row>
            <Table striped responsive="lg">
            <tbody>
            <tr>
                <th>{t("departureStation")}</th>
                <th>{t("ReturnStation")}</th>
                <th>{t('Covered distance')}</th>
                <th>{t('Duration')}</th>
            </tr>
            {list.results.map((item, index) => 
            <tr key={index}>
                <td>{item['Departure station name']}</td>
                <td>{item['Return station name']}</td>
                <td>{parseFloat(item['Covered distance (m)']/1000).toFixed(3).replace('.',',')} km</td>
                <td>{parseFloat(item['Duration (sec)']/60).toFixed(2).replace('.',',')} {t("minutes")}</td>
            </tr>)}
            </tbody>
            </Table>
            <Row className="mb-2">
                <ListGroup horizontal className="d-flex justify-content-center">
                <Col>
                {page === 1 ? <ListGroup.Item className="list-group-item border-0"></ListGroup.Item> :
                <ListGroup.Item action className="list-group-item border-0" onClick={()=>nextJourneys(-1)}><FaArrowLeft style={{color:"darkblue"}}/> {t("previous")}</ListGroup.Item>}
                </Col>
                <Col>
                    <ListGroup.Item className="list-group-item border-0"> Page {page} of {list.last}</ListGroup.Item>
                </Col>
                <Col>{page === parseInt(list.last) ? <></> :<ListGroup.Item action className="list-group-item border-0" onClick={()=>nextJourneys(1)}>{t("next")} <FaArrowRight style={{color:"darkblue"}}/></ListGroup.Item>}
                </Col></ListGroup>
            </Row>
            <Row className="mb-3">
        </Row>
            </>
            
        : (<p>{t("noResults")}</p>)}
        {errMessage ? <p>Api probably starting, try again in a few seconds!</p>:null}
    </Container>

    }
    </Container>
    </>
    );
}

export default JourneyList;