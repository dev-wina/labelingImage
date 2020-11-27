import * as actions from "./actions"
import { ActionType } from "typesafe-actions"
import { AsyncState } from "~utils/reducerUtils"
import { VideoResponse } from "~api/video";

export type VideoAction = ActionType<typeof actions>

export type VideoState = {
    videoResponse: AsyncState<VideoResponse, Error>
}