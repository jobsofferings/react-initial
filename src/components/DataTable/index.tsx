import React, { useEffect, useMemo, useState } from 'react'
import { QueryHookOptions } from '@apollo/react-hooks'
import { DocumentNode } from 'graphql'
import { TableProps } from 'antd/es/table'
import { PaginationProps } from 'antd/lib/pagination'
import { get } from 'lodash'
import useBaseLazyQuery from 'src/hooks/useBaseLazyQuery'
import BaseTable from '../BaseTable'
import { PAGE_LIMIT } from 'src/config/constants'

export interface DataTableProps
  extends TableProps<any>,
    Omit<QueryHookOptions, 'query'> {
  query: DocumentNode
  createPath?: (record: OPUtils.Record<string, any>) => string
  getResult?: (nodes: any[], total: number) => void
  queryOptions?: Omit<QueryHookOptions, 'variables'>
  variables?: OPUtils.Record<string, any>
  refetchSignal?: any
  needPagination?: boolean
  localPagination?: boolean
  isReqParam?: boolean
  dataKey?: string | string[]
  totalKey?: string | string[]
}

export const defaultResult = {
  totalCount: 0,
  nodes: [],
  pageinfo: { current: 1 },
}

export const defaultParams = {
  offset: 0,
  limit: PAGE_LIMIT,
}

const DataTable: React.FunctionComponent<DataTableProps> = ({
  query,
  getResult,
  createPath,
  queryOptions,
  className,
  variables,
  refetchSignal,
  localPagination,
  dataSource,
  isReqParam = true,
  needPagination = true,
  dataKey = 'nodes',
  totalKey = 'totalCount',
  ...tableProps
}) => {
  const params: OPUtils.Maybe<OPUtils.Record> = needPagination
    ? { ...defaultParams, ...variables }
    : variables

  const [current, setCurrent] = useState<number>(1)

  const [fetchData, { refetch, loading, data }] = useBaseLazyQuery({
    query,
    variables: isReqParam ? { req: params } : params,
    ...queryOptions,
  })

  const tableData = useMemo(() => dataSource || get(data, dataKey) || [], [
    data,
    dataSource,
    dataKey,
  ])
  const total = get(data, totalKey) || tableData.length

  useEffect(() => {
    if (variables) {
      fetchData()
      setCurrent(1)
    }
  }, [variables, fetchData])

  useEffect(() => {
    refetch && refetch()
  }, [refetchSignal, refetch])

  useEffect(() => {
    getResult && tableData && getResult(tableData, total)
  }, [total, tableData, getResult])

  const handlePageChange: PaginationProps['onChange'] = (page, pageSize) => {
    const refetchParams = {
      ...params,
      offset: (page - 1) * pageSize!,
    }
    refetch(isReqParam ? { req: refetchParams } : refetchParams)
    setCurrent(page)
  }

  const handleLocalPageChange: PaginationProps['onChange'] = (page) =>
    setCurrent(page)

  return (
    <BaseTable
      {...{
        loading,
        dataSource: tableData,
        onRow: createPath
          ? (record) => ({
              onClick: () => window.open(createPath(record)),
            })
          : undefined,
        pagination: needPagination
          ? {
              current: current,
              total: total,
              onChange: localPagination
                ? handleLocalPageChange
                : handlePageChange,
            }
          : false,
        ...tableProps,
      }}
    />
  )
}

export default DataTable
