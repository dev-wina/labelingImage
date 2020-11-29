import React, { useCallback, useEffect, useRef, useState } from "react"
import { Label, Point, Video } from "~modules/data";
import { styled } from "~styles/themes"
import useData from "~hooks/useData"
import useImage from '~hooks/useImage';
import useImageSize from '~hooks/useImageSize';
import { withProps } from '~styles/themed-components';
import useMousePoint from '~hooks/useMousePoint';
import { PAINT_RECT_MODE } from '~constant';
import useDrawRect, from '~hooks/useDrawRect';

export interface ILabels {
    image?: string
    data?: Video
}

export interface ISInput {
    left: number
    top: number
    isVisible: boolean
}

function LabelingView(prop: ILabels) {
    const {
        image,
        data
    } = prop;
    const { modify, findById } = useData()
    const [ list, setList ] = useState<Label[]>([]) // TODO : labelList에 넘겨줘야함
    const canvasRef = useRef<HTMLCanvasElement>()
    const imageRef = useRef<HTMLCanvasElement>()
    const inputRef = useRef<HTMLInputElement>()
    const [ isInputVisible, setInputVisibility ] = useState<boolean>(true)
    const [ start, setStart ] = useState<Point>({x: 0, y: 0})
    const [ end, setEnd ] = useState<Point>({x: 0, y: 0})
    const [ targetRect, setTargetRect ] = useState<Label>()
    const [ paintRectMode, setPaintRectMode ] = useState<PAINT_RECT_MODE>(PAINT_RECT_MODE.NONE)
    const mousePos = useMousePoint(canvasRef).point


    const tempRect: Label = { 
                className: "class",
                position: {
                    lt: { x: start.x / 600, y: start.y / 600 },
                    rt: { x: mousePos.x / 600, y: start.y / 600 },
                    lb: { x: start.x / 600, y: mousePos.y / 600 },
                    rb: { x: mousePos.x / 600, y: mousePos.y / 600 }
                },
                width: mousePos.x / 600 - start.x / 600,
                height: mousePos.y / 600 - start.y / 600,
                isSelected: true
            }


    useEffect(() => {
        if (data) setList(data.labels)
    }, [data])

    const addLabel = (label: Label) => {
        setList([...list, label])
    }

    const handleSave = () => {
        console.log("!")
        modify({...data, ...{labels: list}})
    }
    
  

    const [ lefttop, setLefttop ]  = useState<ISInput>({ left: 100, top: 100, isVisible: false })
    
    const handleMouseDown = useCallback((e) => {
        setStart(mousePos)
        setLefttop({left: mousePos.x, top: start.y, isVisible: false})
        if(list.length === 0) setPaintRectMode(PAINT_RECT_MODE.CREATE)
        list.map((rect)=>{
            if (   
                rect.position.lt.x * 600 - 4 < mousePos.x && mousePos.x < rect.position.lt.x * 600 + 4 
                && rect.position.lt.y * 600 - 4 < mousePos.y && mousePos.y < rect.position.lt.y * 600 + 4 
                || rect.position.rt.x * 600 - 4 < mousePos.x && mousePos.x < rect.position.rt.x * 600 + 4 
                && rect.position.rt.y * 600 - 4 < mousePos.y && mousePos.y < rect.position.rt.y * 600 + 4 
                || rect.position.lb.x * 600 - 4 < mousePos.x && mousePos.x < rect.position.lb.x * 600 + 4 
                && rect.position.lb.y * 600 - 4 < mousePos.y && mousePos.y < rect.position.lb.y * 600 + 4 
                || rect.position.rb.x * 600 - 4 < mousePos.x && mousePos.x < rect.position.rb.x * 600 + 4 
                && rect.position.rb.y * 600 - 4 < mousePos.y && mousePos.y < rect.position.rb.y * 600 + 4 ) {

                setTargetRect(rect)
                rect.isSelected = true;
                setPaintRectMode(PAINT_RECT_MODE.RESIZE)
            }
            // TODO : target의 anchor에 enter시
            //else if(rect){
            //  setPaintRectMode(PAINT_RECT_MODE.RESIZE)
            //}
            else if(   
                rect.position.lt.x * 600 < mousePos.x && mousePos.x < rect.position.rt.x * 600
                && rect.position.lt.y * 600 < mousePos.y && mousePos.y < rect.position.lb.y * 600){
                
                setTargetRect(rect)
                rect.isSelected = true;
                setPaintRectMode(PAINT_RECT_MODE.MOVE)        
            }
            else if(paintRectMode != PAINT_RECT_MODE.RESIZE){
                setPaintRectMode(PAINT_RECT_MODE.CREATE)
            }
        })
        
        if( PAINT_RECT_MODE.CREATE && canvasRef && canvasRef.current){
            const context = canvasRef.current.getContext('2d')
            setTargetRect(tempRect)
            setList([...list,tempRect])
            if(context){
                useDrawRect(canvasRef, list)
            }
        }
        
    },[paintRectMode, mousePos, targetRect, start])

    const handleMouseMove = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if(canvasRef && canvasRef.current){
            if(paintRectMode === PAINT_RECT_MODE.CREATE){
                const canvas: HTMLCanvasElement = canvasRef.current
                const context = canvas.getContext('2d')
                list[list.length-1] = tempRect
                setTargetRect(list[list.length-1])
                if(context){
                    useDrawRect(canvasRef, list)
                }
            }
            else if(paintRectMode === PAINT_RECT_MODE.RESIZE){
                const canvas: HTMLCanvasElement = canvasRef.current
                const context = canvas.getContext('2d')
                list.map((rect)=>{
                    if(rect === targetRect){
                        rect.position = {
                                lt: { x: rect.position.lt.x, y: rect.position.lt.y},
                                rt: { x: mousePos.x / 600, y: rect.position.lt.y },
                                lb: { x: rect.position.lt.x, y: mousePos.y / 600 },
                                rb: { x: mousePos.x / 600, y: mousePos.y / 600 }
                            }
                        setTargetRect(rect)
                    }
                })
                if(context){
                    useDrawRect(canvasRef, list)
                }
            }
            else if(paintRectMode === PAINT_RECT_MODE.MOVE){
                const canvas: HTMLCanvasElement = canvasRef.current
                const context = canvas.getContext('2d')
                list.map((rect)=>{
                    if(rect === targetRect){
                        rect.position = {
                                lt: { x: mousePos.x / 600, y: mousePos.y / 600},
                                rt: { x: mousePos.x / 600 + rect.width, y: mousePos.y / 600 },
                                lb: { x: mousePos.x / 600, y: mousePos.y / 600 + rect.height },
                                rb: { x: mousePos.x / 600 + rect.width, y: mousePos.y / 600 + rect.height }
                            }
                        setTargetRect(rect)
                    }
                })
                if(context){
                    useDrawRect(canvasRef, list)
                }
            }
        }
    },[paintRectMode, mousePos, start])

    const hitBox = () => {
       
    }

    const handleMouseUp = useCallback((e) => {
        setEnd(mousePos)
        if(inputRef && inputRef.current){
            setLefttop({left: mousePos.x, top: start.y, isVisible: true})
            inputRef.current.onkeydown = handleEnter
            inputRef.current.focus();
        }
        setPaintRectMode(PAINT_RECT_MODE.NONE)
    },[mousePos, canvasRef, inputRef])

    const handleMouseLeave = useCallback((e) => {
        setEnd(mousePos)
        setPaintRectMode(PAINT_RECT_MODE.NONE)
    },[])

    const handleEnter = useCallback((e) => {
         var keyCode = e.keyCode;
        if (keyCode === 13 && inputRef && inputRef.current && targetRect && canvasRef && canvasRef.current) {
            setLefttop({left: mousePos.x, top: start.y, isVisible: false})
            list[list.length-1].className = inputRef.current.value
            setList(list)
            const canvas: HTMLCanvasElement = canvasRef.current
            const context = canvas.getContext('2d')
            if(context){
                useDrawRect(canvasRef, list)
            }
            inputRef.current.value = ""
        }
        setPaintRectMode(PAINT_RECT_MODE.NONE)
    },[inputRef, lefttop, mousePos, canvasRef, targetRect])


    useEffect(()=>{
        if (canvasRef && canvasRef.current) {
            canvasRef.current.addEventListener("mousedown", handleMouseDown )
            canvasRef.current.addEventListener("mousemove", handleMouseMove )
            canvasRef.current.addEventListener("mouseup", handleMouseUp )
            canvasRef.current.addEventListener("mouseleave", handleMouseLeave )
            canvasRef.current.addEventListener("keypress", handleEnter )
        }

        return () => {
            if (canvasRef && canvasRef.current) {
                canvasRef.current.removeEventListener("mousedown", handleMouseDown )
                canvasRef.current.removeEventListener("mousemove", handleMouseMove )
                canvasRef.current.removeEventListener("mouseup", handleMouseUp )
                canvasRef.current.addEventListener("mouseleave", handleMouseLeave )
                canvasRef.current.addEventListener("keypress", handleEnter )
            }
        }
    },[handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, handleEnter])

    useImage(imageRef, image)
    useImageSize(image)
    //useCreateLabel(canvasRef, imageRef, inputRef, addLabel)
    
    return(
        <SLabelingView>
            <canvas width="970px" height="594px" style={{position:"absolute"}}
                ref={imageRef}>
            </canvas>
            <canvas width="970px" height="594px" style={{position:"absolute"}}
                ref={canvasRef}>
            </canvas>
            {
                isInputVisible? 
                <SInputWrapper {...lefttop}>
                    <SInput ref={inputRef} type="text" name="class" placeholder="Input class name"/>
                </SInputWrapper>
                : null
            }
        </SLabelingView>
}


export default LabelingView

const SLabelingView = styled.div`
    position: relative;
    display: grid;
    width:100%;
    height:100%;
`
// TODO : border안나옴, 설정할 것
const SInputWrapper = withProps<ISInput,HTMLInputElement>(styled.div)`
    z-index: 2;
    position: absolute;
    display: ${props => props.isVisible? "grid" : "none"};
    background: #FFFFFF 0% 0% no-repeat padding-box;
    border-color: #A1ACC4;
    border-width: 1px;
    border-radius: 50px;
    width: 177px;
    height: 32px;
    left: ${props => props.left}px;
    top: ${props => props.top}px;
`

const SInput = styled.input`
    position: absolute;
    width: 147px;
    height: 22px; 
    left: 15px;
    top: 5px;
`
