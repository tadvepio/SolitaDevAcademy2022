import React, { useState, useRef, useMemo } from 'react';
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import LoadingSpinner from './loadingSpinner';

function AddStation() {

    const [form, setForm] = useState({
        'FID': '',
        'ID': '',
        'Nimi':"",
        'Namn':" ",
        'Name':"",
        'Osoite':"",
        'Adress':"",
        'Kaupunki':"",
        'Stad':"",
        'Operaattor':" ",
        'Kapasiteet':'',
        'x': '',
        'y': '',
    });

    const { t } = useTranslation("addnew");

    const API_URL = process.env.REACT_APP_API_URL;
    const [loading, setLoading] = useState(false);
    const formRef = useRef();

    const center = {
        lat: 60.170,
        lng: 24.939
      }
    const [position, setPosition] = useState(center)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(() => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                setPosition(marker.getLatLng())
                }
            }
            ,
        }),[])

    const search = async (e) => {
        e.preventDefault();
        let lat = parseFloat(JSON.stringify(position.lat)).toFixed(6);
        let lng = parseFloat(JSON.stringify(position.lng)).toFixed(6);
        const results = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        const data = await results.json();
        const formCopy = form;
        console.log(data.address.city)
        if (data.address.city === "Espoo") {
            formCopy.Operaattor = "CityBike Finland";
            formCopy.Stad = "Esbo";
        } else {
            formCopy.Stad = "Helsingfors";
        };        
        formCopy.Nimi = data.address.road;
        formCopy.Name = data.address.road;
        if (data.address.house_number){
            formCopy.Osoite = `${data.address.road} ${data.address.house_number}`;
            formCopy.Adress = `${data.address.road} ${data.address.house_number}`;
        } else {
            formCopy.Osoite = data.address.road;
            formCopy.Adress = data.address.road;
        }
        formCopy.Kaupunki = data.address.city;
        formCopy.x = lat;
        formCopy.y = lng;
        setForm(formCopy => ({
            ...form,
            ...formCopy
        }));
        console.log(data)
    }

    const handleChange = (e) => {
        e.preventDefault();
        let name = e.target.name
        let value = e.target.value
        const formCopy = form
        formCopy[name] = value;
        setForm(formCopy => ({
            ...form,
            ...formCopy
        }));
        console.log(form)
    }

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const response = await fetch(`${API_URL}/addNew/station`, {
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
            <Container className="bg-light" style={{height:"100vh"}}>
                <Form onSubmit={(e)=>submit(e)} ref={formRef} className="bg-light p-5 rounded">
                <Row style={{fontSize: '35px'}} className="bg-dark rounded p-4 text-light text-center">
                    {t("addStation")}
                </Row>
                    <Row className="mt-3">
                        <Col>
                    <Form.Label>Nimi</Form.Label>
                    <Form.Control value={form.Nimi} type="text" name="Nimi" onChange={(e)=>handleChange(e)}></Form.Control>
                    </Col>
                    <Col>
                    <Form.Label>Namn</Form.Label>
                    <Form.Control value={form.Namn} type="text" name="Namn" onChange={(e)=>handleChange(e)}></Form.Control>
                    </Col>
                    <Col>
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={form.Name} type="text" name="Name" onChange={(e)=>handleChange(e)}></Form.Control>
                    </Col>
                    <Row>
                    <Col>
                    <Form.Label>{t("addressFi")}</Form.Label>
                    <Form.Control value={form.Osoite} type="text" name="Osoite" onChange={(e)=>handleChange(e)}></Form.Control>
                    </Col>
                    <Col>
                    <Form.Label>{t("addressSwe")}</Form.Label>
                    <Form.Control value={form.Osoite} type="text" name="Adress" onChange={(e)=>handleChange(e)}></Form.Control>
                    </Col>
                    <Col>
                    <Form.Label>{t("city")}</Form.Label>
                    <Form.Control value={form.Kaupunki} type="text" name="Kaupunki" onChange={(e)=>handleChange(e)}></Form.Control>
                    </Col>
                    </Row>
                    </Row>
                    <Row>
                        <Col>
                    <Form.Label>{t("capacity")}</Form.Label>
                    <Form.Control value={form.Kapasiteet} type="text" name="Kapasiteet" onChange={(e)=>handleChange(e)}></Form.Control>
                    </Col><Col>
                        <Form.Label>{t("lat")}</Form.Label>
                        <Form.Control value={form.x} type="text" name="x" onChange={(e)=>handleChange(e)}></Form.Control>
                        </Col>
                        <Col>
                    <Form.Label>{t("lng")}</Form.Label>
                    <Form.Control value={form.y} type="text" name="y" onChange={(e)=>handleChange(e)}></Form.Control>
                    </Col>
                    </Row>
                    {loading ? <LoadingSpinner /> :
                    <Button className="mt-5" type="submit">{t("submit")}</Button>
                    }
                </Form>
            <p>{t("guide")}</p>
            <Row className="px-3 mt-2" style={{display: 'flex', justifyContent: "center"}}>
            <MapContainer center={center} zoom={14} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='<a href="https://www.openstreetmap.org/copyright">'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} draggable={true} eventHandlers={eventHandlers} ref={markerRef}>
                    </Marker>
                </MapContainer>
                <Button className="mb-5" onClick={(e)=>search(e)}>{t("search")}</Button>
            </Row>
            </Container>
        </>
    )  
}

export default AddStation;