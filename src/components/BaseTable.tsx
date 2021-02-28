import React from 'react'
import { Table } from 'antd'
import { TableProps } from 'antd/es/table'
import classnames from 'classnames'
import { TABLE_PAGINATION } from 'src/config/constants'

export type BaseTableProps = TableProps<any>

const BaseTable = ({
  className,
  pagination,
  ...tableProps
}: BaseTableProps) => (
  <Table
    {...{
      pagination: pagination ? { ...TABLE_PAGINATION, ...pagination } : false,
      className: classnames('base-table', className),
      rowKey: 'id',
      ...tableProps,
    }}
  />
)

export default BaseTable
