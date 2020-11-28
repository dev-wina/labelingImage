import { MutableRefObject, useCallback, useEffect, useState } from 'react'
import { PAINT_RECT_MODE } from '~constant'
import useMousePoint from "~hooks/useMousePoint"
import { Label, Point } from "~modules/data"
import useDrawRect from './useDrawRect'
import useImageSize from './useImageSize'
import get = Reflect.get

interface IRect{
    lt: {x: number, y: number}
    rt: {x: number, y: number}
    lb: {x: number, y: number}
    rb: {x: number, y: number}
    selected: boolean
}
export default function useMouseDrag(ref: MutableRefObject<any>){
    const tempRect: IRect = {
        lt: {x: 0, y: 0}, 
        rt: {x: 0, y: 0}, 
        lb: {x: 0, y: 0}, 
        rb: {x: 0, y:0}, 
        selected: false
    }

    const [ start, setStart ] = useState<Point>({x: 0, y: 0})
    const [ end, setEnd ] = useState<Point>({x: 0, y: 0})
    const [ temp, setTemp ] = useState<Label>()
    const [ paintRectMode, setPaintRectMode ] = useState<PAINT_RECT_MODE>(PAINT_RECT_MODE.NONE)
    const mousePos = useMousePoint(ref)
    const img = useImageSize(null)

    const handleMouseDown = useCallback((e) => {
        setStart(getPoint(e))
        setPaintRectMode(PAINT_RECT_MODE.CREATE)
    },[])

    const handleMouseMove = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if(paintRectMode == PAINT_RECT_MODE.CREATE){
            const canvas: HTMLCanvasElement = ref.current
            const context = canvas.getContext('2d')
            // const _temp: IRect = { 
            //     lt: {x: start.x / 600, y: start.y / 600}, 
            //     rt: {x: getPoint(e).x / 600, y: start.y / 600}, 
            //     lb: {x: start.x / 600, y: getPoint(e).y / 600}, 
            //     rb: {x: getPoint(e).x / 600, y: getPoint(e).y / 600}, 
            //     selected: false
            // }
            const _temp: Label = { 
                name: "111",
                position: {
                    x: start.x / 600,
                    y: start.y / 600
                },
                width: getPoint(e).x / 600 - start.x / 600,
                height: getPoint(e).y / 600 - start.y / 600
            }
            setTemp(_temp)
            console.log("_temp",_temp)
            if(context){
                useDrawRect(ref, [_temp])
            }
        }
    },[paintRectMode, mousePos, temp, start])

    const hitBox = (x, y) => {
        let selected = null;
        const rectList: IRect[] = []
        rectList.map((rect)=>{
            // if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
            //     dragTarget = rect;
            //     rect.selected = true;
            // }
        })
        return selected;
    }

    const handleMouseUpAndLeave = useCallback((e) => {
        setEnd(getPoint(e))
        setPaintRectMode(PAINT_RECT_MODE.NONE)
    },[])

    const getPoint = useCallback(e => {
        const canvas: HTMLCanvasElement = ref.current

        return {
            //캔버스에서의 마우스 절대좌표를 가져옴
            x: ((e.clientX - e.target.getBoundingClientRect().left) / e.target.getBoundingClientRect().width) * canvas.width,
            y: ((e.clientY - e.target.getBoundingClientRect().top) / e.target.getBoundingClientRect().height) * canvas.height
        }
    },[])


    useEffect(()=>{
        if (ref && ref.current) {
            ref.current.addEventListener("mousedown", handleMouseDown )
            ref.current.addEventListener("mousemove", handleMouseMove )
            ref.current.addEventListener("mouseup", handleMouseUpAndLeave )
            ref.current.addEventListener("mouseleave", handleMouseUpAndLeave )
        }

        return () => {
            ref.current.removeEventListener("mousedown", handleMouseDown )
            ref.current.removeEventListener("mousemove", handleMouseMove )
            ref.current.removeEventListener("mouseup", handleMouseUpAndLeave )
            ref.current.addEventListener("mouseleave", handleMouseUpAndLeave )
        }
    },[handleMouseDown, handleMouseMove, handleMouseUpAndLeave])

    return {
        start,
        end
    }
}