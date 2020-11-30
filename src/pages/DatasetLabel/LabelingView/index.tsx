import React, { useCallback, useEffect, useRef, useState } from "react"
import { Label, Point, Video } from "~modules/data";
import { styled } from "~styles/themes"
import useData from "~hooks/useData"
import useImage from '~hooks/useImage';
import useImageSize from '~hooks/useImageSize';
import { withProps } from '~styles/themed-components';
import useMousePoint from '~hooks/useMousePoint';
import { KEYBOARD, PAINT_RECT_MODE } from '~constant';
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

    const mousePos = useMousePoint(canvasRef).point
    const [ start, setStart ] = useStateWithPromise({x: 0, y: 0})
    const [ end, setEnd ] = useStateWithPromise({x: 0, y: 0})

    const [ targetRect, setTargetRect ] = useStateWithPromise(null)
    const [ list, setList ] = useStateWithPromise([]) // TODO : labelList에 넘겨줘야함

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

    const isHitRectCorner = (rect) =>{
        if(!imageRef.current) return

        const img_w = imageRef.current.width
        const img_h = imageRef.current.height
        const lt = rect.position.lt
        const rt = rect.position.rt
        const lb = rect.position.lb
        const rb = rect.position.rb

        if(lt.x * img_w - 4 < mousePos.x && mousePos.x < lt.x *  img_w + 4 
        && lt.y * img_h - 4 < mousePos.y && mousePos.y < lt.y * img_h + 4 
        || rt.x * img_w - 4 < mousePos.x && mousePos.x < rt.x * img_w + 4 
        && rt.y * img_h - 4 < mousePos.y && mousePos.y < rt.y * img_h + 4 
        || lb.x * img_w - 4 < mousePos.x && mousePos.x < lb.x * img_w + 4 
        && lb.y * img_h - 4 < mousePos.y && mousePos.y < lb.y * img_h + 4 
        || rb.x * img_w - 4 < mousePos.x && mousePos.x < rb.x * img_w + 4 
        && rb.y * img_h - 4 < mousePos.y && mousePos.y < rb.y * img_h + 4){
            return true
        }
        return false
    }

    const isHitRectAnchor = (rect) =>{
        if(!imageRef.current) return

        const img_w = imageRef.current.width
        const img_h = imageRef.current.height
        const lt = rect.position.lt
        const rt = rect.position.rt
        const lb = rect.position.lb
        const rb = rect.position.rb

        if(lt.x * img_w + (((rt.x * img_w) - (lt.x * img_w)) / 2) - 4, (lt.y * img_h) - 4
        && lt.x * img_w + (((rt.x * img_w) - (lt.x * img_w)) / 2) + 4, (lt.y * img_h) - 4
        && lt.x * img_w + (((rt.x * img_w) - (lt.x * img_w)) / 2) + 4, (lt.y * img_h) + 4
        && lt.x * img_w + (((rt.x * img_w) - (lt.x * img_w)) / 2) - 4, (lt.y * img_h) + 4
        || lt.x * img_w - 4, lt.y * img_h + ((lb.y * img_h - lt.y * img_h) / 2) - 4
        && lt.x * img_w + 4, lt.y * img_h + ((lb.y * img_h - lt.y * img_h) / 2) - 4
        && lt.x * img_w + 4, lt.y * img_h + ((lb.y * img_h - lt.y * img_h) / 2) + 4
        && lt.x * img_w - 4, lt.y * img_h + ((lb.y * img_h - lt.y * img_h) / 2) + 4
        || lb.x * img_w + ((rb.x * img_w - lb.x * img_w) / 2) - 4, lb.y * img_h - 4
        && lb.x * img_w + ((rb.x * img_w - lb.x * img_w) / 2) + 4, lb.y * img_h - 4
        && lb.x * img_w + ((rb.x * img_w - lb.x * img_w) / 2) + 4, lb.y * img_h + 4
        && lb.x * img_w + ((rb.x * img_w - lb.x * img_w) / 2) - 4, lb.y * img_h + 4
        || rt.x * img_w - 4, rt.y * img_h + ((rb.y * img_h - rt.y * img_h) / 2) - 4
        && rt.x * img_w + 4, rt.y * img_h + ((rb.y * img_h - rt.y * img_h) / 2) - 4
        && rt.x * img_w + 4, rt.y * img_h + ((rb.y * img_h - rt.y * img_h) / 2) + 4
        && rt.x * img_w - 4, rt.y * img_h + ((rb.y * img_h - rt.y * img_h) / 2) + 4 ){
            return true
        }
        return false
    }

    const isHitRect = (rect) =>{
        if(!imageRef.current) return

        const img_w = imageRef.current.width
        const img_h = imageRef.current.height
        const lt = rect.position.lt
        const rt = rect.position.rt
        const lb = rect.position.lb
        const rb = rect.position.rb

        if(lt.x * img_w + 4 < mousePos.x && mousePos.x < rt.x * img_w - 4
        && lt.y * img_h + 4 < mousePos.y && mousePos.y < lb.y * img_h - 4 ){
            return true
        }
        return false
    }

    const checkHitRect = () => {
        list.map((rect)=>{
            //rect의 꼭짓점에 mousePoint hit 시
            if (isHitRectCorner(rect)) {
                setTargetRect(rect)
                rect.isSelected = true;
                setPaintRectMode(PAINT_RECT_MODE.RESIZE_CORNER)
            }
            // rect의 꼭짓점 제외한 anchor에 enter시
            else if(isHitRectAnchor(rect)){
                setTargetRect(rect)
                rect.isSelected = true;
                setPaintRectMode(PAINT_RECT_MODE.RESIZE_ANCHOR)
            }
            //rect 안에 mousePoint hit 시
            else if(isHitRect(rect)){
                setTargetRect(rect)
                rect.isSelected = true;
                changePaintRectMode(PAINT_RECT_MODE.MOVE)        
            }
        })
        //hit되지 않았을 때
        if(paintRectMode == PAINT_RECT_MODE.NONE)
            changePaintRectMode(PAINT_RECT_MODE.CREATE)
    }

    const createRect = () => {
        list[list.length-1] = tempRect
        setTargetRect(list[list.length-1])
        useDrawRect(canvasRef, list)
    }

    const resizeRect = () => {
        list.map((rect)=>{
            if(rect === targetRect && imageRef.current){
                const img_w = imageRef.current.width
                const img_h = imageRef.current.height
                const lt = rect.position.lt
        
                rect.position = {
                        lt: { x: lt.x, y: lt.y},
                        rt: { x: mousePos.x / img_w, y: lt.y },
                        lb: { x: lt.x, y: mousePos.y / img_h },
                        rb: { x: mousePos.x / img_w, y: mousePos.y / img_h }
                    }
                setTargetRect(rect)
            }
        })
        useDrawRect(canvasRef, list)
    }

    const moveRect = () => {
        list.map((rect)=>{
            if(rect === targetRect && imageRef.current){
                const img_w = imageRef.current.width
                const img_h = imageRef.current.height
                rect.position = {
                        lt: { x: mousePos.x / img_w, y: mousePos.y / img_h},
                        rt: { x: mousePos.x / img_w + rect.width, y: mousePos.y / img_h },
                        lb: { x: mousePos.x / img_w, y: mousePos.y / img_h + rect.height },
                        rb: { x: mousePos.x / img_w + rect.width, y: mousePos.y / img_h + rect.height }
                    }
                setTargetRect(rect)
            }
        })
        useDrawRect(canvasRef, list)
    }

    const inputClassName = () => {
        if(!inputRef.current) return

        setInputCtl({left: mousePos.x, top: start.y, isVisible: true})
        inputRef.current.onkeydown = handleKeyPress
        inputRef.current.focus();
    }    



    const handleMouseDown = useCallback((e) => {
        setStart(mousePos)
        setInputCtl({left: mousePos.x, top: start.y, isVisible: false})
        
        list.length !== 0? checkHitRect() : changePaintRectMode(PAINT_RECT_MODE.CREATE)

        if( PAINT_RECT_MODE.CREATE && canvasRef && canvasRef.current){
            setTargetRect(tempRect)
            setList([...list,tempRect])
            useDrawRect(canvasRef, list)
        }
        
    },[paintRectMode, mousePos, targetRect, start, imageRef])


    const handleMouseMove = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if(canvasRef.current){
            if(paintRectMode === PAINT_RECT_MODE.CREATE){
                createRect()
            }
            else if(paintRectMode === PAINT_RECT_MODE.RESIZE_CORNER){
                resizeRect()
            }
            else if(paintRectMode === PAINT_RECT_MODE.MOVE){
                moveRect()
            }
        }
    },[paintRectMode, mousePos, start, imageRef])


    const handleMouseUp = useCallback((e) => {
        setEnd(mousePos)
        inputClassName()
        changePaintRectMode(PAINT_RECT_MODE.NONE)
    },[mousePos, canvasRef, inputRef])


    const handleMouseLeave = useCallback((e) => {
        setEnd(mousePos)
        changePaintRectMode(PAINT_RECT_MODE.NONE)
    },[])

    

    const handleKeyPress = useCallback((e) => {
        if(inputRef.current && targetRect && canvasRef.current){
            alert(e.keyCode)
            if (e.keyCode === KEYBOARD.ENTER) {
                setInputCtl({left: mousePos.x, top: start.y, isVisible: false})
                list[list.length-1].className = inputRef.current.value
                setList(list)
                useDrawRect(canvasRef, list)
                inputRef.current.value = ""
            }
            else if(e.keyCode === KEYBOARD.BACKSPACE 
                 || e.keyCode === KEYBOARD.DEL){
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
    
    // TODO : 현재 imageRef의 W,H는 canvas의 크기를 가져오고 있다. image의 크기로 바꿔야함
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
