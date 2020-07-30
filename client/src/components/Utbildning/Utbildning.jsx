import React, { Component } from 'react'
import './Utbildning.css';
import { Card, Accordion, Button, Form } from 'react-bootstrap'

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
            valProgram: this.props.program,
            inriktning: this.props.inriktning,
            valInriktning: this.props.inriktning
        })
    }

    sparaUtbildning(event) {
        event.preventDefault()        
        const program = event.target.elements['utbildning.program'].value
        const inriktning = event.target.elements['utbildning.inriktning'].value

        const data = {
            program: program,
            inriktning: inriktning
        }

        fetch('/update/utbildning',{
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

    setInriktning(event) {
        this.setState({
            valInriktning: event.target.value
        })
    }

    Program(props) {
        if (props.program === this.state.program)
            return (<option selected>{props.program}</option>)
        else
            return (<option>{props.program}</option>)
    }

    render() {
        return (
            <div className="row">
                {/* Information om användarens utbildning */}
                <div className="col d-flex">
                    <Card>
                        <Card.Img variant="top" referrerPolicy="no-referrer" src={this.props.bild } />
                        <Card.Body>
                            <Card.Title>{this.props.namn}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{this.state.program}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">{this.state.inriktning}</Card.Subtitle>
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
                                                {this.program.map((program, index) => <this.Program key={index} program={program} />)
                                            }
                                            </Form.Control>
                                        </Form.Group>
                                        {/* Inriktning */}
                                        <Form.Group controlId="utbildning.inriktning">
                                            <Form.Label>Inriktning</Form.Label>
                                            <Form.Control as="select" onChange={this.setInriktning}>
                                                {this.state.program && this.inriktningar[this.state.valProgram].map((inriktning, index) => <option key={index}>{inriktning}</option>)}
                                            </Form.Control>
                                        </Form.Group>
                                        <Button variant="primary" type="submit">Spara ändringar</Button>
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
