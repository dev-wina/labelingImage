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
    const inputRef = useRef<HTMLInputElement>()
    const [ isInputVisible, setInputVisibility ] = useState<boolean>(true)

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
            {
                isInputVisible? 
                <SInputWrapper>
                    <SInput ref={inputRef} type="text" name="class" />
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

const SInputWrapper = styled.div`
    z-index: 2;
    position: "absolute";
    display: grid;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    border-color: #A1ACC4;
    border-width: 1px;
    border-radius: 50px;
    width: 177px;
    height: 32px;
`

const SInput = styled.div`
    position: "absolute";
    width: 147px;
    height: 22px; 
    left: 15px;
    top: 5px;
`
