import { useDispatch, useSelector } from "react-redux"
import { RootState } from "~modules"
import { useCallback } from "react"
import { videoAsync } from "~modules/video";

export default function useVideo() {
    const video = useSelector((state: RootState) => state.video)
    const dispatch = useDispatch()
    const getVideo = useCallback(() => dispatch(videoAsync.request(null)), [dispatch])

    return {
        video,
        getVideo
    }
}

 