import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { Container, Form, Row, Col } from 'react-bootstrap'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Link } from "react-router-dom"
import Rubrik from '../../components/Rubrik/Rubrik'

export default class Utbildningar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            termin: 'HT2020',
            urval: 'BI',
            utbildningar: [],
            terminer: [
                "HT2020",
                "HT2019",
                "HT2018",
                "HT2017",
                "HT2016",
                "HT2015",
                "HT2014",
                "HT2013",
                "HT2012",
                "HT2011",
                "HT2010",
                "VT2021",
                "VT2020",
                "VT2019",
                "VT2018",
                "VT2017",
                "VT2016",
                "VT2015",
                "VT2014",
                "VT2013",
                "VT2012",
                "VT2011",
            ]
        }

        this.kolumner = [{
            dataField: 'key',
            text: 'Key',
            hidden: true
        }, {
            dataField: 'kod',
            text: 'kod',
            hidden: true
        }, {
            dataField: 'program',
            text: 'Program',
            sort: true,
            type: 'string',
            formatter: (cell, row, rowIndex) => (
                <Link to={{
                    pathname: '/utbildningar/'+row.kod,
                    state: { program: cell}
                }}
                style={{
                    'color': '#542d69',
                    'fontWeight': 'bold'
                }}
                >
                    {cell}
                </Link>
            )
        }, {
            dataField: 'poäng',
            text: 'Poäng',
            sort: true,
            type: 'number',
            formatter: (cell, row, rowIndex) => {
                // Är float?
                if(!cell.match(/^\d+\.\d+$/)) {
                    return cell
                }
                let diff = this.props.meritvärde - cell
                if (diff >= 0) return <p style={{color: 'green'}}>{cell}</p>
                else if (diff < 0 && diff > -1) return <p style={{color: 'orange'}}>{cell}</p>
                else return <p style={{color: 'red'}}>{cell}</p> 
            }
        },
        {
            dataField: 'lärosäte',
            text: 'Lärosäte',
            sort: true   
        }]

        this.defaultSorted = [{
            dataField: 'program',
            order: 'asc'
        }]

        this.options = {
            custom: false,
            totalSize: this.state.totUtbildningar,
            sizePerPage: 10,
            showTotal: true,
            hideSizePerPage: true
        }

        this.Bord = this.Bord.bind(this)
        this.setTermin = this.setTermin.bind(this)
        this.setUrval = this.setUrval.bind(this)
        this.hämtaUtbildningar = this.hämtaUtbildningar.bind(this)
    }
    
    setTermin(event) {
        this.setState({
            termin: event.target.value
        })

        this.hämtaUtbildningar(event.target.value, this.state.urval)
    }

    setUrval(event) {
        this.setState({
            urval: event.target.value
        })

        this.hämtaUtbildningar(this.state.termin, event.target.value)
    }

    hämtaUtbildningar(termin, urval) {
        urval = urval == "BI" ? "1": "2"

        // Hämta utbildningar från server
        let url = '/data/utbildningar'
                + '?urval='     + urval 
                + '&termin='    + termin

        fetch(url, {
            method: 'GET',
            credentials: 'include',
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
            // Formatera datat
            let formaterad = res[0].program.map((program, index) => (
                {
                    program: program[2],
                    kod: program[3],
                    lärosäte: program[4],
                    poäng: program[6],
                    key: index
                }
            ))

            this.setState({
                utbildningar: formaterad
            })
        })
    }

    componentDidMount() {
        this.hämtaUtbildningar(this.state.termin, this.state.urval)
    }

    Bord() {
        const { SearchBar } = Search
        const pagination = paginationFactory(this.options)

        return (
            <div>
                <ToolkitProvider
                    bootstrap4
                    keyField='key'
                    data={this.state.utbildningar}
                    columns={this.kolumner}
                    search
                >
                    {props => (
                        <div>
                            <Row>
                                <Col>
                                    <SearchBar {...props.searchProps} />
                                </Col>
                                <Col>
                                    <Form.Control as="select" defaultValue={this.state.termin} onChange={this.setTermin}>
                                        {this.state.terminer.map((termin, index) => (
                                            <option key={index}>{termin}</option>
                                        ))}
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control as="select" defaultValue={this.state.urval} onChange={this.setUrval}>
                                            <option key="0">BI</option>
                                            <option key="1">BII</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                            <BootstrapTable
                                defaultSorted={this.defaultSorted}
                                pagination={pagination}
                                {...props.baseProps}
                            />
                        </div>
                    )}
                </ToolkitProvider>
            </div>
        )
    }

    render() {
        return(
            <Container>
                <Rubrik
                    page={"Utbildningar"}
                />
                <h6>Ditt meritvärde: {this.props.meritvärde}</h6>
                <this.Bord />
            </Container>
        )
    }
}