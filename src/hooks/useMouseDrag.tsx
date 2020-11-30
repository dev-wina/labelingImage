import { MutableRefObject, useCallback, useEffect, useState } from 'react'
import { PAINT_RECT_MODE } from '~constant'
import useMousePoint from "~hooks/useMousePoint"
import { Label, Point } from "~modules/data"
import useDrawRect, { IRect } from './useDrawRect'
import get = Reflect.get

export default function useMouseDrag(canvasRef: MutableRefObject<any>,imageRef: MutableRefObject<any>, inputRef: MutableRefObject<any>,){
    

    // return {
    //     start,
    //     end
    // }
}
