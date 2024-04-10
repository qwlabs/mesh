import { getMainDefinition } from '@apollo/client/utilities'
import type {
  ApolloCache,
  NormalizedCacheObject,
  Operation,
} from '@apollo/client/core'
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import type { GraphQLErrorMatchHandler } from './graphql-error-handler'
import {
  DefaultGraphQLErrorHandler,
} from './graphql-error-handler'
import type { NetworkErrorMatchHandler } from './network-error-handler'
import { DefaultNetworkErrorHandler } from './network-error-handler'

export type RequestHeadersAugmentor = (headers: Record<string, any>) => Record<string, any>

export interface GraphqlApiClientConfig {
  ssrMode: boolean
  connectToDevTools: boolean
  url: string
  subscriptionUrl?: string
  batchEnabled: boolean
  headersAugmentor?: RequestHeadersAugmentor
  networkErrorHandlers?: NetworkErrorMatchHandler[]
  graphQLErrorHandlers?: GraphQLErrorMatchHandler[]
}

const loadHeaders = (config: GraphqlApiClientConfig): Record<string, any> => {
  let headers: Record<string, any> = {}
  headers['Content-Type'] = 'application/json;charset=UTF-8'
  headers['Accept-Language'] = 'zh-CN'
  if (config.headersAugmentor)
    headers = config.headersAugmentor(headers)

  return headers
}

const createAHttpLink = (config: GraphqlApiClientConfig): ApolloLink => {
  const normalHttpLink = createHttpLink({
    uri: (params: Operation) => {
      return `${config.url}?op=${params.operationName}`
    },
  })
  const batchHttpLink = createHttpLink({
    uri: config.url,
  })
  return split(() => config.batchEnabled, batchHttpLink, normalHttpLink)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createWSLink = (config: GraphqlApiClientConfig): ApolloLink => {
  return ApolloLink.from([])
}

const createGraphqlLink = (config: GraphqlApiClientConfig): ApolloLink => {
  const httpLink = createAHttpLink(config)
  const wsLink = createWSLink(config)
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink,
  )
}

const createErrorLink = (config: GraphqlApiClientConfig): ApolloLink => {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors != null && graphQLErrors.length > 0) {
      graphQLErrors.forEach((graphQLError) => {
        if (config.graphQLErrorHandlers) {
          const handler = config.graphQLErrorHandlers.find(handler => handler.match(graphQLError)) ?? new DefaultGraphQLErrorHandler()
          handler?.handle(graphQLError)
        }
        else {
          const defaultHandler = new DefaultGraphQLErrorHandler()
          defaultHandler.handle(graphQLError)
        }
      })
    }
    if (networkError) {
      if (config.networkErrorHandlers) {
        const handler = config.networkErrorHandlers.find(handler => handler.match(networkError))
        handler?.handle(networkError)
      }
      else {
        const defaultHandler = new DefaultNetworkErrorHandler()
        defaultHandler?.handle(networkError)
      }
    }
  })
}

const createMiddleware = (config: GraphqlApiClientConfig): ApolloLink => {
  return new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: loadHeaders(config),
    })
    return forward(operation)
  })
}

const createLink = (config: GraphqlApiClientConfig): ApolloLink => {
  const middleware = createMiddleware(config)
  const graphqlLink = createGraphqlLink(config)
  const errorLink = createErrorLink(config)
  return ApolloLink.from([errorLink, middleware, graphqlLink])
}

export const createClient = (config: GraphqlApiClientConfig): { client: ApolloClient<any>; cache: ApolloCache<NormalizedCacheObject> } => {
  const link = createLink(config)
  const cache = new InMemoryCache({
    resultCaching: true,
  })
  const client = new ApolloClient({
    link,
    cache,
    ssrMode: config.ssrMode,
    defaultOptions: {
      query: {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache',
      },
      mutate: {
        fetchPolicy: 'no-cache',
        keepRootFields: true,
      },
      watchQuery: {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache',
        nextFetchPolicy: 'no-cache',
        returnPartialData: true,
      },
    },
    connectToDevTools: config.connectToDevTools,
  })
  return { client, cache }
}
