import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator'
import VisaKurs from '../VisaKurs/VisaKurs'
import { Alert, Button, Carousel } from 'react-bootstrap'
import {isMobile, BrowserView, MobileView} from 'react-device-detect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
import './Table.css'

export default class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visa: false,
            kurs: {}
        }

        this.nykurs = () => {
            this.setState({
                visa: true,
                kurs: {}
            })
        }

        this.kolumner = [
            {
                dataField: 'kurs',
                text: 'Kurs',
                headerStyle: { 'backgroundColor': 'white' },
                sort: true,
                footerAlign: 'left',
                footer: () => <Button onClick={this.nykurs}>Lägg till kurs!</Button>,
                footerAttrs: {colSpan: 5},
                formatter: (cell, row) => {
                    return parseFloat(row.merit) > 0 ? cell + '🌟': cell
                },
                style: { width: "40%" }
            },
            {
                dataField: 'poäng',
                text: 'Poäng',
                headerStyle: { 'backgroundColor': 'white' },
                sort: true,
                sortFunc: (a, b, order) => {
                    if (order === 'asc') {
                        return b - a;
                    }
                    return a - b; // desc
                },
                style: { width: "20%" } 
            },
            {
                dataField: 'typ',
                text: 'Kod',
                headerStyle: { 'backgroundColor': 'white' },
                sort: true,
                style: { width: "20%" }
            },
            {
                dataField: 'betyg',
                text: 'Betyg',
                headerStyle: { 'backgroundColor': 'white' },
                sort: true,
                style: { width: "10%" }
            },
            {
                dataField: 'redigera',
                text: 'Redigera',
                headerStyle: { 'backgroundColor': 'white' },
                isDummyField: true,
                formatter: (cell, row, rowIndex) => <FontAwesomeIcon icon={faEdit}/>,
                events: {
                    onClick: (e, column, columnIndex, row, rowIndex) => {
                        this.setState({
                            visa: true,
                            kurs: row
                        })  
                    },
                },                 
                style: {'cursor': 'pointer', width: "10%"},
                align: 'center',
                headerAlign: 'center'
            }
        ]
        
        if (isMobile)
            this.rowEvents = {
                onClick: (e, row, rowIndex) => {
                    this.setState({
                        visa: true,
                        kurs: row
                    })
                }                  
            }

        this.defaultSorted = [{
            dataField: 'kurs',
            order: 'asc'
        }];

        this.VisaTable = this.VisaTable.bind(this)
        this.stängKurs = this.stängKurs.bind(this)
        this.uppdateraTable = this.uppdateraTable.bind(this)
    }

    VisaTable(props) {
        const options = {
            custom: true,
            totalSize: this.props.kurser.filter(kurs => kurs.status === props.status.toLowerCase()).length,
            sizePerPage: isMobile ? 5 : 7
        }

        const Caption = () => <h3>{props.status} kurser ({options.totalSize})</h3>
      
        return (
            <PaginationProvider pagination={ paginationFactory(options) } >
                {({ paginationProps, paginationTableProps}) => {
                    const pageVisade = paginationProps.page * paginationProps.sizePerPage                    
                    const visar = pageVisade > paginationProps.totalSize ? paginationProps.totalSize : pageVisade

                    return (
                        <div>
                            <Caption />
                            <hr/>
                            <Alert variant="light" style={{backgroundColor: '#EDDDF6', border: 'none'}}>
                                <p style={{margin: '0px'}}><span role="img" aria-label="Kurs som ger meritpoäng">🌟</span> = Kursen ger meritpoäng!</p>
                            </Alert>                            
                            <span>Visar {visar} av {paginationProps.dataSize}</span>
                            <PaginationListStandalone { ...paginationProps } />
                            <BootstrapTable
                                bootstrap4
                                bordered={false}
                                keyField='kurs'
                                data={props.kurser}
                                columns={isMobile ? this.kolumner.filter(kolumn => kolumn.dataField !== 'typ' && kolumn.dataField !== 'redigera' ) : this.kolumner}
                                wrapperClasses="table-responsive"
                                hover
                                rowEvents={this.rowEvents}
                                noDataIndication={`Inga ${props.status.toLowerCase()} kurser`}
                                defaultSorted={this.defaultSorted} 
                                defaultSortDirection="asc"
                                { ...paginationTableProps }
                            />
                        </div>
                    )
                }}
            </PaginationProvider>
        )
    }

    stängKurs() {
        this.setState({
            visa: false,
            kurs: {}
        })
    }

    uppdateraTable(kurser) {
        console.log('Yo uppdaterar den nu i table');
        this.props.uppdatera(kurser)
    } 
    
    render() {
        return (
            <>
                <MobileView>
                    <Carousel interval={null} controls={false}>
                        <Carousel.Item>
                            <this.VisaTable
                                status="Pågående"
                                kurser={this.props.kurser.filter(kurs => kurs.status === 'pågående')}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <this.VisaTable
                                status="Kommande"
                                kurser={this.props.kurser.filter(kurs => kurs.status === 'kommande')}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <this.VisaTable
                                status="Avslutade"
                                kurser={this.props.kurser.filter(kurs => kurs.status === 'avslutade')}
                            />
                        </Carousel.Item>
                    </Carousel>
                </MobileView>
                <BrowserView>
                    <this.VisaTable
                        status="Pågående"
                        kurser={this.props.kurser.filter(kurs => kurs.status === 'pågående')}
                    />
                    <this.VisaTable
                        status="Kommande"
                        kurser={this.props.kurser.filter(kurs => kurs.status === 'kommande')}
                    />
                    <this.VisaTable
                        status="Avslutade"
                        kurser={this.props.kurser.filter(kurs => kurs.status === 'avslutade')}
                    />
                </BrowserView>
                {this.state.visa &&
                    <VisaKurs
                        stäng={this.stängKurs}
                        kurs={this.state.kurs}
                        uppdatera={this.uppdateraTable}
                        kurser={this.props.kurser}
                    />
                }
            </>
        )
    }
}