import React, { Component } from 'react'
import './Utbildning.css';
import { Card, Accordion, Button, Form } from 'react-bootstrap'

export default class Utbildning extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inriktning: '',
            program: ''
        }

        this.visaInriktning = this.visaInriktning.bind(this);
    }


    componentDidMount() {
        this.setState({
            program: this.props.program,
            inriktning: this.props.inriktning
        })
    }

    visaInriktning(event) {
        this.setState({
            program: event.target.value
        })
    }

    render() {
        return (
            <div className="row">
                {/*Information om användarens utbildning*/}
                <div className="col d-flex">
                    <Card>
                        <Card.Img variant="top" src={this.props.bild} />
                        <Card.Body>
                            <Card.Title>{this.props.namn}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{this.state.program}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">{this.state.inriktning}</Card.Subtitle>
                        </Card.Body>
                    </Card>
                </div>
                {/* Inställningar*/}
                <div className="col">
                    <Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    Din utbildning
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Form>
                                        <Form.Group controlId="utbildning.program">
                                            <Form.Label>Program</Form.Label>
                                            <Form.Control as="select" onChange={this.visaInriktning}>
                                                <option>Samhällvetenskap</option>
                                                <option>Naturvetenskap</option>
                                                <option>Ekonomi</option>
                                                <option>Teknik</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
            </div>

            </div >
        )
    }
}
