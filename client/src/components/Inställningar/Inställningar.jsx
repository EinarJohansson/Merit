import React, { Component } from 'react'
import './Inställningar.css';
import { Card, Accordion, Button, Form, useAccordionToggle } from 'react-bootstrap'
import Betyg from '../Charts/Betyg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import AccordionContext from "react-bootstrap/AccordionContext"

const math_ = require('lodash/fp/math')

export default class Utbildning extends Component {
    constructor(props) {
        super(props)

        this.state = {
            program: '',
            inriktning: '',
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
        this.CustomToggle = this.CustomToggle.bind(this)
    }

    componentDidMount() {
        this.setState({
            program: this.props.program,
            inriktning: this.props.inriktning,
            valProgram: this.props.program || this.program[0], // Sätter standard ifall inte programmet är bestämt.
            valInriktning: this.props.inriktning
        })
    }

    CustomToggle({ children, eventKey, callback }) {
        const currentEventKey = React.useContext(AccordionContext);

        const isCurrentEventKey = currentEventKey === eventKey;

        const decoratedOnClick = useAccordionToggle(
            eventKey,
            () => callback && callback(eventKey)
        )
        let icon = isCurrentEventKey ? faAngleDown : faAngleRight

        return (
            <Card.Header onClick={decoratedOnClick}>
                    <div className="d-flex">    
                        <p
                            style={{ 'color': '#212529', 'marginBottom': '0px', 'fontWeight': 'bold'}}
                            className="mr-auto"
                        >
                            {children}
                        </p>
                        <FontAwesomeIcon icon={icon} className="ml-auto"/>
                    </div>
            </Card.Header>
        )
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

        const data = {
            merit: {
                poäng: meritPoäng,
                kurser: meritKurser
            },
            jämföreseltal: jämföreseltal,
            meritvärde: jämföreseltal + meritPoäng
        }
        // Lagra i databasen
        fetch('/update/merit', {
            method: 'POST',
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(data)
        })

        return (
            <div className="row" style={{'marginBottom': '100px'}}>
                {/* Information om användarens utbildning */}
                <div className="col-lg-4 align-items-stretch">
                    <Card style={{borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}}>
                        <Card.Img variant="top" referrerPolicy="no-referrer" src={this.props.bild} />
                        <Card.Body style={{'borderBottom': '8px solid #542d69'}}>
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
                            <this.CustomToggle eventKey="0">Din utbildning</this.CustomToggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Form onSubmit={this.sparaUtbildning}>
                                        {/* Program */}
                                        <Form.Group controlId="utbildning.program">
                                            <Form.Label>Program</Form.Label>
                                            <Form.Control as="select" defaultValue={this.props.program} onChange={this.setProgram}>
                                                {this.program.map((program, index) => <option key={index}>{program}</option>)}
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
                            <this.CustomToggle eventKey="1">Meritvärde</this.CustomToggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    {/* Visa meritvärde: jämförelsevärde, meritpoäng och vilka kurser som ger meritpoäng */}
                                    <b>Jämförelsetal</b>
                                    <p>{jämföreseltal}</p>
                                    <b>Meritpoäng</b>
                                    <p>{meritPoäng} {meritKurser.length > 0 && <sub>({meritKurser.map((tag, i) => [
                                        i > 0 && ", ",
                                        tag
                                    ])})</sub>}</p>
                                    <hr/>
                                    <b>Meritvärde</b>
                                    <p>{jämföreseltal + meritPoäng}</p>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <this.CustomToggle eventKey="2">Kurser</this.CustomToggle>
                            <Accordion.Collapse eventKey="2">
                                <Card.Body>
                                    {/* Totala poäng, avslutade poäng, pågående poäng, kommande poäng */}
                                    <b>Pågående poäng</b>
                                    <p>{poängPåg} <sub>({pågåendeKurser} kurser)</sub></p>
                                    <b>Kommande poäng</b>
                                    <p>{poängKom} <sub>({kommandeKurser} kurser)</sub></p>
                                    <b>Avslutade poäng</b>
                                    <p>{poängAvs} <sub>({avslutadeKurser} kurser)</sub></p>
                                    <hr/>
                                    <b>Totala poäng</b>
                                    <p>{poängTot} <sub>({totalaKurser} kurser)</sub></p>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <this.CustomToggle eventKey="3">Betyg</this.CustomToggle>
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
            </div>
        )
    }
}
