import React, { Component } from 'react'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'

export default class Table extends Component {
    state = {
        kurser: [
            {
                id: 4,
                name: 'Einar',
                price: 5
            },
            {
                id: 2,
                name: 'Ali-g',
                price: 3
            },
        ]
    }

    kolumner = [
        {
            dataField: 'id',
            text: 'Product ID',
            sort: true
        },
        {
            dataField: 'name',
            text: 'Product Name',
            sort: true
        },
        {
            dataField: 'price',
            text: 'Product Price',
            sort: true
    
        }
    ]

    render() {
            return (
                <BootstrapTable
                    bootstrap4
                    keyField='id'
                    data={this.state.kurser}
                    columns={this.kolumner}
                />
            )
    }
}