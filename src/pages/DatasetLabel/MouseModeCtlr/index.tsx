import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from "react"
import { styled } from "~styles/themes"
import { faSquare } from "@fortawesome/free-regular-svg-icons"
import { faMousePointer } from "@fortawesome/free-solid-svg-icons"

function MouseModeCtlr() {
    const [ arrowColor , setArrowColor ] = useState("#d5d9e2")
    const [ squareColor , setSquareColor ] = useState("#fafafa")
    
    const Default = "#fafafa"
    const Clicked = "#d5d9e2"
    
    function changeColor(kind: string){
        kind==="arrow"
        ? (setArrowColor(Clicked), setSquareColor(Default))
        : (setArrowColor(Default), setSquareColor(Clicked)) 
    }

    return(
        <SMouseModeCtlr>
            <SButton color={arrowColor} onClick={() => changeColor("arrow")}>
                <FontAwesomeIcon icon={faMousePointer}/>
            </SButton>
             <SButton color={squareColor} onClick={() => changeColor("square")}>
                <FontAwesomeIcon icon={faSquare}/>
            </SButton>
            
        </SMouseModeCtlr>
    )
}

export default MouseModeCtlr

const SMouseModeCtlr = styled.div`
    width: 32pt;
    border: thin solid #edeff3;
    background-color: #fafafa;
    flex-direction: column;
    display: flex;
    justify-content: flex-start;
    height:100%;
`

const SButton = styled.button`
    justify-content: center;
    margin: 3pt;
    padding: 5pt;
    width: 25pt;
    height: 25pt;
    border-radius: 5px;
    background-color: ${props => props.color};
    :hover{ 
        background-color: #d5d9e2;
    }
`