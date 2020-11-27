import { put, select, takeEvery } from "redux-saga/effects"
import createAsyncSaga from "~utils/createAsyncSaga"
import { getVideo, VideoResponse } from "~api/video";
import { VIDEO_REQUEST, videoAsync, VIDEO_SUCCESS } from "~modules/video/actions";
import { RootState } from '~modules';
import { initData, Video } from '~modules/data';

function* refineData(){
    const video = (yield select((state:RootState) => state.video)).videoResponse.data
    yield put(initData(refine(video)))
}
 
function refine(data: VideoResponse[]): Video[]{
    return divide(data).map((x: VideoResponse[], i: number)=>
        ({
            id: i,
            name: "name" + i,
            thumbnail: x[0].thumbnailUrl,
            url: x[0].url,
            labels: []            
        })
    )
}

function divide(data: VideoResponse[]): VideoResponse[][] {
    let position: number = 0
    let array: any = []

    while(true){
        const end = data.findIndex(d=>d.albumId === data[position].albumId + 1)
        if (end === -1) break
        array.push(data.slice(position, end))
        position = end + 1
    }
    return array
}

export function* videoSaga() {
    yield takeEvery(VIDEO_REQUEST, createAsyncSaga(videoAsync, getVideo))
     yield takeEvery(VIDEO_SUCCESS, refineData)
}


