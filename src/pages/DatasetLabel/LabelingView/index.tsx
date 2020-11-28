import React, { useEffect, useRef, useState } from "react"
import { Label, Video } from "~modules/data";
import { styled } from "~styles/themes"
import useCreateLabel from "~hooks/useCreateLabel"
import useData from "~hooks/useData"
import useImage from '~hooks/useImage';
import useImageSize from '~hooks/useImageSize';

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
    
    const inputText = () => {
        return <SInput></SInput>
    }
    
    useImage(imageRef, image)
    useImageSize(image)
    useCreateLabel(canvasRef, addLabel)

    return(
        <SLabelingView>
            <canvas width="970px" height="594px" style={{position:"absolute"}}
                ref={imageRef}>
            </canvas>
            <canvas width="970px" height="594px" style={{position:"absolute"}}
                ref={canvasRef}>
            </canvas>
            <input className="classInput" type="text" name="class"  style={{backgroundColor:"red", position:"absolute"}}></input>
        </SLabelingView>
}


export default LabelingView

const SLabelingView = styled.div`
    position: relative;
    display: grid;
    width:100%;
    height:100%;
`