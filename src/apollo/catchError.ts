import { ApolloLink, Observable } from 'apollo-link'
import { ApolloError } from 'apollo-client'
import { isPlainObject } from 'lodash'
import { getQueryResult } from '../config/components'
import notifyMsg, { getApolloErrorMsg } from './ErrorHandler'

export function catchError(): ApolloLink {
  return new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      let sub: any
      try {
        sub = forward(operation).subscribe({
          next: (result) => {
            let msg = ''
            if (result.errors) {
              msg = getApolloErrorMsg({
                graphQLErrors: result.errors,
              } as ApolloError)
            }
            const resultObj = getQueryResult(result.data)
            if (
              isPlainObject(resultObj) &&
              resultObj.error_code &&
              resultObj.error_code !== 10000
            ) {
              msg = resultObj.msg || '操作失败'
            }
            if (msg) {
              notifyMsg(msg)
              observer.error(msg)
              return
            }
            observer.next(result)
          },
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        })
      } catch (e) {
        observer.error(e)
      }
      return () => {
        if (sub) sub.unsubscribe()
      }
    })
  })
}
