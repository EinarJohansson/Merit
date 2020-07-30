import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

export default function VisaKurs(props) {
    const [show, setShow] = useState(true)

    const handleClose = () => {
        setShow(false)
        props.stäng()
    }

    const sparaKurs = (event) => {
        event.preventDefault()

        const nykurs = {
            kurs: event.target.elements['kurs.kurs'].value,
            typ: event.target.elements['kurs.kod'].value,
            poäng: parseInt(event.target.elements['kurs.poäng'].value),
            betyg: event.target.elements['kurs.betyg'].value,
            merit: parseFloat(event.target.elements['kurs.merit'].value),
            status: event.target.elements['kurs.status'].value
        }

        const data = {
            nykurs: nykurs,
            ogkurs: props.kurs
        }

        fetch('/update/kurs', {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(data)
        }).then(res => {
            setShow(false)
            props.stäng()
        })
    }


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ändra kursen: {props.kurs.kurs}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={sparaKurs}>
                <Modal.Body>
                    <Form.Group controlId="kurs.kurs">
                        <Form.Label>Kurs</Form.Label>
                        <Form.Control type="text" defaultValue={props.kurs.kurs} />
                    </Form.Group>
                    <Form.Group controlId="kurs.kod">
                        <Form.Label>Kod</Form.Label>
                        <Form.Control type="text" defaultValue={props.kurs.typ} />
                    </Form.Group>
                    <Form.Group controlId="kurs.poäng">
                        <Form.Label>Poäng</Form.Label>
                        <Form.Control as="select" defaultValue={props.kurs.poäng} custom>
                            <option>50</option>
                            <option>100</option>
                            <option>150</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="kurs.betyg">
                        <Form.Label>Betyg</Form.Label>
                        <Form.Control as="select" defaultValue={props.kurs.betyg || 'E'} custom>
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                            <option>D</option>
                            <option>E</option>
                            <option>F</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="kurs.merit">
                        <Form.Label>Meritpoäng</Form.Label>
                        <Form.Control as="select" defaultValue={props.kurs.merit} custom>
                            <option>0</option>
                            <option>0.5</option>
                            <option>1</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="kurs.status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control as="select" defaultValue={props.kurs.status} custom>
                            <option>pågående</option>
                            <option>kommande</option>
                            <option>avslutade</option>
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                </Button>
                    <Button type="submit" variant="primary">
                        Save Changes
                </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}
