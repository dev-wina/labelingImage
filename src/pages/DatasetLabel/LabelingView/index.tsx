import React, { useCallback, useEffect, useRef, useState } from "react"
import { Label, Point, Video } from "~modules/data";
import { styled } from "~styles/themes"
import useData from "~hooks/useData"
import useImage from '~hooks/useImage';
import useImageSize from '~hooks/useImageSize';
import { withProps } from '~styles/themed-components';
import useMousePoint from '~hooks/useMousePoint';
import { ANCHOR, KEYBOARD, PAINT_RECT_MODE } from '~constant';
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


    useEffect(() => {
        if (data) setList(data.labels)
    }, [data])

    const addLabel = (label: Label) => {
        setList([...list, label])
    }

    const handleSave = () => {
        modify({...data, ...{labels: list}})
        
        // if(data){
        //     data.labels = list
        //     modify(data)
        // }
    }


    const changePaintRectMode = async (param: PAINT_RECT_MODE) => {
        await setPaintRectMode(param) //Promise.all([setPaintRectMode(param)])
    }

    const isHitRectCorner = (rect) =>{
        if(!imageRef.current) return

        const img_w = imageRef.current.width
        const img_h = imageRef.current.height
        const lt = rect.position.lt
        const rt = rect.position.rt
        const lb = rect.position.lb
        const rb = rect.position.rb

        if(lt.x * img_w - 4 < mousePos.x && mousePos.x < lt.x * img_w + 4
        && lt.y * img_h - 4 < mousePos.y && mousePos.y < lt.y * img_h + 4){
            setTargetRect(rect)
            setAnchorDirect(ANCHOR.LEFT_TOP)
            return true
        }
        else if(rt.x * img_w - 4 < mousePos.x && mousePos.x < rt.x * img_w + 4
        && rt.y * img_h - 4 < mousePos.y && mousePos.y < rt.y * img_h + 4){
            setTargetRect(rect)
            setAnchorDirect(ANCHOR.RIGHT_TOP)
            return true
        }
        else if(lb.x * img_w - 4 < mousePos.x && mousePos.x < lb.x * img_w + 4
        && lb.y * img_h - 4 < mousePos.y && mousePos.y < lb.y * img_h + 4){
            setTargetRect(rect)
            setAnchorDirect(ANCHOR.LEFT_BOTTOM)
            return true
        }
        else if(rb.x * img_w - 4 < mousePos.x && mousePos.x < rb.x * img_w + 4
        && rb.y * img_h - 4 < mousePos.y && mousePos.y < rb.y * img_h + 4){
            setTargetRect(rect)
            setAnchorDirect(ANCHOR.RIGHT_BOTTOM)
            return true
        }
        return false
    }

    const [ anchorDirect, setAnchorDirect ] = useStateWithPromise(null)
    const isHitRectAnchor = (rect) =>{
        if(!imageRef.current) return

        const img_w = imageRef.current.width
        const img_h = imageRef.current.height
        const lt = rect.position.lt
        const rt = rect.position.rt
        const lb = rect.position.lb
        const rb = rect.position.rb

        if(lt.x * img_w + (((rt.x * img_w) - (lt.x * img_w)) / 2) - 4 < mousePos.x 
        && mousePos.x < lt.x * img_w + (((rt.x * img_w) - (lt.x * img_w)) / 2) + 4
        &&(lt.y * img_h) - 4 < mousePos.y && mousePos.y < (lt.y * img_h) + 4){
            setTargetRect(rect)
            setAnchorDirect(ANCHOR.TOP)
            return true
        }
        else if(lt.x * img_w - 4 < mousePos.x && mousePos.x < lt.x * img_w + 4
        && lt.y * img_h + ((lb.y * img_h - lt.y * img_h) / 2) - 4 < mousePos.y 
        && mousePos.y < lt.y * img_h + ((lb.y * img_h - lt.y * img_h) / 2) + 4){
            setTargetRect(rect)
            setAnchorDirect(ANCHOR.LEFT)
            return true
        }
        else if(lb.x * img_w + ((rb.x * img_w - lb.x * img_w) / 2) - 4 < mousePos.x 
        && mousePos.x < lb.x * img_w + ((rb.x * img_w - lb.x * img_w) / 2) + 4
        && lb.y * img_h - 4 < mousePos.y && mousePos.y < lb.y * img_h + 4){
            setTargetRect(rect)
            setAnchorDirect(ANCHOR.BOTTOM)
            return true
        }
        else if(rt.x * img_w - 4 < mousePos.x && mousePos.x < rt.x * img_w + 4
        && rt.y * img_h + ((rb.y * img_h - rt.y * img_h) / 2) - 4 < mousePos.y 
        && mousePos.y < rt.y * img_h + ((rb.y * img_h - rt.y * img_h) / 2) + 4){
            setTargetRect(rect)
            setAnchorDirect(ANCHOR.RIGHT)
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

        if(lt.x * img_w + 4 < mousePos.x && mousePos.x < rt.x * img_w - 4
        && lt.y * img_h + 4 < mousePos.y && mousePos.y < lb.y * img_h - 4 ){
            setTargetRect(rect)
            return true
        }
        return false
    }

    const checkHitRect = () => {
        list.map((rect)=>{
            rect.isSelected = false
        })
        for(let i = 0 ; i < list.length ; i++){
            //rect 안에 mousePoint hit 시
            if(isHitRect(list[i])){
                list[i].isSelected = true;
                changePaintRectMode(PAINT_RECT_MODE.MOVE)
                return 
            }
            //rect의 꼭짓점에 mousePoint hit 시
            else if (isHitRectCorner(list[i])) {
                list[i].isSelected = true;
                changePaintRectMode(PAINT_RECT_MODE.RESIZE_CORNER)
                return
            }
            // rect의 꼭짓점 제외한 anchor에 enter시
            else if(isHitRectAnchor(list[i])){
                list[i].isSelected = true;
                changePaintRectMode(PAINT_RECT_MODE.RESIZE_ANCHOR)
                return 
            }
        }
        //hit되지 않았을 때
        if(imageRef.current){
            const img_w = imageRef.current.width
            const img_h = imageRef.current.height
            const tempRect = {
                className: "class",  
                position: {
                    lt: { x: start.x / img_w, y: start.y / img_h },
                    rt: { x: mousePos.x / img_w, y: start.y / img_h },
                    lb: { x: start.x / img_w, y: mousePos.y / img_h },
                    rb: { x: mousePos.x / img_w, y: mousePos.y / img_h }
                },
                width: mousePos.x / img_w - start.x / img_w,
                height: mousePos.y / img_h - start.y / img_h,
                isSelected: true
            }
            setTargetRect(tempRect)
            setList([...list,tempRect])
            useDrawRect(canvasRef, list)
            changePaintRectMode(PAINT_RECT_MODE.CREATE)
        }
    }

    const createRect = () => {
        if(imageRef.current){
            const img_w = imageRef.current.width
            const img_h = imageRef.current.height
            list[list.length-1] = {
                className: "class",  
                position: {
                    lt: { x: start.x / img_w, y: start.y / img_h },
                    rt: { x: mousePos.x / img_w, y: start.y / img_h },
                    lb: { x: start.x / img_w, y: mousePos.y / img_h },
                    rb: { x: mousePos.x / img_w, y: mousePos.y / img_h }
                },
                width: mousePos.x / img_w - start.x / img_w,
                height: mousePos.y / img_h - start.y / img_h,
                isSelected: true
            }
            setTargetRect(list[list.length-1])
            useDrawRect(canvasRef, list)
        }
    }

    const resizeRectCorner = () => {
        for(let i = 0 ; i < list.length ; i++){
            if(list[i] === targetRect && imageRef.current){
                const img_w = imageRef.current.width
                const img_h = imageRef.current.height
                const lt = list[i].position.lt
                const rt = list[i].position.rt
                const lb = list[i].position.lb
                const rb = list[i].position.rb
                if(anchorDirect === ANCHOR.LEFT_TOP){
                    list[i].position = {
                        lt: { x: mousePos.x / img_w, y: mousePos.y / img_h },
                        rt: { x: rt.x, y: mousePos.y / img_h },
                        lb: { x: mousePos.x / img_w, y: lb.y },
                        rb: { x: rb.x , y: rb.y }
                    }
                }
                else if(anchorDirect === ANCHOR.LEFT_BOTTOM){
                    list[i].position = {
                        lt: { x: mousePos.x / img_w, y: lt.y},
                        rt: { x: rt.x, y: rt.y },
                        lb: { x: mousePos.x / img_w, y: mousePos.y / img_h },
                        rb: { x: rb.x , y: mousePos.y / img_h }
                    }
                }
                else if(anchorDirect === ANCHOR.RIGHT_TOP){
                    list[i].position = {
                        lt: { x: lt.x, y: mousePos.y / img_h},
                        rt: { x: mousePos.x / img_w, y: mousePos.y / img_h },
                        lb: { x: lb.x, y: lb.y },
                        rb: { x: mousePos.x / img_w , y: rb.y }
                    }
                }
                else if(anchorDirect === ANCHOR.RIGHT_BOTTOM){
                    list[i].position = {
                        lt: { x: lt.x, y: lt.y},
                        rt: { x: mousePos.x / img_w, y: lt.y },
                        lb: { x: lt.x, y: mousePos.y / img_h },
                        rb: { x: mousePos.x / img_w, y: mousePos.y / img_h }
                    }
                }

                list[i].width = rt.x - lt.x 
                list[i].height = rt.y - lt.y
                setTargetRect(list[i])
                break
            }
        }
        useDrawRect(canvasRef, list)
    }

    const resizeRectAnchor = () => {
        for(let i = 0 ; i < list.length ; i++){
            if(list[i] === targetRect && imageRef.current){
                const img_w = imageRef.current.width
                const img_h = imageRef.current.height
                const lt = list[i].position.lt
                const rt = list[i].position.rt
                const lb = list[i].position.lb
                const rb = list[i].position.rb
                if(anchorDirect === ANCHOR.TOP){
                    list[i].position = {
                        lt: { x: lt.x, y: mousePos.y / img_h },
                        rt: { x: rt.x, y: mousePos.y / img_h },
                        lb: { x: lb.x, y: lb.y },
                        rb: { x: rb.x , y: rb.y }
                    }
                    list[i].height = lb.y - lt.y 
                }
                else if(anchorDirect === ANCHOR.LEFT){
                    list[i].position = {
                        lt: { x: mousePos.x / img_w, y: lt.y},
                        rt: { x: rt.x, y: rt.y },
                        lb: { x: mousePos.x / img_w, y: lb.y },
                        rb: { x: rb.x , y: rb.y }
                    }
                    list[i].width = rt.x - lt.x 
                }
                else if(anchorDirect === ANCHOR.BOTTOM){
                    list[i].position = {
                        lt: { x: lt.x, y: lt.y},
                        rt: { x: rt.x, y: rt.y },
                        lb: { x: lb.x, y: mousePos.y / img_h },
                        rb: { x: rb.x , y: mousePos.y / img_h }
                    }
                    list[i].height = lb.y - lt.y 
                }
                else if(anchorDirect === ANCHOR.RIGHT){
                    list[i].position = {
                        lt: { x: lt.x, y: lt.y},
                        rt: { x: mousePos.x / img_w, y: rt.y },
                        lb: { x: lb.x, y: lb.y },
                        rb: { x: mousePos.x / img_w, y: rb.y }
                    }
                    list[i].width = rt.x - lt.x 
                }
                setTargetRect(list[i])
                break
            }
        }
        useDrawRect(canvasRef, list)
    }

    const moveRect = () => {
        for(let i = 0 ; i < list.length ; i++){
            if(list[i] === targetRect && imageRef.current){
                const img_w = imageRef.current.width
                const img_h = imageRef.current.height
                list[i].position = {
                    lt: { x: mousePos.x / img_w, y: mousePos.y / img_h},
                    rt: { x: mousePos.x / img_w + list[i].width, y: mousePos.y / img_h },
                    lb: { x: mousePos.x / img_w, y: mousePos.y / img_h + list[i].height },
                    rb: { x: mousePos.x / img_w + list[i].width, y: mousePos.y / img_h + list[i].height }
                }
                setTargetRect(list[i])
                break
            }
        }
        useDrawRect(canvasRef, list)
    }

    const inputClassName = () => {
        // TODO : setInputCtl에 들어갈 left top 수정
        setInputCtl({left: mousePos.x, top: start.y, isVisible: true})
        inputRef.current.onkeydown = handleKeyPress
        inputRef.current.focus();
    }



    const handleMouseDown = useCallback((e) => {
        console.log(list)
        setStart(mousePos)
        setInputCtl({left: mousePos.x, top: start.y, isVisible: false})
        if(list.length === 0){
            if(imageRef.current){
                const img_w = imageRef.current.width
                const img_h = imageRef.current.height
                const tempRect = {
                    className: "class",  
                    position: {
                        lt: { x: start.x / img_w, y: start.y / img_h },
                        rt: { x: mousePos.x / img_w, y: start.y / img_h },
                        lb: { x: start.x / img_w, y: mousePos.y / img_h },
                        rb: { x: mousePos.x / img_w, y: mousePos.y / img_h }
                    },
                    width: mousePos.x / img_w - start.x / img_w,
                    height: mousePos.y / img_h - start.y / img_h,
                    isSelected: true
                }
                setTargetRect(tempRect)
                setList([...list,tempRect])
                useDrawRect(canvasRef, list)
                changePaintRectMode(PAINT_RECT_MODE.CREATE)
            }
        }
        else {
            checkHitRect()
        }
    },[paintRectMode, mousePos, targetRect, start, imageRef])

     const handleImageMove = useCallback((e) => {
         if(!image) return
            const img = new Image()
            img.src = image
            img.onload = () => {
            imageRef.current?.getContext('2d')?.drawImage(img, mousePos.x, mousePos.y)
        } 
    },[paintRectMode, mousePos, targetRect, start, imageRef, image])

    const handleMouseMove = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if(canvasRef.current){
            if(paintRectMode === PAINT_RECT_MODE.CREATE){
                createRect()
            }
            else if(paintRectMode === PAINT_RECT_MODE.RESIZE_CORNER){
                resizeRectCorner()
            }
            else if(paintRectMode === PAINT_RECT_MODE.RESIZE_ANCHOR){
                resizeRectAnchor()
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
        handleSave()
    },[mousePos, canvasRef, inputRef])


    const handleMouseLeave = useCallback((e) => {
        setEnd(mousePos)
        changePaintRectMode(PAINT_RECT_MODE.NONE)
    },[])



    const handleKeyPress = useCallback((e) => {
        if(inputRef.current && targetRect && canvasRef.current && imageRef.current){
            if (e.keyCode === KEYBOARD.ENTER) {
                setInputCtl({left: mousePos.x, top: start.y, isVisible: false})
                
                if(paintRectMode === PAINT_RECT_MODE.CREATE){
                    list[list.length-1].className = inputRef.current.value
                }
                else{
                    list.map((rect)=>{
                        if(rect === targetRect){
                            rect.className = inputRef.current.value
                        }
                    })
                }
                useDrawRect(canvasRef, list)
                inputRef.current.value = ""
            }
            else if(e.keyCode === KEYBOARD.BACKSPACE
                 || e.keyCode === KEYBOARD.DEL){
                setInputCtl({left: mousePos.x, top: start.y, isVisible: false})
                const newList = list.filter(rect => rect !== targetRect)
                setList(newList)
                useDrawRect(canvasRef, newList)
            }
            // TODO : 따로 뺄 것
            else if (e.keyCode === KEYBOARD.SPACEBAR) {
                imageRef.current.onmousemove = handleImageMove
                imageRef.current.focus();
            }
            modify({...data, ...{labels: list}})
        }
        changePaintRectMode(PAINT_RECT_MODE.NONE)
    },[inputRef, inputCtl, mousePos, canvasRef, targetRect])


    useEffect(()=>{
        if (canvasRef.current) {
            canvasRef.current.addEventListener("mousedown", handleMouseDown )
            canvasRef.current.addEventListener("mousemove", handleMouseMove )
            canvasRef.current.addEventListener("mouseup", handleMouseUp )
            canvasRef.current.addEventListener("mouseleave", handleMouseLeave )
            canvasRef.current.addEventListener("keypress", handleKeyPress )
        }

        return () => {
            if (canvasRef.current) {
                canvasRef.current.removeEventListener("mousedown", handleMouseDown )
                canvasRef.current.removeEventListener("mousemove", handleMouseMove )
                canvasRef.current.removeEventListener("mouseup", handleMouseUp )
                canvasRef.current.addEventListener("mouseleave", handleMouseLeave )
                canvasRef.current.addEventListener("keypress", handleKeyPress )
            }
        }
    },[handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, handleKeyPress])

    useImage(imageRef, image)
    //useCreateLabel(canvasRef, imageRef, inputRef, addLabel)

    return(
        <SLabelingView>
            <SImageWapper>
                <canvas width="970px" height="594px" style={{position:"absolute"}}
                ref={canvasRef}/>
                <img src={image} ref={imageRef}/>
            </SImageWapper>
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

const SImageWapper = styled.div`
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
