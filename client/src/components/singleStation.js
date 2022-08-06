import React, {  useState } from 'react';
import LoadingSpinner from './loadingSpinner';
import { Card, Button, Collapse, Col, ListGroup, Row, Table } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/leaflet.css';
import { useTranslation } from 'react-i18next';

function SingleStation(item) {

    const [openCard, setOpenCard] = useState(false);
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation("stations");

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
                <h3>{t("detailsHead")}</h3>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>
                            {t("details.start")}
                            </th>
                            <th>{t("details.end")}</th>
                            <th>{t("details.avgdistDep")}</th>
                            <th>{t("details.avgdistRet")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{details.numOfDep}</td>
                            <td>{details.numOfRet}</td>
                            <td>{parseFloat(details.AvgDepDistance/1000).toFixed(2)} km</td>
                            <td>{parseFloat(details.AvgRetDistance/1000).toFixed(2)} km</td>
                        </tr>
                    </tbody>
                </Table>
                </Col>
                <Col>
                <h3>{t("top5ending")}</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>{t("name")}</th>
                            <th>{t("departures")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.mostPopularDeparture.map((item, i) =>
                            <tr key={i}>
                                <td>{item[0]}</td>
                                <td>{item[1]}</td>
                            </tr>
                            )
                        }
                    </tbody>
                </Table>
                </Col>
                <Col>
                <h3>{t("top5start")}</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>{t("name")}</th>
                            <th>{t("returns")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.mostPopularReturn.map((item, i) =>
                            <tr key={i}>
                                <td>{item[0]}</td>
                                <td>{item[1]}</td>
                            </tr>
                            )
                        }
                    </tbody>
                </Table>
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