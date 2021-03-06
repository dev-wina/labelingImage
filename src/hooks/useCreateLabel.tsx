import { MutableRefObject, useEffect, useState } from 'react'
import { Label, Point } from "~modules/data"
import useMouseDrag from "~hooks/useMouseDrag"

export default function useCreateLabel(
    canvasRef: MutableRefObject<any>,
    imageRef: MutableRefObject<any>, 
    inputRef: MutableRefObject<any>,
    addLabel: (label: Label) => void){

    const { start, end } = useMouseDrag(canvasRef, imageRef, inputRef)

    const createLabel = (start: Point, end: Point): Label => {
        return (
            {
                name: "",
                position: {
                    x: Math.min(start.x, end.x),
                    y: Math.min(start.y, end.y)
                },
                width: Math.abs(end.x - start.x),
                height: Math.abs(end.y - start.y)

            }
        )
    }

    useEffect(()=>{
        addLabel(createLabel(start, end))
    },[end])

}