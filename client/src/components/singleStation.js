import React, {  useState } from 'react';
import LoadingSpinner from './loadingSpinner';
import { Card, Button, Collapse, Col, ListGroup, Row } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/leaflet.css'

function SingleStation(item) {

    const [openCard, setOpenCard] = useState(false);
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    const getDetails = async (stationId) => {
        if (openCard) { setOpenCard(!openCard) }
        else {
            setLoading(true);
            setOpenCard(!openCard)
            const response = await fetch(`http://localhost:9000/details?station=${stationId}`)
            const data = await response.json()
            setDetails(data)
            setLoading(false);
            console.log(item.x)           
        }
    }

    return(
        <>
        <Card className="text-center">
            <Card.Body>

            <Button variant="light" className="mb-4" onClick={() => getDetails(item.ID)}>{item.Name}</Button>
            <Collapse in={openCard}>
            {openCard ?
                loading ?
                <>
                <LoadingSpinner />
                </> :
                <>
                <Row>
                <Col>
                <ListGroup>
                    <ListGroup.Item as="li">ID: {details.stationId}</ListGroup.Item>
                    <ListGroup.Item as="li">Number of journeys starting here: {details.numOfDep}</ListGroup.Item>
                    <ListGroup.Item as="li">Number of journeys ending here: {details.numOfRet}</ListGroup.Item>
                    <ListGroup.Item as="li">Average Distance when departed: {parseFloat(details.AvgDepDistance/1000).toFixed(2)} km</ListGroup.Item>
                    <ListGroup.Item as="li">Average distance when returned: {parseFloat(details.AvgRetDistance/1000).toFixed(2)} km</ListGroup.Item>
                </ListGroup>
                </Col>
                <Col>
                    <ListGroup>
                        {details.mostPopularDeparture.map((item, i) =>
                            <ListGroup.Item key={i}>Name: {item[0]} Departure: {item[1]}</ListGroup.Item>
                            )
                        }
                    </ListGroup>
                </Col>
                <Col>
                    <ListGroup>
                        {details.mostPopularReturn.map((item, i) =>
                            <ListGroup.Item key={i}>Name: {item[0]} Departure: {item[1]}</ListGroup.Item>
                            )
                        }
                    </ListGroup>
                </Col>
                </Row>
                <Row className="px-3 mt-2" style={{display: 'flex', justifyContent: "center"}}>
                <MapContainer center={[item.y, item.x]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[item.y, item.x]}>
                        <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
                </Row>
                </>
                : <></>
            }
            </Collapse>
            </Card.Body>
        </Card>
        </>
    )
}

export default SingleStation;