export const ERROR_TYPE_RE =
	/^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/

/**
 * 上报错误类型
 */
export enum ERROR_TYPES {
	UNKNOWN = 'UNKNOWN',
	UNKNOWN_FUNCTION = 'UNKNOWN_FUNCTION',
	JAVASCRIPT_ERROR = 'JAVASCRIPT_ERROR',
	LOG_ERROR = 'LOG_ERROR',
	FETCH_ERROR = 'HTTP_ERROR',
	RESOURCE_ERROR = 'RESOURCE_ERROR',
	PROMISE_ERROR = 'PROMISE_ERROR',
	ROUTE_ERROR = 'ROUTE_ERROR',
}

/** 上报的错误等级 */
export enum ERROR_LEVEL {
	Low = 'low',
	Normal = 'normal',
	High = 'high',
	Panic = 'Panic',
}

export interface IntegrationError {
	message: string
	name: string
	stack: ErrorStack[]
}

export interface ErrorStack {
    args: any[]
    func: string
    column: number
    line: number
    url: string
  }
  