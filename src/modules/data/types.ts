import { ActionType } from "typesafe-actions"
import * as actions from "./actions"

export type DataAction = ActionType<typeof actions>;

export interface Video{
    id: number
    name: string
    url: string
    thumbnail: string
    labels: Label[] 
}

export interface Label{
    name: string
    position: Point
    width: number
    height:number
}

export interface Point{
    x: number
    y: number
}

export type DataState = Video[];