import React, { Component } from 'react'
import './Inställningar.css';
import { Card, Accordion, Button, Form } from 'react-bootstrap'
import Betyg from '../Charts/Betyg'

var math_ = require('lodash/fp/math')

export default class Utbildning extends Component {
    constructor(props) {
        super(props)

        this.state = {
            valProgram: '',
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
            this.props.uppdatera(program, inriktning)
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
        if (props.program === this.props.program)
            return (<option selected>{props.program}</option>)
        return (<option>{props.program}</option>)
    }

    räknaPoäng() {
        let poängTot = math_.sum(this.props.kurser.map(kurs => kurs.poäng))
        
        let pågående = Object.filter(this.props.kurser, kurs => kurs.status === 'pågående')
        let poängPåg = math_.sum(Object.keys(pågående).map(kurs => pågående[kurs].poäng))
        
        let kommande = Object.filter(this.props.kurser, kurs => kurs.status === 'kommande')
        let poängKom = math_.sum(Object.keys(kommande).map(kurs => kommande[kurs].poäng))
        
        let avslutade = Object.filter(this.props.kurser, kurs => kurs.status === 'avslutade')
        let poängAvs = math_.sum(Object.keys(avslutade).map(kurs => avslutade[kurs].poäng))

        return [poängTot, poängPåg, poängKom, poängAvs]
    }

    räknaKurser() {
        let pågående = Object.filter(this.props.kurser, kurs => kurs.status === 'pågående')
        let kommande = Object.filter(this.props.kurser, kurs => kurs.status === 'kommande')
        let avslutade = Object.filter(this.props.kurser, kurs => kurs.status === 'avslutade')

        return [Object.keys(this.props.kurser).length,
                Object.keys(pågående).length,
                Object.keys(kommande).length,
                Object.keys(avslutade).length
            ]
    }

    jämföreseltal (totalPoäng) {
        const siffervärden = {
            'A': 20,
            'B': 17.5,
            'C': 15,
            'D': 12.5,
            'E': 10,
            'F': 0
        }
        const betygsvärde = math_.sum(this.props.kurser.map(kurs => kurs.poäng * siffervärden[kurs.betyg]))
        
        return Math.round( (betygsvärde / totalPoäng) * 1e2 ) / 1e2
    }

    meritPoäng() {
        const meritKurser = this.props.kurser.filter(kurs => kurs.merit !== 0)
        let meritPoäng = math_.sum(meritKurser.map(kurs => kurs.merit))
        if (meritPoäng > 2.5) meritPoäng = 2.5
        
        return [meritKurser.map(kurs => kurs.kurs), Math.round( meritPoäng * 1e2 ) / 1e2]
    }

    render() {
        Object.filter = (obj, predicate) => 
        Object.keys(obj)
              .filter( key => predicate(obj[key]) )
              .reduce( (res, key) => (res[key] = obj[key], res), {} )

        const [poängTot, poängPåg, poängKom, poängAvs] = this.räknaPoäng()
        const [totalaKurser, pågåendeKurser, kommandeKurser, avslutadeKurser] = this.räknaKurser()
        const jämföreseltal = this.jämföreseltal(poängTot)
        const [meritKurser, meritPoäng] = this.meritPoäng()

        return (
            <div className="row">
                {/* Information om användarens utbildning */}
                <div className="col d-flex">
                    <Card>
                        <Card.Img variant="top" referrerPolicy="no-referrer" src={this.props.bild} />
                        <Card.Body>
                            <Card.Title>{this.props.namn}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{this.props.program || 'Inte bestämt'}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">{this.props.inriktning || 'Inte bestämt'}</Card.Subtitle>
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
                                    Meritvärde
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    {/* Visa meritvärde: jämförelsevärde, meritpoäng och vilka kurser som ger meritpoäng */}
                                    <p>Jämförelsetal: {jämföreseltal}</p>
                                    <p>Meritpoäng: {meritPoäng} {meritKurser.length > 0 && <sub>({meritKurser.map((tag, i) => [
                                        i > 0 && ", ",
                                        tag
                                    ])})</sub>}</p>
                                    <hr/>
                                    <p>Meritvärde: {jämföreseltal + meritPoäng} </p>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                    Kurser
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                                <Card.Body>
                                    {/* Totala poäng, avslutade poäng, pågående poäng, kommande poäng */}
                                    <p>Pågående poäng: {poängPåg} <sub>({pågåendeKurser} kurser)</sub></p>
                                    <p>Kommande poäng: {poängKom} <sub>({kommandeKurser} kurser)</sub></p>
                                    <p>Avslutade poäng: {poängAvs} <sub>({avslutadeKurser} kurser)</sub></p>
                                    <hr/>
                                    <p>Totala poäng: {poängTot} <sub>({totalaKurser} kurser)</sub></p>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                    Betyg
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                                <Card.Body>
                                    {/* Visa fördelning av betygen */}
                                    <Betyg data={this.props.betyg}/>
                                    <br/>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div >
        )
    }
}
