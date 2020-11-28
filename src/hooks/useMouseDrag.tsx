import { MutableRefObject, useCallback, useEffect, useState } from 'react'
import { PAINT_RECT_MODE } from '~constant'
import useMousePoint from "~hooks/useMousePoint"
import { Point } from "~modules/data"
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
    const [ temp, setTemp ] = useState<IRect>(tempRect)
    const [ paintRectMode, setPaintRectMode ] = useState<PAINT_RECT_MODE>(PAINT_RECT_MODE.NONE)
    const mousePos = useMousePoint(ref)
    const img = useImageSize(null)
  

    const data = [
        { lt: {x:0, y:0}, rt: {x:0.2, y:0}, lb: {x:0, y:0.2}, rb: {x:0.2, y:0.2}, selected: false},
        { lt: {x:0, y:0}, rt: {x:0.9, y:0}, lb: {x:0, y:0.9}, rb: {x:0.9, y:0.9}, selected: false}
    ] // TODO : 삭제예정, 이미지에서의 비율  

    const handleMouseDown = useCallback((e) => {
        setStart(getPoint(e))
        setPaintRectMode(PAINT_RECT_MODE.CREATE)
    },[])

    const drawRect = (context, rect) =>{
        if(rect.seleted == false) return

        context.fillStyle="#5668D933"
        context.strokeStyle = "#5668D9"
        context.lineJoin = 'miter'
        context.lineWidth = 1

        context.beginPath()

        context.moveTo(rect.lt.x * 600, rect.lt.y * 600);
        context.lineTo(rect.rt.x * 600, rect.rt.y * 600);
        context.lineTo(rect.rb.x * 600, rect.rb.y * 600);
        context.lineTo(rect.lb.x * 600, rect.lb.y * 600);

        context.closePath()

        context.stroke()
        context.fill()
    }

    const drawAnchor = (context, rect) =>{
        if(rect.seleted == false) return
        context.strokeStyle = "#5668D9"
        context.lineJoin = 'miter'
        context.lineWidth = 1

        context.beginPath();

        context.moveTo(rect.lt.x * 600 - 4, rect.lt.y * 600 - 4)
        context.lineTo(rect.lt.x * 600 + 4, rect.lt.y * 600 - 4)
        context.lineTo(rect.lt.x * 600 + 4, rect.lt.y * 600 + 4)
        context.lineTo(rect.lt.x * 600 - 4, rect.lt.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.lt.x * 600 - 4, rect.lt.y * 600 - 4, 8, 8)


        
        context.moveTo(rect.rt.x * 600 - 4, rect.rt.y * 600 - 4)
        context.lineTo(rect.rt.x * 600 + 4, rect.rt.y * 600 - 4)
        context.lineTo(rect.rt.x * 600 + 4, rect.rt.y * 600 + 4)
        context.lineTo(rect.rt.x * 600 - 4, rect.rt.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.rt.x * 600 - 4, rect.rt.y * 600 - 4, 8, 8)

        context.moveTo(rect.rb.x * 600 - 4, rect.rb.y * 600 - 4)
        context.lineTo(rect.rb.x * 600 + 4, rect.rb.y * 600 - 4)
        context.lineTo(rect.rb.x * 600 + 4, rect.rb.y * 600 + 4)
        context.lineTo(rect.rb.x * 600 - 4, rect.rb.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.rb.x * 600 - 4, rect.rb.y * 600 - 4, 8, 8)

        context.moveTo(rect.lb.x * 600 - 4, rect.lb.y * 600 - 4)
        context.lineTo(rect.lb.x * 600 + 4, rect.lb.y * 600 - 4)
        context.lineTo(rect.lb.x * 600 + 4, rect.lb.y * 600 + 4)
        context.lineTo(rect.lb.x * 600 - 4, rect.lb.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.lb.x * 600 - 4, rect.lb.y * 600 - 4, 8, 8)

        //////////////////////////////////////////////////////////////////////
        context.moveTo(rect.lt.x * 600 + (((rect.rt.x * 600) - (rect.lt.x * 600)) / 2) - 4, (rect.lt.y * 600) - 4)
        context.lineTo(rect.lt.x * 600 + (((rect.rt.x * 600) - (rect.lt.x * 600)) / 2) + 4, (rect.lt.y * 600) - 4)
        context.lineTo(rect.lt.x * 600 + (((rect.rt.x * 600) - (rect.lt.x * 600)) / 2) + 4, (rect.lt.y * 600) + 4)
        context.lineTo(rect.lt.x * 600 + (((rect.rt.x * 600) - (rect.lt.x * 600)) / 2) - 4, (rect.lt.y * 600) + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.lt.x * 600 + ((rect.rt.x * 600 - rect.lt.x * 600) / 2) - 4, rect.lt.y * 600 - 4, 8, 8)

        context.moveTo(rect.lt.x * 600 - 4, rect.lt.y * 600 + ((rect.lb.y * 600 - rect.lt.y * 600) / 2) - 4)
        context.lineTo(rect.lt.x * 600 + 4, rect.lt.y * 600 + ((rect.lb.y * 600 - rect.lt.y * 600) / 2) - 4)
        context.lineTo(rect.lt.x * 600 + 4, rect.lt.y * 600 + ((rect.lb.y * 600 - rect.lt.y * 600) / 2) + 4)
        context.lineTo(rect.lt.x * 600 - 4, rect.lt.y * 600 + ((rect.lb.y * 600 - rect.lt.y * 600) / 2) + 4)
        
        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.lt.x * 600 - 4,rect.lt.y * 600 + ((rect.lb.y * 600 - rect.lt.y * 600) / 2) - 4, 8, 8)

        context.moveTo(rect.lb.x * 600 + ((rect.rb.x * 600 - rect.lb.x * 600) / 2) - 4, rect.lb.y * 600 - 4)
        context.lineTo(rect.lb.x * 600 + ((rect.rb.x * 600 - rect.lb.x * 600) / 2) + 4, rect.lb.y * 600 - 4)
        context.lineTo(rect.lb.x * 600 + ((rect.rb.x * 600 - rect.lb.x * 600) / 2) + 4, rect.lb.y * 600 + 4)
        context.lineTo(rect.lb.x * 600 + ((rect.rb.x * 600 - rect.lb.x * 600) / 2) - 4, rect.lb.y * 600 + 4)
        
        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.lb.x * 600 + ((rect.rb.x * 600 - rect.lb.x * 600) / 2) - 4,rect.lb.y * 600 - 4, 8, 8)

        context.moveTo(rect.rt.x * 600 - 4, rect.rt.y * 600 + ((rect.rb.y * 600 - rect.rt.y * 600) / 2) - 4)
        context.lineTo(rect.rt.x * 600 + 4, rect.rt.y * 600 + ((rect.rb.y * 600 - rect.rt.y * 600) / 2) - 4)
        context.lineTo(rect.rt.x * 600 + 4, rect.rt.y * 600 + ((rect.rb.y * 600 - rect.rt.y * 600) / 2) + 4)
        context.lineTo(rect.rt.x * 600 - 4, rect.rt.y * 600 + ((rect.rb.y * 600 - rect.rt.y * 600) / 2) + 4)
        
        context.closePath()
        context.stroke()
         context.fillStyle = "#fff"
        context.fillRect(rect.rt.x * 600 - 4,rect.rt.y * 600 + ((rect.rb.y * 600 - rect.rt.y * 600) / 2) - 4, 8, 8)
    }

    const handleMouseMove = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if(paintRectMode == PAINT_RECT_MODE.CREATE){
            const canvas: HTMLCanvasElement = ref.current
            const context = canvas.getContext('2d')
            const _temp: IRect = { 
                lt: {x: start.x / 600, y: start.y / 600}, 
                rt: {x: getPoint(e).x / 600, y: start.y / 600}, 
                lb: {x: start.x / 600, y: getPoint(e).y / 600}, 
                rb: {x: getPoint(e).x / 600, y: getPoint(e).y / 600}, 
                selected: false
            }//비율이 아닌 포인트로 들어있다
            setTemp(_temp)
            if(context){
                context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
                drawRect(context, temp)
                drawAnchor(context, temp)
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
    }
        ,[])

    useEffect(()=>{
        const canvas: HTMLCanvasElement = ref.current
        const context = canvas.getContext('2d')
        if(context){
            data.map((rect)=>{
                const temp = { 
                    lt: {x:rect.lt.x, y:rect.lt.y}, 
                    rt: {x:rect.rt.x, y:rect.rt.y}, 
                    lb: {x:rect.lb.x, y:rect.lb.y}, 
                    rb: {x:rect.rb.x, y:rect.rb.y}, 
                    selected: true
                }
                drawRect(context, temp)
                drawAnchor(context, temp)
            })  
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