import type { FetchResult, Observable } from '@apollo/client'
import type { NetworkError } from '@apollo/client/errors'
import type { ErrorMatchHandler } from './error-handler'
export interface NetworkErrorMatchHandler extends ErrorMatchHandler {
  match(error: NetworkError): boolean

  handle(error: NetworkError): Observable<FetchResult> | void
}

export class DefaultNetworkErrorHandler implements NetworkErrorMatchHandler {
  match(error: NetworkError): boolean {
    return error !== undefined
  }

  handle(error: NetworkError): void | Observable<FetchResult<Record<string, any>, Record<string, any>, Record<string, any>>> {
    // eslint-disable-next-line no-console
    console.log(error)
    // message.error({
    //   message: '网络错误，请稍后重试',
    //   key: 'network',
    //   duration: 1,
    // })
  }
}
