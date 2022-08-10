import React, { useState, useRef } from 'react';
import { Form, Row, Col, Button, ListGroup, Container } from "react-bootstrap";
import LoadingSpinner from './loadingSpinner';
import { useTranslation } from 'react-i18next';

function AddJourney() {

    const { t } = useTranslation("addnew");

    const API_URL = process.env.REACT_APP_API_URL;
    const [form, setForm] = useState(
        {
            'Departure': '',
            'Return': '',
            'Departure station name':'',
            'Departure station id': '',
            'Return station name':'', 'Return station id': '',
            'Covered distance (m)': '',
            'Duration (sec)': ''
        });
    const [stationRecommendations, setStationRecommendations] = useState();
    const searchEl = useRef();
    const [inputChange, setInputChange] = useState('');
    const [loading, setLoading] = useState(false)
    
    const handleField = (v,n) => {
        
        searchEl.current.elements[n].value = v;
        let obj = stationRecommendations.find(o => o.Nimi === v)
        const formCopy = form;
        formCopy[n] = v;
        console.log("n"+n)
        n === "Departure station name" ? formCopy["Departure station id"] = obj.ID : formCopy['Return station id'] = obj.ID;
        setForm(formCopy => ({
            ...form,
            ...formCopy
        }));
        console.log(form)
        setStationRecommendations([])
    }

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
        console.log(stationRecommendations)
    }

    const handleDistance = (e) => {
        e.preventDefault();
        let value = e.target.value;
        let name = e.target.name;
        const formCopy = form;
        formCopy[name] = value;
        setForm(formCopy => ({
            ...form,
            ...formCopy
        }));
        console.log(form)
    }

    const handleDateTime = (e) => {
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.value;

        const formCopy = form;

        formCopy[name] = value;
        setForm(formCopy => ({
            ...form,
            ...formCopy
        }));
        if (form.Departure && form.Return){
            let dep = new Date(form.Departure);
            let ret = new Date(form.Return);
            let duration = ret.getTime()-dep.getTime()
            formCopy['Duration (sec)'] = duration/1000
            setForm(formCopy => ({
                ...form,
                ...formCopy
            }));
        }
        console.log(form)
    }

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const response = await fetch(`${API_URL}/addNew/journey`, {
            method: "POST",
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        const data = await response.json()
        if (data === "Success") {
            alert(t("msgSucc"))
        } else {
            alert(t("msgFail"))
        }
        setLoading(false)
        window.location.reload();
    }

    return(
        <>
        <Container style={{height:"100vh"}}>
            <Form onSubmit={(e)=>submit(e)} ref={searchEl} className="bg-light p-5 rounded">
    <Row className="bg-dark rounded p-4">
        <Row style={{fontSize: '35px'}} className="mb-3 text-light d-flex justify-content-center">
            {t("addJourney")}
        </Row>
        <Row>
            <Col>
                <Form.Label className="text-light">
                    {t("depDate")}
                </Form.Label>
                <Form.Control autoComplete="off" type="datetime-local" max={form.Return} required={true} name='Departure' onChange={(e) => handleDateTime(e)}/>
            </Col>
            <Col>
                <Form.Label className="text-light">{t("retDate")}</Form.Label>
                <Form.Control autoComplete="off" type="datetime-local" min={form.Departure} required={true} name='Return' onChange={(e) => handleDateTime(e)}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label className="text-light">{t("depStat")}</Form.Label>
                <Form.Control 
                value={form.DepartureName}
                autoComplete="off"
                name="Departure station name" 
                type="text"
                required={true} 
                onChange={(e) => handleChange(e)}/>
                {stationRecommendations && inputChange ==='Departure station name' ? 
                    <ListGroup style={{overFlow:"auto", maxHeight:"0vh"}}>
                        {stationRecommendations.slice(0, 5).map((item, index) => 
                    <ListGroup.Item action value={form['Departure station id']} key={index} onMouseDown={()=>handleField(item.Nimi, "Departure station name")}> {item.Nimi} </ListGroup.Item>
                    )}
                    </ListGroup> : 
                    <></>
                }
            </Col>
            <Col>
                <Form.Label className="text-light">{t("retStation")}</Form.Label>
                <Form.Control 
                value={form.ReturnName}
                autoComplete="off" 
                name="Return station name" 
                type="text" 
                onChange={(e) => handleChange(e)}
                required={true} />
                {stationRecommendations && inputChange ==='Return station name' ? 
                    <ListGroup style={{overFlow:"auto", maxHeight:"0vh"}}>
                        {stationRecommendations.slice(0, 5).map((item, index) => 
                    <ListGroup.Item action key={index} onMouseDown={()=>handleField(item.Nimi, "Return station name")}> {item.Nimi} </ListGroup.Item>
                    )}
                    </ListGroup> : 
                    <></>
                }
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label className="text-light">{t("distance")}</Form.Label>
                <Form.Control autoComplete="off" name="Covered distance (m)" type="number" required={true} onChange={(e)=> handleDistance(e)}/>
            </Col>
            <Col className="mt-5">
                {loading? <LoadingSpinner /> :
                <Button variant="light" type="submit" className="">{t("submit")}</Button>
                }
            </Col>
        </Row>
    </Row>
</Form>
</Container>
        </>
    )
}

export default AddJourney;