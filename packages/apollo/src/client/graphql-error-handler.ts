import type { FetchResult, Observable } from '@apollo/client'
import type { GraphQLError } from 'graphql/error/GraphQLError'
import type { ErrorMatchHandler } from './error-handler'
export interface GraphQLErrorMatchHandler extends ErrorMatchHandler {
  match(error: GraphQLError): boolean

  handle(error: GraphQLError): Observable<FetchResult> | void
}

export class UnauthorizedErrorHandler implements GraphQLErrorMatchHandler {
  match(error: GraphQLError): boolean {
    return error && error.extensions.code === 'unauthorized'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,n/handle-callback-err
  handle(error: GraphQLError): void | Observable<FetchResult<Record<string, any>, Record<string, any>, Record<string, any>>> {
    // const { goto } = useSafeRouter()
    // console.log(error)
    // message.error({
    //   message: '登录失效，请重新登录',
    //   duration: 2,
    //   key: 'unauthorized',
    // })
    // goto('/login')
  }
}

export class ForbiddenErrorHandler implements GraphQLErrorMatchHandler {
  match(error: GraphQLError): boolean {
    return error && error.extensions.code === 'error.forbidden'
  }

  // eslint-disable-next-line n/handle-callback-err,@typescript-eslint/no-unused-vars
  handle(error: GraphQLError): void | Observable<FetchResult<Record<string, any>, Record<string, any>, Record<string, any>>> {
    // // @ts-expect-error
    // console.log(error)
    // message.error({
    //   message: '没有权限',
    //   key: 'forbidden',
    //   duration: 1,
    // })
  }
}

export class InputValidationErrorHandler implements GraphQLErrorMatchHandler {
  match(error: GraphQLError): boolean {
    return error && error.extensions.classification === 'ValidationError'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,n/handle-callback-err
  handle(error: GraphQLError): void | Observable<FetchResult<Record<string, any>, Record<string, any>, Record<string, any>>> {
    // console.log(error)
    // message.error({
    //   message: '输入参数错误',
    //   key: 'validation',
    //   duration: 1,
    // })
  }
}

export class ServerErrorHandler implements GraphQLErrorMatchHandler {
  match(error: GraphQLError): boolean {
    return error !== undefined
  }

  // eslint-disable-next-line n/handle-callback-err,@typescript-eslint/no-unused-vars
  handle(error: GraphQLError): void | Observable<FetchResult<Record<string, any>, Record<string, any>, Record<string, any>>> {
    // const showMessage = error.extensions.code !== undefined
    // const errorMessage = error?.message ?? '服务器错误'
    // message.error({
    //   message: showMessage ? errorMessage : '服务器错误',
    //   key: 'server error',
    // })
  }
}

export class DefaultGraphQLErrorHandler implements GraphQLErrorMatchHandler {
  match(error: GraphQLError): boolean {
    return error !== undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,n/handle-callback-err
  handle(error: GraphQLError): void | Observable<FetchResult<Record<string, any>, Record<string, any>, Record<string, any>>> {
    // console.log(error)
    // message.error({
    //   message: error?.message ?? '出现未知错误',
    //   key: 'graphql',
    //   duration: 1,
    // })
  }
}
