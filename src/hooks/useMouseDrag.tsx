import { MutableRefObject, useCallback, useEffect, useState } from 'react'
import { PAINT_RECT_MODE } from '~constant'
import useMousePoint from "~hooks/useMousePoint"
import { Label, Point } from "~modules/data"
import useDrawRect, { IRect } from './useDrawRect'
import get = Reflect.get

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
    const [ list, setList ] = useState<Label[]>([])
    const mousePos = useMousePoint(ref).point

    const handleMouseDown = useCallback((e) => {
        setStart(mousePos)
        setPaintRectMode(PAINT_RECT_MODE.CREATE)
        const canvas: HTMLCanvasElement = ref.current
        const context = canvas.getContext('2d')
        const _temp: Label = { 
            name: (parseInt(list[list.length-1].name)+1).toString(),
            position: {
                x: start.x / 600,
                y: start.y / 600
            },
            width: mousePos.x / 600 - start.x / 600,
            height: mousePos.y / 600 - start.y / 600
        }
        setTemp(_temp)
        setList([...list,_temp])
        console.log("_temp",_temp)
        if(context){
            useDrawRect(ref, list)
        }
    },[paintRectMode, mousePos, temp, start])

    const handleMouseMove = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if(paintRectMode == PAINT_RECT_MODE.CREATE){
            const canvas: HTMLCanvasElement = ref.current
            const context = canvas.getContext('2d')
            
            list[list.length-1] = { 
                name: "111",
                position: {
                    x: start.x / 600,
                    y: start.y / 600
                },
                width: mousePos.x / 600 - start.x / 600,
                height: mousePos.y / 600 - start.y / 600
            }
            setTemp(list[list.length-1])
            console.log("_temp",list[list.length-1])
            if(context){
                useDrawRect(ref, list)
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

    let input: HTMLInputElement
    const handleMouseUp = useCallback((e) => {
        setEnd(mousePos)
        input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'absolute';
        
        input.style.left = `${e.pageX}px`;
        input.style.top = `${e.pageY}px`;

        // alert(`${e.pageX}, ${e.pageY}`)

        input.onkeydown = handleEnter

        document.body.appendChild(input);

        input.focus();

        setPaintRectMode(PAINT_RECT_MODE.NONE)
    },[mousePos, ref])

    const handleMouseLeave = useCallback((e) => {
        setEnd(mousePos)
        setPaintRectMode(PAINT_RECT_MODE.NONE)
    },[])

    

    function handleEnter(e) {
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            // TODO : 해당 rect의 class name에 내용 넣어주기
            document.body.removeChild(input);
        }
    }


    useEffect(()=>{
        if (ref && ref.current) {
            ref.current.addEventListener("mousedown", handleMouseDown )
            ref.current.addEventListener("mousemove", handleMouseMove )
            ref.current.addEventListener("mouseup", handleMouseUp )
            ref.current.addEventListener("mouseleave", handleMouseLeave )
            ref.current.addEventListener("keypress", handleEnter )
        }

        return () => {
            ref.current.removeEventListener("mousedown", handleMouseDown )
            ref.current.removeEventListener("mousemove", handleMouseMove )
            ref.current.removeEventListener("mouseup", handleMouseUp )
            ref.current.addEventListener("mouseleave", handleMouseLeave )
            ref.current.addEventListener("keypress", handleEnter )
        }
    },[handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave])

    return {
        start,
        end
    }
}