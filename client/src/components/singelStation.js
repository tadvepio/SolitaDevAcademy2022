import React, {  useState } from 'react';
import { Card, Button, Collapse, Table } from "react-bootstrap";

function SingleStation(item) {

    const [openCard, setOpenCard] = useState(false);
    const [details, setDetails] = useState([])

    const getDetails = async (stationId) => {
        if (openCard) { setOpenCard(!openCard) }
        else {
            const response = await fetch(`http://localhost:9000/details?station=${stationId}`)
            const data = await response.json()
            setDetails(data)
            setOpenCard(!openCard)            
        }
    }

    return(
        <>
        <Card className="text-center">
            <Card.Body>

            <Button variant="light" onClick={() => getDetails(item.ID)}><td>{item.Name}</td></Button>
            <Collapse in={openCard}>
            {openCard ? 
                <Table>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Number of journeys starting here</th>
                        <th>Number of journeys ending here</th>
                        <th>Average Distance when departed</th>
                        <th>Average distance when returned</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{details.stationId}</td>
                        <td>{details.numOfDep}</td>
                        <td>{details.numOfRet}</td>
                        <td>{parseFloat(details.AvgDepDistance/1000).toFixed(2)} km</td>
                        <td>{parseFloat(details.AvgRetDistance/1000).toFixed(2)} km</td>
                    </tr>
                    <thead>
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                        </tr>
                    </thead>
                    <tr>{details.mostPopularDeparture.map((item, i) =>
                    <td key={i}>Name: {item[0]} Departure: {item[1]}</td>
                    
                    )}</tr>
                    <tr>{details.mostPopularReturn.map((item, i) =>
                    <td key={i}>Name: {item[0]} Return: {item[1]}</td>
                    
                    )}</tr>
                    </tbody>
                </Table> : <></>
}
            </Collapse>
            </Card.Body>
        </Card>
        </>
    )
}

export default SingleStation;