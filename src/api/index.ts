import { AxiosError, AxiosResponse } from "axios"

export interface CommonResponse {
    success: boolean
    code: number
    msg: string
}
export interface SingleResponse<T> extends CommonResponse {
    data: T
}

export interface ListResponse<T> extends CommonResponse {
    data: T[]
}

export type ApiResponse<T extends CommonResponse> = AxiosResponse<T>;

export type ApiError = AxiosError<CommonResponse>