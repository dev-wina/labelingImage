import { useDispatch, useSelector } from "react-redux"
import { RootState } from "~modules"
import { useCallback } from "react"
import { initData, modifyData, Video } from "~modules/data";

export default function DuseData() {
    const data = useSelector((state: RootState) => state.data)
    const dispatch = useDispatch()
    const init = useCallback((payload: Video[]) => dispatch(initData(payload)), [dispatch])
    const modify = useCallback((payload: Video) => dispatch(modifyData(payload)), [dispatch])
    const findById = ( id : number ) => {
        return data.find( (item:Video) => (item.id === id) ) || null
    }
    return {
        data,
        init,
        findById,
        modify
    }
}

 