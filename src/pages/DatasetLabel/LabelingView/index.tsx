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
    tool: number
}

export interface ISInput {
    left: number
    top: number
    isVisible: boolean
}

function LabelingView(prop: ILabels) {
    const {
        image,
        data,
        tool //mouse mode
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
        useDrawRect(canvasRef, list)
        window.onkeydown = handleKeyPress
        window.focus();
        
    }, [data, tool])

    const addLabel = (label: Label) => {
        setList([...list, label])
    }

    const handleSave = () => {
        modify({...data, ...{labels: list}})
    }


    const changePaintRectMode = async (param: PAINT_RECT_MODE) => {
        await setPaintRectMode(param) //Promise.all([setPaintRectMode(param)])
    }

    const changeTargetRect = async (rect) => {
        await setTargetRect(rect) //Promise.all([setPaintRectMode(param)])
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
            changeTargetRect(rect)
            setAnchorDirect(ANCHOR.LEFT_TOP)
            return true
        }
        else if(rt.x * img_w - 4 < mousePos.x && mousePos.x < rt.x * img_w + 4
        && rt.y * img_h - 4 < mousePos.y && mousePos.y < rt.y * img_h + 4){
            changeTargetRect(rect)
            setAnchorDirect(ANCHOR.RIGHT_TOP)
            return true
        }
        else if(lb.x * img_w - 4 < mousePos.x && mousePos.x < lb.x * img_w + 4
        && lb.y * img_h - 4 < mousePos.y && mousePos.y < lb.y * img_h + 4){
            changeTargetRect(rect)
            setAnchorDirect(ANCHOR.LEFT_BOTTOM)
            return true
        }
        else if(rb.x * img_w - 4 < mousePos.x && mousePos.x < rb.x * img_w + 4
        && rb.y * img_h - 4 < mousePos.y && mousePos.y < rb.y * img_h + 4){
            changeTargetRect(rect)
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
            changeTargetRect(rect)
            setAnchorDirect(ANCHOR.TOP)
            return true
        }
        else if(lt.x * img_w - 4 < mousePos.x && mousePos.x < lt.x * img_w + 4
        && lt.y * img_h + ((lb.y * img_h - lt.y * img_h) / 2) - 4 < mousePos.y 
        && mousePos.y < lt.y * img_h + ((lb.y * img_h - lt.y * img_h) / 2) + 4){
            changeTargetRect(rect)
            setAnchorDirect(ANCHOR.LEFT)
            return true
        }
        else if(lb.x * img_w + ((rb.x * img_w - lb.x * img_w) / 2) - 4 < mousePos.x 
        && mousePos.x < lb.x * img_w + ((rb.x * img_w - lb.x * img_w) / 2) + 4
        && lb.y * img_h - 4 < mousePos.y && mousePos.y < lb.y * img_h + 4){
            changeTargetRect(rect)
            setAnchorDirect(ANCHOR.BOTTOM)
            return true
        }
        else if(rt.x * img_w - 4 < mousePos.x && mousePos.x < rt.x * img_w + 4
        && rt.y * img_h + ((rb.y * img_h - rt.y * img_h) / 2) - 4 < mousePos.y 
        && mousePos.y < rt.y * img_h + ((rb.y * img_h - rt.y * img_h) / 2) + 4){
            changeTargetRect(rect)
            setAnchorDirect(ANCHOR.RIGHT)
            return true
        }
        return false
    }
    const isHitDegreeAnchor = (rect) =>{
        if(!imageRef.current) return

        const img_w = imageRef.current.width
        const img_h = imageRef.current.height
        const lt = rect.position.lt
        const rt = rect.position.rt

        const centerx = (lt.x * img_w + (((rt.x * img_w) - (lt.x * img_w)) / 2));
        const centery = ((lt.y * img_h) - 18); // TODO : 18 빼고 degree적용해야 함
        if(Math.pow(4, 2) > (Math.pow(centerx - mousePos.x, 2) + Math.pow(centery - mousePos.y, 2))){
            changeTargetRect(rect)
            setAnchorDirect(ANCHOR.CIRCLE)
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
            changeTargetRect(rect)
            return true
        }
        return false
    }

    const checkHitRect = () => {
        if(tool === 0){
            list.map((rect)=>{
                rect.isSelected = false
            })
        }
        for(let i = 0 ; i < list.length ; i++){
            //rect 안에 mousePoint hit 시
            if(isHitRect(list[i])){
                list[i].isSelected = true;
                setList(list)
                useDrawRect(canvasRef, list)
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
            else if(isHitDegreeAnchor(list[i])){
                list[i].isSelected = true;
                const lt = list[i].position.lt
                const rt = list[i].position.rt
                const rb = list[i].position.rb
                const cx = lt.x + ((rt.x - lt.x) / 2)
                const cy = rt.y + ((rb.y - rt.y) / 2)
                setStart({x:cx, y:cy})
                changePaintRectMode(PAINT_RECT_MODE.TILT)
                return 
            }
        }
        //hit되지 않았을 때
        if(tool === 0 && imageRef.current){
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
                degree: 0,
                isSelected: true
            }
            changeTargetRect(tempRect)
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
                degree: 0,
                isSelected: true
            }
            changeTargetRect(list[list.length-1])
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
                changeTargetRect(list[i])
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
                changeTargetRect(list[i])
                break
            }
        }
        useDrawRect(canvasRef, list)
    }

    const moveRect = () => {
        // TODO : rect에 마우스 hit 된 지점이 그대로 고정되도록 수정
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
                changeTargetRect(list[i])
                break
            }
        }
        useDrawRect(canvasRef, list)
    }

    const tiltRect = () => {
        for(let i = 0 ; i < list.length ; i++){
            if(list[i] === targetRect && imageRef.current){
                const img_w = imageRef.current.width
                const img_h = imageRef.current.height
                const lt = list[i].position.lt
                const rt = list[i].position.rt
                const lb = list[i].position.lb
                const rb = list[i].position.rb
                
                // TODO : 각도계산
                // cx, cy - rect의 중심
                const cx = start.x
                const cy = start.y
                let degree: number = 0
                if(cx < mousePos.x){
                    degree = 0.01
                }
                else{
                    degree = - 0.01
                }

                list[i].position = {
                    lt: { x: cx + (Math.cos(degree) * (lt.x - cx) - Math.sin(degree) * (lt.y - cy)),   y: cy + (Math.sin(degree) * (lt.x - cx) + Math.cos(degree) * (lt.y - cy)) },
                    rt: { x: cx + (Math.cos(degree) * (rt.x - cx) - Math.sin(degree) * (rt.y - cy)),   y: cy + (Math.sin(degree) * (rt.x - cx) + Math.cos(degree) * (rt.y - cy)) },
                    lb: { x: cx + (Math.cos(degree) * (lb.x - cx) - Math.sin(degree) * (lb.y - cy)),   y: cy + (Math.sin(degree) * (lb.x - cx) + Math.cos(degree) * (lb.y - cy)) },
                    rb: { x: cx + (Math.cos(degree) * (rb.x - cx) - Math.sin(degree) * (rb.y - cy)),   y: cy + (Math.sin(degree) * (rb.x - cx) + Math.cos(degree) * (rb.y - cy)) }
                }
                list[i].degree = Math.atan2((start.x * img_w - mousePos.x), (start.y * img_h - mousePos.y)) * 180 / Math.PI
                changeTargetRect(list[i])
                break
            }
        }
        useDrawRect(canvasRef, list)
    }

    const inputClassName = () => {
        // TODO : setInputCtl에 들어갈 left top 수정
        setInputCtl({left: mousePos.x, top: start.y, isVisible: true})
        inputRef.current.focus();
    }



    const handleMouseDown = useCallback((e) => {
        setStart(mousePos)
        setInputCtl({left: mousePos.x, top: start.y, isVisible: false})
        if(tool === 0){
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
                    changeTargetRect(tempRect)
                    setList([...list,tempRect])
                    useDrawRect(canvasRef, list)
                    changePaintRectMode(PAINT_RECT_MODE.CREATE)
                }
            }
            else {
                checkHitRect()
            }
        }
        else{ //다중선택모드
            checkHitRect()
            window.onkeydown = handleKeyPress
            window.focus();
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
                resizeRectCorner()
            }
            else if(paintRectMode === PAINT_RECT_MODE.RESIZE_ANCHOR){
                resizeRectAnchor()
            }
            else if(paintRectMode === PAINT_RECT_MODE.MOVE){
                moveRect()
            }
            else if(paintRectMode === PAINT_RECT_MODE.TILT){
                tiltRect()
            }
        }
    },[paintRectMode, mousePos, start, imageRef])


    const handleMouseUp = useCallback((e) => {
        setEnd(mousePos)
        if(tool === 0)
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
                modify({...data, ...{labels: list}})
            }
            else if(e.keyCode === KEYBOARD.BACKSPACE
                 || e.keyCode === KEYBOARD.DEL){
                setInputCtl({left: mousePos.x, top: start.y, isVisible: false})
                const newList = list.filter(rect => !rect.isSelected)
                modify({...data, ...{labels: newList}})
                setList(newList)
                useDrawRect(canvasRef, newList)
            } 
        }
        changePaintRectMode(PAINT_RECT_MODE.NONE)
    },[inputRef, inputCtl, mousePos, canvasRef, targetRect, list])


    const handleSpaceKeyPress = useCallback((e) => {
        if (e.keyCode === KEYBOARD.SPACEBAR) {
            window.onmousemove = handleImageMove
            window.focus();
        }
        changePaintRectMode(PAINT_RECT_MODE.NONE)
    },[inputRef, inputCtl, mousePos, canvasRef, targetRect, start, list])


    const handleImageMove = useCallback((e) => {
         if(!image) return
            const img = new Image()
            img.src = image
            img.onload = () => {
            imageRef.current?.getContext('2d')?.drawImage(img, mousePos.x, mousePos.y)
        } 
    },[paintRectMode, mousePos, targetRect, start, imageRef, image])


    useEffect(()=>{
        if (canvasRef.current && imageRef.current) {
            canvasRef.current.addEventListener("mousedown", handleMouseDown )
            canvasRef.current.addEventListener("mousemove", handleMouseMove )
            canvasRef.current.addEventListener("mouseup", handleMouseUp )
            canvasRef.current.addEventListener("mouseleave", handleMouseLeave )
            canvasRef.current.addEventListener("keypress", handleKeyPress )

            window.addEventListener("keypress", handleSpaceKeyPress )
        }

        return () => {
            if (canvasRef.current && imageRef.current) {
                canvasRef.current.removeEventListener("mousedown", handleMouseDown )
                canvasRef.current.removeEventListener("mousemove", handleMouseMove )
                canvasRef.current.removeEventListener("mouseup", handleMouseUp )
                canvasRef.current.removeEventListener("mouseleave", handleMouseLeave )
                canvasRef.current.removeEventListener("keypress", handleKeyPress )
                
                window.removeEventListener("keypress", handleSpaceKeyPress )
            }
        }
    },[handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, handleKeyPress, handleSpaceKeyPress])


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
