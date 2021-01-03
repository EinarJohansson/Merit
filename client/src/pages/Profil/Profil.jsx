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
        this.formateraBetyg = this.formateraBetyg.bind(this)
    }

    componentWillMount() {
        const data = Object.entries(this.props.kurser).map(e => {            
            e[1].kurs = e[0]
            return e[1]
        })

        // Hämta betyg
        let formateradeBetyg = this.formateraBetyg(this.props.kurser)
        
        this.setState({
            kurser: data,
            betyg: formateradeBetyg,
            program: this.props.program,
            inriktning: this.props.inriktning
        })
    }

    formateraBetyg(kurser) {
        Object.filter = (obj, predicate) => 
        Object.keys(obj)
              .filter(key => predicate(obj[key]) )
              .reduce((res, key) => (res[key] = obj[key], res), {} )
        
        let pågående = Object.filter(kurser, kurs => kurs.status === 'pågående')
        let kommande = Object.filter(kurser, kurs => kurs.status === 'kommande')
        let avslutade = Object.filter(kurser, kurs => kurs.status === 'avslutade')
        
        // Array med alla betyg
        let betygPågående = Object.keys(pågående).map(kurs => pågående[kurs].betyg)
        let betygKommande = Object.keys(kommande).map(kurs => kommande[kurs].betyg)
        let betygAvslutade = Object.keys(avslutade).map(kurs => avslutade[kurs].betyg)
        
        // Funktion för att hitta antal gånger ett element finns i arrayen
        let occurances = (arr, val) => arr.filter(x => x === val).length
        
        // Arrays för att lagra formaterade betygen
        let dataPågende = []
        let dataKommande = []
        let dataAvslutad = []

        // Formatera datan så den kan passas till grafen
        new Set(betygPågående).forEach(val => dataPågende.push({x: val, y: occurances(betygPågående, val)}))
        new Set(betygKommande).forEach(val => dataKommande.push({x: val, y: occurances(betygKommande, val)}))
        new Set(betygAvslutade).forEach(val => dataAvslutad.push({x: val, y: occurances(betygAvslutade, val)}))
        
        // Tom array för att lagra objekten
        return ([dataPågende, dataKommande, dataAvslutad])
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
            // Formatera kurserna
            const data = Object.entries(kurser).map(e => {            
                e[1].kurs = e[0]
                return e[1]
            })
                 
            let formateradeBetyg = this.formateraBetyg(kurser)

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
                    kurser={this.state.kurser}
                />
                <Table
                    kurser={this.state.kurser}
                    uppdatera={this.uppdateraKurser}
                />
            </Container>
        )
    }
}