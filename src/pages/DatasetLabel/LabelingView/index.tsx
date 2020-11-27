import React, { useEffect, useRef, useState } from "react"
import { Label, Video } from "~modules/data";
import { styled } from "~styles/themes"
import RectController from './RectController';
import useCreateLabel from "~hooks/useCreateLabel"
import useData from "~hooks/useData"
import useImage from '~hooks/useImage';

export interface ILabels {
    image?: string
    data?: Video
}

function LabelingView(prop: ILabels) {
    const {
        image,
        data
    } = prop;
    const { modify, findById } = useData()

    const [ list, setList ] = useState<Label[]>([])
    const canvasRef = useRef<HTMLCanvasElement>()
    const imageRef = useRef<HTMLCanvasElement>()

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
    
    useImage(imageRef, image)
    useCreateLabel(canvasRef, addLabel)
    이거 통쨰로
    옮긴게아니에요? .git은 뺴고 옮기셧네흑 원본에서 복사를 2개해서
    깃에하나올리고 지금이게 복사2예요
    둘다 복사본...
    
왼쪽께 지금꺼고 오른쪽ㅈ게 깃이거든요...svn만 써봣다하셨죠?네네 그래서 모르시구나
    return(
        <SLabelingView>
            <canvas width="970px" height="594px" style={{position:"absolute"}}
                ref={imageRef}>
            </canvas>
            <canvas width="970px" height="594px" style={{position:"absolute"}}
                ref={canvasRef}>
            </canvas>
            
        </SLabelingView>
    나
}


export default LabelingView

const SLabelingView = styled.div`
    position: relative;
    display: grid;
    width:100%;
    height:100%;
`