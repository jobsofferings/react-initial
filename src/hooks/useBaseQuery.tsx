import { QueryHookOptions, useQuery } from '@apollo/react-hooks'
import { DocumentNode } from 'graphql'
import { QUERY_OPTIONS, getQueryResult } from 'src/config/components'

export interface BaseQueryProps extends Omit<QueryHookOptions, 'query'> {
  query: DocumentNode
}

const useBaseQuery = ({ query, ...queryOptions }: BaseQueryProps) => {
  const { data, ...result } = useQuery(query, {
    ...QUERY_OPTIONS,
    ...queryOptions,
  })

  return { ...result, data: getQueryResult(data) }
}

export default useBaseQuery
