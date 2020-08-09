import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import VisaKurs from '../VisaKurs/VisaKurs'
import { Carousel } from 'react-bootstrap'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import './Table.css'

export default class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            kurser: [],
            visa: false,
            kurs: {}
        }

        this.kolumner = [
            {
                dataField: 'kurs',
                text: 'Kurs',
                sort: true
            },
            {
                dataField: 'poäng',
                text: 'Poäng',
                sort: true,
                sortFunc: (a, b, order) => {
                    if (order === 'asc') {
                        return b - a;
                    }
                    return a - b; // desc
                }
            },
            {
                dataField: 'typ',
                text: 'Kod',
                sort: false
            },
            {
                dataField: 'betyg',
                text: 'Betyg',
                sort: true
            },
        ]

        this.visaKurs = {
            onClick: (e, row, rowIndex) => {
                // Sätt modalens state till att visa.
                this.setState({
                    visa: true,
                    kurs: row
                })
            }
        }
        this.VisaTable = this.VisaTable.bind(this)
        this.stängKurs = this.stängKurs.bind(this)
        this.uppdateraTable = this.uppdateraTable.bind(this);
    }

    VisaTable(props) {
        return (
            <>
                <h3>{props.status}</h3>
                <BootstrapTable
                    bootstrap4
                    bordered={false}
                    keyField='kurs'
                    data={props.kurser}
                    columns={this.kolumner}
                    wrapperClasses="table-responsive"
                    rowEvents={this.visaKurs}
                    hover
                    noDataIndication="Lägg till dina kurser!"
                />
            </>
        )
    }

    stängKurs() {
        this.setState({
            visa: false,
            kurs: {}
        })
    }

    uppdateraTable(kurser) {
        this.setState({
            kurser: kurser
        })
    }

    componentDidMount() {
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
            const data = Object.entries(kurser).map((e) => {
                e[1].kurs = e[0]
                return e[1]
            })

            this.setState({
                kurser: data
            })
        })
    }
    render() {
        return (
            <>
                <Carousel controls={true} interval={null}>
                    <Carousel.Item>
                        <this.VisaTable
                            status="Pågående"
                            kurser={this.state.kurser.filter(kurs => kurs.status === 'pågående')}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <this.VisaTable
                            status="Kommande"
                            kurser={this.state.kurser.filter(kurs => kurs.status === 'kommande')}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <this.VisaTable
                            status="Avslutade"
                            kurser={this.state.kurser.filter(kurs => kurs.status === 'avslutade')}
                        />
                    </Carousel.Item>
                </Carousel>
                {this.state.visa &&
                    <VisaKurs
                        stäng={this.stängKurs}
                        kurs={this.state.kurs}
                        uppdatera={this.uppdateraTable}
                        kurser={this.state.kurser}
                    />
                }
            </>
        )
    }
}