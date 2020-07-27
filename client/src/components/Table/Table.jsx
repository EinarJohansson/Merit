import React from 'react'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'

const products = [
    {
        id: "1",
        name: "Einar",
        price: "3",
    },
    {
        id: "2",
        name: "test",
        price: "1"
    },
]
const columns = [
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

export default () =>
    <BootstrapTable
        bootstrap4
        keyField='id'
        data={products}
        columns={columns}
    />
