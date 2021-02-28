import { QueryHookOptions } from '@apollo/react-hooks'
import { QueryResult } from 'react-apollo'
import { isPlainObject } from 'lodash'

export const QUERY_OPTIONS: QueryHookOptions = {
  fetchPolicy: 'network-only',
  notifyOnNetworkStatusChange: true,
  onError() {},
}

export const LAZY_QUERY_OPTIONS: QueryHookOptions = QUERY_OPTIONS

export const getQueryResult = <T = OPUtils.Record>(
  obj: QueryResult['data'],
  defaultValue: T = {} as OPUtils.Record,
): T => {
  if (isPlainObject(obj)) {
    return (Object.values(obj)[0] ?? defaultValue) as T
  }
  return defaultValue
}
