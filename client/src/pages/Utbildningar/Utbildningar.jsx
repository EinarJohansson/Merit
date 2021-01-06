import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { Container } from 'react-bootstrap'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

export default class Utbildningar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            termin: 'VT2019',
            urval: '1',
            utbildningar: []
        }

        this.kolumner = [{
            dataField: 'key',
            text: 'Key',
            sort: true,
            hidden: true
        }, {
            dataField: 'program',
            text: 'Program',
            sort: true
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
    }
    
    componentDidMount() {
        // Hämta utbildningar från server
        let url = '/data/utbildningar'
                + '?urval='     + this.state.urval 
                + '&termin='    + this.state.termin

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

            /*
            TEST
            */

           fetch('/data/program?kod=LU-80101', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
                }
            })
            .then(p => {
                if (p.status === 200) return p.json()
            })
            .then(q => {
                console.log('OMG KLARA');
                console.log(q)
            })

            // Formatera datat
            let formaterad = res[0].program.map((program, index) => (
                    {
                        program: program[2],
                        lärosäte: program[4],
                        poäng: program[6],
                        key: index
                    }))
            
            this.setState({
                utbildningar: formaterad
            })
        })
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
                    {
                        props => (
                            <div>
                                <SearchBar {...props.searchProps} />
                                <BootstrapTable
                                    defaultSorted={this.defaultSorted}
                                    pagination={pagination}
                                    {...props.baseProps}
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
            </div>
        )
    }

    render() {
        return(
            <Container>
                <h1>Utbildningar</h1>
                <h6>Ditt meritvärde: {this.props.meritvärde}</h6>
                <this.Bord />
            </Container>
        )
    }
}