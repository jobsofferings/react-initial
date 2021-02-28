import { ApolloClient, DefaultOptions, ApolloError } from 'apollo-client'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { catchError } from './catchError'
import notifyMsg, { handleUnauthError } from './ErrorHandler'
import { APOLLO_URI } from '../config/constants'

export interface OpenCache extends Record<string, any> {
}

const cache = new InMemoryCache({
  addTypename: false,
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    handleUnauthError(graphQLErrors)
  }
  notifyMsg({ graphQLErrors, networkError } as ApolloError)
})

const httpLink = new HttpLink({
  uri: APOLLO_URI,
  headers: {},
})

const link = ApolloLink.from([catchError(), errorLink, httpLink])

const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
}

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
  resolvers: {},
  defaultOptions,
})

const initData: OpenCache = {}

cache.writeData({
  data: initData,
})

export default client
