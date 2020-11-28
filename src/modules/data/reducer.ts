import { createReducer } from "typesafe-actions"
import { initData, modifyData } from "./actions"
import { DataAction, DataState } from './types'

const data = createReducer<DataState, DataAction>([])
    .handleAction(initData, (state, action) => ( action.payload) )
    .handleAction(modifyData, (state, action) => (
        state.map(v => (v.id === action.payload.id ? action.payload : v)
    )))
export default data
