import React, {  useState } from 'react';
import { Card, Button, Collapse, Table } from "react-bootstrap";

function SingleStation(item) {

    const [openCard, setOpenCard] = useState(false);
    return(
        <>
        <Card className="text-center">
            <Card.Body>

            <Button variant="light" onClick={()=>setOpenCard(!openCard)}><td>{item.Name}</td></Button>
            <Collapse in={openCard}>
                <Table>
                    <thead>
                        <th>Name</th>
                        <th>Address</th>
                    </thead>
                    <tr>
                        <td>{item.Name}</td>
                        <td>{item.Osoite}</td>
                    </tr>
                </Table>
            </Collapse>
            </Card.Body>
        </Card>
        </>
    )
}

export default SingleStation;