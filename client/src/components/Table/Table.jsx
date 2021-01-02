import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator'
import VisaKurs from '../VisaKurs/VisaKurs'
import { Carousel } from 'react-bootstrap'
import {isMobile, BrowserView, MobileView} from 'react-device-detect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
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

        this.kolumner = [
            {
                dataField: 'kurs',
                text: 'Kurs',
                sort: true,
                footerAlign: 'center',
                footer: () => <FontAwesomeIcon icon={faPlusCircle} size="2x" className="text-primary"/>,
                footerAttrs: {colSpan: 4},
                footerEvents: {
                    onClick: (e, column, columnIndex) => {
                        this.setState({
                            visa: true,
                            kurs: {}
                        })
                    }
                },
                formatter: (cell, row) => {
                    return parseFloat(row.merit) > 0 ? cell + '🌟': cell
                }
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
                sort: true
            },
            {
                dataField: 'betyg',
                text: 'Betyg',
                sort: true
            }
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

        this.defaultSorted = [{
            dataField: 'kurs',
            order: 'asc'
        }];

        this.VisaTable = this.VisaTable.bind(this)
        this.stängKurs = this.stängKurs.bind(this)
        this.uppdateraTable = this.uppdateraTable.bind(this)
    }

    VisaTable(props) {
        const Caption = () => <h3>{props.status}</h3>

        const options = {
            custom: true,
            totalSize: this.props.kurser.filter(kurs => kurs.status === props.status.toLowerCase()).length,
            sizePerPage: isMobile ? 5 : 7,
            withFirstAndLast: false
        }
      
        return (
            <PaginationProvider pagination={ paginationFactory(options) } >
                {({ paginationProps, paginationTableProps}) => (
                    <div>
                        <PaginationListStandalone { ...paginationProps } />
                        <Caption />
                        <BootstrapTable
                            bootstrap4
                            bordered={false}
                            keyField='kurs'
                            data={props.kurser}
                            columns={isMobile ? this.kolumner.filter(kolumn => kolumn.dataField !== 'typ' ) : this.kolumner}
                            wrapperClasses="table-responsive"
                            rowEvents={this.visaKurs}
                            hover
                            noDataIndication="Lägg till en kurs!"
                            defaultSorted={this.defaultSorted} 
                            defaultSortDirection="asc"
                            { ...paginationTableProps }
                        />
                    </div>
                )}
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