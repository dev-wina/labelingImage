import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Label } from '~modules/data'
import { withProps } from '~styles/themed-components'

function Rect(props: Label){
    const {
        name,
        position,
        width,
        height,
    } = props

    useEffect(()=>{
    },[props])

    return(
        <SRect {...props} />
    )
}
export default Rect

//width나 height가 음수일 때 
//bottom, left에 기준점을 주고 상자를 움직여야할 것 같다
const SRect = withProps<Label, HTMLDivElement>(styled.div)`
    position: absolute;
    top: ${props => props.position.y}%;
    left: ${props => props.position.x}%;
    border: 3px solid red;
    width: ${props => props.width}%;
    height: ${props => props.height}%;
    :hover{ 
        border: 3px solid blue;
    }
`
