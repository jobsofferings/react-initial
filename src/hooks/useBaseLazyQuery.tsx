import { QueryHookOptions, useLazyQuery, QueryTuple } from '@apollo/react-hooks'
import { DocumentNode } from 'graphql'
import { LAZY_QUERY_OPTIONS, getQueryResult } from 'src/config/components'
import { OperationVariables } from 'apollo-client'

export interface BaseLazyQueryProps extends Omit<QueryHookOptions, 'query'> {
  query: DocumentNode
}

type BaseLazyQueryResult<TData, TVariables> = QueryTuple<TData, TVariables>

function useBaseLazyQuery<TData = any, TVariables = OperationVariables>({
  query,
  ...queryOptions
}: BaseLazyQueryProps): BaseLazyQueryResult<TData, TVariables> {
  const [fetch, { data, ...result }] = useLazyQuery(query, {
    ...LAZY_QUERY_OPTIONS,
    ...queryOptions,
  })

  return [
    fetch,
    { ...result, data: getQueryResult(data) },
  ] as BaseLazyQueryResult<TData, TVariables>
}

export default useBaseLazyQuery
