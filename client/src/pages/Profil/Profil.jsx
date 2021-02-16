import React from 'react'
import Table from '../../components/Table/Table'
import Inställningar from '../../components/Inställningar/Inställningar'
import { Container } from 'react-bootstrap'
import Rubrik from '../../components/Rubrik/Rubrik'

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
        // Hämta kurserna från db
        this.uppdateraKurser()
        
        // Uppdatera utbildning
        fetch("/auth/login/success", {
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
            .then(responseJson => {
                console.log(responseJson.user);
                this.uppdateraUtbildning(responseJson.user.program, responseJson.user.inriktning)
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
        console.log('Yo uppdaterar den nu i Profil');
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
            console.log(formateradeBetyg);

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
        console.log('Tja ska rendera Profilsidan');
        if (Object.keys(this.state.kurser).length !== 0 &&
            this.state.program.length !== 0 &&
            this.state.inriktning.length !== 0
        ) {
            return (
                <Container>
                    <Rubrik 
                        page={'Profil'}
                    />
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
        return null
    }
}