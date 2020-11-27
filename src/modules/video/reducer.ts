import { asyncState, createAsyncReducer, transformToArray } from "~utils/reducerUtils"
import { createReducer } from "typesafe-actions"
import { VideoAction, VideoState } from "~modules/video/types"
import { videoAsync } from "~modules/video/actions"


const initialState: VideoState = {
    videoResponse: asyncState.initial()
}

const video = createReducer<VideoState, VideoAction>(initialState).handleAction(
    transformToArray(videoAsync),
    createAsyncReducer(videoAsync, "videoResponse")
)

export default video