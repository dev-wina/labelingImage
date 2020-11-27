import { createAsyncAction } from "typesafe-actions"
import { AxiosError } from "axios"
import { VideoResponse } from "~api/video";

export const VIDEO_REQUEST = "video/VIDEO_REQUEST"
export const VIDEO_SUCCESS = "video/VIDEO_SUCCESS"
export const VIDEO_ERROR = "video/VIDEO_ERROR"

export const videoAsync = createAsyncAction(
    VIDEO_REQUEST,
    VIDEO_SUCCESS,
    VIDEO_ERROR
)<null, VideoResponse[], AxiosError>()
