import type { FetchResult, Observable } from '@apollo/client'
export interface ErrorMatchHandler {
  match(error: Error): boolean

  handle(error: Error): Observable<FetchResult> | void
}
