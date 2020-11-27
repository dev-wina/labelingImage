import { combineReducers } from "redux"
import { all } from "redux-saga/effects"
import video, { videoSaga } from "~modules/video";
import data from "~modules/data";

const rootReducer = combineReducers({
    video,
    data
})

export default rootReducer

export const initializeState = {}

export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
    yield all([
        videoSaga()
    ])
}
