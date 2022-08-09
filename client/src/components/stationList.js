import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import LoadingSpinner from './loadingSpinner';
import SingleStation from './singleStation';
import { useTranslation } from 'react-i18next';

function StationList() {

    const [page, setPage ] = useState(1)
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    const { t } = useTranslation("stations");
    
    useEffect(() => {
            fetch(`${API_URL}/stations?page=${page}&limit=1000&sort=Name`)
            .then((res) => res.json())
            .then((data) => setList(data.results))
            .catch(err => console.log(err))

    },[page, API_URL])

    const handleChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        const value = e.target.value
        try {
            const response = await fetch(`${API_URL}/search`, {
                method: "POST",
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({value})
            })
            const data = await response.json()
            setList(data)
        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }

    return (
    <>
    <Container className="text-center bg-white">
    <Row className="bg-light rounded p-4">
    <Form className="mb-5 bg-dark p-5 rounded">
    <Row style={{fontSize: '35px'}} className="mb-3 text-light d-flex justify-content-center">{t("header")}</Row>
        <Row>
            <Col>
            <Form.Label className="text-light">{t("filter")}</Form.Label>
            <Form.Control className="text-center" type="text" placeholder={t("stationName")} onChange={(e)=>handleChange(e)}/>
            </Col>
        </Row>
    </Form>
    </Row>
    </Container>

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
        </>
    }
    </>
    );
}

export default StationList;