import { createAction } from 'typesafe-actions'
import { Video } from "./types"

export const INIT_DATA = "data/INIT_DATA"
export const MODIFY_DATA = "data/MODIFY_DATA"

export const initData = createAction(INIT_DATA)<Video[]>()
export const modifyData = createAction(MODIFY_DATA)<Video>()
