import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from "react"
import { styled } from "~styles/themes"
import { faSquare } from "@fortawesome/free-regular-svg-icons"
import { faMousePointer } from "@fortawesome/free-solid-svg-icons"
import { withProps } from '~styles/themed-components'

interface ITools {
    tool: number
    setTool: (tool: number) => void
}

const tools = [
    { icon: faMousePointer },
    { icon: faSquare }
]

function Tools(props: ITools) {
    const {
        tool,
        setTool
    } = props
    
    return(
        <STools>
            {
                tools.map((tools, index) =>
                
                    <SButton key={index} active={index === tool} onClick={() => setTool(tool === index ? -1 : index)}>
                        <FontAwesomeIcon icon={tools.icon} />
                    </SButton>
                )
            }
        </STools>
    )
}

export default Tools 

const STools = styled.div`
    border: thin solid #edeff3;
    background-color: #fafafa;
    flex-direction: column;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height:100%;
`

const SButton = withProps<{ active: boolean }, HTMLButtonElement>(styled.button)`
    justify-content: center;
    margin: 3pt;
    padding: 5pt;
    width: 25pt;
    height: 25pt;
    border-radius: 5px;
    background-color: ${props => props.active ? props.theme.color.BtnActive : props.theme.color.BtnDefault};
    &:hover { 
        background-color: #d5d9e2;
    }
`