import React, { useCallback, useEffect, useRef, useState } from "react"
import { Label, Point, Video } from "~modules/data";
import { styled } from "~styles/themes"
import useCreateLabel from "~hooks/useCreateLabel"
import useData from "~hooks/useData"
import useImage from '~hooks/useImage';
import useImageSize from '~hooks/useImageSize';
import { withProps } from '~styles/themed-components';
import useMousePoint from '~hooks/useMousePoint';
import { PAINT_RECT_MODE } from '~constant';
import useDrawRect from '~hooks/useDrawRect';

export interface ILabels {
    image?: string
    data?: Video
}

export interface ISInput {
    left: number
    top: number
}

function LabelingView(prop: ILabels) {
    const {
        image,
        data
    } = prop;
    const { modify, findById } = useData()

    const tempRect: IRect = {
        lt: {x: 0, y: 0}, 
        rt: {x: 0, y: 0}, 
        lb: {x: 0, y: 0}, 
        rb: {x: 0, y:0}, 
        selected: false
    }
    
    const [ list, setList ] = useState<Label[]>([])
    const canvasRef = useRef<HTMLCanvasElement>()
    const imageRef = useRef<HTMLCanvasElement>()
    const inputRef = useRef<HTMLInputElement>()
    const [ isInputVisible, setInputVisibility ] = useState<boolean>(true)
    const [ start, setStart ] = useState<Point>({x: 0, y: 0})
    const [ end, setEnd ] = useState<Point>({x: 0, y: 0})
    const [ temp, setTemp ] = useState<Label>()
    const [ paintRectMode, setPaintRectMode ] = useState<PAINT_RECT_MODE>(PAINT_RECT_MODE.NONE)
    const mousePos = useMousePoint(canvasRef).point

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
    
  

    const [ lefttop, setLefttop ]  = useState<ISInput>({ left: 100, top: 100 })
    

    const handleMouseDown = useCallback((e) => {
        setStart(mousePos)
        setPaintRectMode(PAINT_RECT_MODE.CREATE)
        if(canvasRef && canvasRef.current){
            const context = canvasRef.current.getContext('2d')
            const _temp: Label = { 
                name: list?`${(parseInt(list[list.length-1].name)+1)}`:"1",
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
                useDrawRect(canvasRef, list)
            }
        }
        
    },[paintRectMode, mousePos, temp, start])

    const handleMouseMove = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if(paintRectMode == PAINT_RECT_MODE.CREATE && canvasRef && canvasRef.current){
            const canvas: HTMLCanvasElement = canvasRef.current
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
                useDrawRect(canvasRef, list)
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

    const handleMouseUp = useCallback((e) => {
        setEnd(mousePos)
        if(inputRef && inputRef.current){
            // TODO : SInputWrapper visibility true로 변경
            setLefttop({left: mousePos.x, top: mousePos.y})
            inputRef.current.onkeydown = handleEnter
            inputRef.current.focus();
        }
        
        setPaintRectMode(PAINT_RECT_MODE.NONE)
    },[mousePos, canvasRef, inputRef])

    const handleMouseLeave = useCallback((e) => {
        setEnd(mousePos)
        setPaintRectMode(PAINT_RECT_MODE.NONE)
    },[])

    function handleEnter(e) {
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            // TODO : SInputWrapper visibility false로 변경
            // TODO : 해당 rect의 class name에 SInput의 text 넣어주기
        }
    }

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
    },[handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave])

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
                    <SInput ref={inputRef} type="text" name="class"/>
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
    display: grid;
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
