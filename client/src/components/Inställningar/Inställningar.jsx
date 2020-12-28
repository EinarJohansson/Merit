import React, { Component } from 'react'
import './Inställningar.css';
import { Card, Accordion, Button, Form } from 'react-bootstrap'
import Betyg from '../Charts/Betyg'

export default class Utbildning extends Component {
    constructor(props) {
        super(props)

        this.state = {
            program: '',
            valProgram: '',
            inriktning: '',
            valInriktning: ''
        }

        this.program = ['Teknik', 'Samhällsvetenskap', 'Naturvetenskap', 'Ekonomi']

        this.inriktningar = {
            Teknik: ['Teknikvetenskap', 'IT-media', 'Design', 'Produktionskunskap'],
            Samhällsvetenskap: ['Samhällsvetenskap', 'Beteendevetenskap'],
            Naturvetenskap: ['Naturvetenskap', 'Tvärvetenskap'],
            Ekonomi: ['Ekonomi']
        }

        this.setProgram = this.setProgram.bind(this)
        this.setInriktning = this.setInriktning.bind(this)
        this.sparaUtbildning = this.sparaUtbildning.bind(this)
        this.Program = this.Program.bind(this)
    }

    componentDidMount() {
        this.setState({
            program: this.props.program,
            valProgram: this.props.program || this.program[0], // Sätter standard ifall inte programmet är bestämt.
            inriktning: this.props.inriktning,
            valInriktning: this.props.inriktning
        })
    }

    sparaUtbildning(event) {
        event.preventDefault()
        const program = event.target.elements['utbildning.program'].value
        const inriktning = event.target.elements['utbildning.inriktning'].value

        const data = {
            program: program,
            inriktning: inriktning
        }

        fetch('/update/utbildning', {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(data)
        }).then(res => {
            // Uppdatera profilens text
            this.setState({
                program: program,
                inriktning: inriktning
            })
        })
    }

    setProgram(event) {
        this.setState({
            valProgram: event.target.value
        })
    }

    setInriktning(event) {
        this.setState({
            valInriktning: event.target.value
        })
    }

    Program(props) {
        if (props.program === this.state.program)
            return (<option selected>{props.program}</option>)
        return (<option>{props.program}</option>)
    }

    render() {
        return (
            <div className="row">
                {/* Information om användarens utbildning */}
                <div className="col d-flex">
                    <Card>
                        <Card.Img variant="top" referrerPolicy="no-referrer" src={this.props.bild} />
                        <Card.Body>
                            <Card.Title>{this.props.namn}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{this.state.program || 'Inte bestämt'}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">{this.state.inriktning || 'Inte bestämt'}</Card.Subtitle>
                        </Card.Body>
                    </Card>
                </div>
                {/* Inställningar */}
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
                                    <Form onSubmit={this.sparaUtbildning}>
                                        {/* Program */}
                                        <Form.Group controlId="utbildning.program">
                                            <Form.Label>Program</Form.Label>
                                            <Form.Control as="select" onChange={this.setProgram}>
                                                {this.program.map((program, index) => <this.Program key={index} program={program} />)}
                                            </Form.Control>
                                        </Form.Group>
                                        {/* Inriktning */}
                                        <Form.Group controlId="utbildning.inriktning">
                                            <Form.Label>Inriktning</Form.Label>
                                            <Form.Control as="select" onChange={this.setInriktning}>
                                                {this.state.valProgram && this.inriktningar[this.state.valProgram].map((inriktning, index) => <option key={index}>{inriktning}</option>)}
                                            </Form.Control>
                                        </Form.Group>
                                        <Button variant="primary" type="submit">Spara</Button>
                                    </Form>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    Överblick
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    {/* Visa meritvärde: jämförelsevärde och meritpoäng */}
                                    <h6>Meritvärde</h6>
                                    <hr></hr>

                                    {/* Totala poäng, avslutade poäng, pågående poäng, kommande poäng */}
                                    <h6>Kurser</h6>
                                    <hr></hr>

                                    {/* Visa fördelning av betygen, stapeldiagram? */}
                                    <h6>Betyg</h6>
                                    <Betyg data={this.props.betyg}/>
                                    <hr></hr>

                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div >
        )
    }
}
