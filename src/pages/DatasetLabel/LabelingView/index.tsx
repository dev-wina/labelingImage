import React, { useCallback, useEffect, useRef, useState } from "react"
import { Label, Point, Video } from "~modules/data";
import { styled } from "~styles/themes"
import useData from "~hooks/useData"
import useImage from '~hooks/useImage';
import useImageSize from '~hooks/useImageSize';
import { withProps } from '~styles/themed-components';
import useMousePoint from '~hooks/useMousePoint';
import { PAINT_RECT_MODE } from '~constant';
import useDrawRect from '~hooks/useDrawRect';
import useStateWithPromise from '~hooks/useStateWithPromise';

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

    const canvasRef = useRef<HTMLCanvasElement>()
    const imageRef = useRef<HTMLCanvasElement>()
    const inputRef = useRef<HTMLInputElement>()

    const [ paintRectMode, setPaintRectMode ] = useStateWithPromise(PAINT_RECT_MODE.NONE)

    const [ isInputVisible, setInputVisibility ] = useState<boolean>(true)
    const [ inputCtl, setInputCtl ]  = useState<ISInput>({ left: 100, top: 100, isVisible: false })

    const [ start, setStart ] = useStateWithPromise({x: 0, y: 0})
    const [ end, setEnd ] = useStateWithPromise({x: 0, y: 0})
    const [ targetRect, setTargetRect ] = useStateWithPromise(null)
    const [ list, setList ] = useStateWithPromise([]) // TODO : labelList에 넘겨줘야함
    const mousePos = useMousePoint(canvasRef).point

    const { modify, findById } = useData()

    
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
        modify({...data, ...{labels: list}})
    }
    

    const changePaintRectMode = async (param: PAINT_RECT_MODE) => {
        await Promise.all(setPaintRectMode(param))
    }


    
    const handleMouseDown = useCallback((e) => {
        setStart(mousePos)
        setInputCtl({left: mousePos.x, top: start.y, isVisible: false})
        if(list.length === 0) changePaintRectMode(PAINT_RECT_MODE.CREATE)
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
                
     
            }
            // TODO : target의 anchor에 enter시
            //else if(rect){
            //  setPaintRectMode(PAINT_RECT_MODE.RESIZE)
            //}
            else if(   
                rect.position.lt.x * 600 + 4 < mousePos.x && mousePos.x < rect.position.rt.x * 600 - 4
                && rect.position.lt.y * 600 + 4 < mousePos.y && mousePos.y < rect.position.lb.y * 600 - 4){
                
                setTargetRect(rect)
                rect.isSelected = true;
                changePaintRectMode(PAINT_RECT_MODE.MOVE)        
            }
            else if(paintRectMode != PAINT_RECT_MODE.RESIZE){
                changePaintRectMode(PAINT_RECT_MODE.CREATE)
            }
        })
        
        if( PAINT_RECT_MODE.CREATE && canvasRef && canvasRef.current){
            setTargetRect(tempRect)
            setList([...list,tempRect])
            useDrawRect(canvasRef, list)
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
            setInputCtl({left: mousePos.x, top: start.y, isVisible: true})
            inputRef.current.onkeydown = handleKeyPress
            inputRef.current.focus();
        }
        changePaintRectMode(PAINT_RECT_MODE.NONE)
    },[mousePos, canvasRef, inputRef])

    const handleMouseLeave = useCallback((e) => {
        setEnd(mousePos)
        changePaintRectMode(PAINT_RECT_MODE.NONE)
    },[])

    const handleKeyPress = useCallback((e) => {
        if(inputRef && inputRef.current && targetRect && canvasRef && canvasRef.current){
            if (e.keyCode === 13) {
                setInputCtl({left: mousePos.x, top: start.y, isVisible: false})
                list[list.length-1].className = inputRef.current.value
                setList(list)
                useDrawRect(canvasRef, list)
                inputRef.current.value = ""
            }
            else if(e.keyCode === 8 || e.keyCode === 46){
                const newList = list.filter(rect => rect !== targetRect)
                setList(newList)
                useDrawRect(canvasRef, newList)
            }
        }
        changePaintRectMode(PAINT_RECT_MODE.NONE)
    },[inputRef, inputCtl, mousePos, canvasRef, targetRect])

 
    useEffect(()=>{
        if (canvasRef && canvasRef.current) {
            canvasRef.current.addEventListener("mousedown", handleMouseDown )
            canvasRef.current.addEventListener("mousemove", handleMouseMove )
            canvasRef.current.addEventListener("mouseup", handleMouseUp )
            canvasRef.current.addEventListener("mouseleave", handleMouseLeave )
            canvasRef.current.addEventListener("keypress", handleKeyPress )
        }

        return () => {
            if (canvasRef && canvasRef.current) {
                canvasRef.current.removeEventListener("mousedown", handleMouseDown )
                canvasRef.current.removeEventListener("mousemove", handleMouseMove )
                canvasRef.current.removeEventListener("mouseup", handleMouseUp )
                canvasRef.current.addEventListener("mouseleave", handleMouseLeave )
                canvasRef.current.addEventListener("keypress", handleKeyPress )
            }
        }
    },[handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, handleKeyPress])







  

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
                <SInputWrapper {...inputCtl}>
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
