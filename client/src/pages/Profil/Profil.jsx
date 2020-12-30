import React from 'react'
import Table from '../../components/Table/Table'
import Inställningar from '../../components/Inställningar/Inställningar'
import { Container } from 'react-bootstrap'

export default class Profil extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            program: '',
            inriktning: '',
            betyg: [],
            kurser: {}
        }

        this.uppdateraKurser = this.uppdateraKurser.bind(this)
        this.uppdateraUtbildning = this.uppdateraUtbildning.bind(this)
    }

    componentWillMount() {
        const data = Object.entries(this.props.kurser).map((e) => {            
            e[1].kurs = e[0]
            return e[1]
        })
        
        // Array med alla betyg
        let betyg = Object.keys(this.props.kurser).map(kurs => this.props.kurser[kurs].betyg)
        // Funktion för att hitta antal gånger ett element finns i arrayen
        let occurances = (arr, val) => arr.filter(x => x === val).length
        // Tom array för att lagra objekten
        let formateradeBetyg = []
        // Formatera datan så den kan passas till grafen
        new Set(betyg).forEach(val => formateradeBetyg.push({x: val, y: occurances(betyg, val)}))

        this.setState({
            kurser: data,
            betyg: formateradeBetyg,
            program: this.props.program,
            inriktning: this.props.inriktning
        })
    }

    uppdateraKurser() {
        fetch('/data/kurser', {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
        .then(response => {
            if (response.status === 200) return response.json()
            throw new Error("failed to authenticate user")
        })
        .then(res => {
            const kurser = res[0].kurser
            console.log(kurser);
            // Formatera kurserna
            const data = Object.entries(kurser).map((e) => {            
                e[1].kurs = e[0]
                return e[1]
            })
            
            // Array med alla betyg
            let betyg = Object.keys(kurser).map(kurs => kurser[kurs].betyg)
            // Funktion för att hitta antal gånger ett element finns i arrayen
            let occurances = (arr, val) => arr.filter(x => x === val).length
            // Tom array för att lagra objekten
            let formateradeBetyg = []
            // Formatera datan så den kan passas till grafen
            new Set(betyg).forEach(val => formateradeBetyg.push({x: val, y: occurances(betyg, val)}))

            this.setState({
                kurser: data,
                betyg: formateradeBetyg
            })
        })
    }

    uppdateraUtbildning(program, inriktning) {
        this.setState({
            program: program,
            inriktning: inriktning
        })
    }

    render() {
        return (
            <Container>
                <Inställningar
                    namn={this.props.namn}
                    program={this.state.program}
                    inriktning={this.state.inriktning}
                    bild={this.props.bild}
                    betyg={this.state.betyg}
                    uppdatera={this.uppdateraUtbildning}
                />
                <Table
                    kurser={this.state.kurser}
                    uppdatera={this.uppdateraKurser}
                />
            </Container>
        )
    }
}