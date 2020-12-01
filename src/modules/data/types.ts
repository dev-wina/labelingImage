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
    className: string
    position: Position
    width: number
    height: number
    degree: number
    isSelected: boolean
}

export interface Position{
    lt: Point
    rt: Point
    lb: Point
    rb: Point
}

export interface Point{
    x: number
    y: number
}

export type DataState = Video[];