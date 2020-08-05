import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
const isEqual = require('lodash/core').isEqual

export default function VisaKurs(props) {
    const [show, setShow] = useState(true)
    const [invalidKurs, setInvalidKurs] = useState(false)

    const handleClose = () => {
        setShow(false)
        props.stäng()
    }

    const sparaKurs = (event) => {
        event.preventDefault()

        const nykurs = {
            typ: event.target.elements['kurs.kod'].value,
            poäng: parseInt(event.target.elements['kurs.poäng'].value),
            betyg: event.target.elements['kurs.betyg'].value,
            merit: parseFloat(event.target.elements['kurs.merit'].value),
            status: event.target.elements['kurs.status'].value,
            kurs: event.target.elements['kurs.kurs'].value
        }

        // Om det är samma kurs - spara inte ändringar
        if (isEqual(nykurs, props.kurs)) {
            handleClose()
        }
        // Kolla så att inte en kurs med samma namn finns
        else if (!props.kurser.find(kurs => kurs.kurs === nykurs.kurs) || nykurs.kurs === props.kurs.kurs) {
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
            })
            .then(res => {
                const index = props.kurser.findIndex(kurs => kurs.kurs === props.kurs.kurs)
                // Ersätter den gamla kursen med nya data
                if (index !== -1) props.kurser[index] = nykurs
                props.uppdatera(props.kurser)
                setShow(false)
                props.stäng()
            })
        }
        else {
            // Visa feedbacken
            setInvalidKurs(true)
        }
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
                        <Form.Control 
                            required 
                            type="text" 
                            defaultValue={props.kurs.kurs}
                            isInvalid={invalidKurs}
                        />
                        <Form.Control.Feedback type="invalid">Kursen finns redan!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="kurs.kod">
                        <Form.Label>Kod</Form.Label>
                        <Form.Control required type="text" defaultValue={props.kurs.typ} />
                    </Form.Group>
                    <Form.Group controlId="kurs.poäng">
                        <Form.Label>Poäng</Form.Label>
                        <Form.Control required as="select" defaultValue={props.kurs.poäng} custom>
                            <option>50</option>
                            <option>100</option>
                            <option>150</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="kurs.betyg">
                        <Form.Label>Betyg</Form.Label>
                        <Form.Control required as="select" defaultValue={props.kurs.betyg || 'E'} custom>
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
                        <Form.Control required as="select" defaultValue={props.kurs.merit} custom>
                            <option>0</option>
                            <option>0.5</option>
                            <option>1</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="kurs.status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control required as="select" defaultValue={props.kurs.status} custom>
                            <option>pågående</option>
                            <option>kommande</option>
                            <option>avslutade</option>
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Avbryt
                </Button>
                    <Button type="submit" variant="primary">
                        Spara
                </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}
