import React from "react"
import { Label } from '~modules/data/types'
import { styled } from "~styles/themes"

interface ILabel
{
    labels?: Label[]
}

function LabelList(prop: ILabel) {
    const { labels } = prop

    return (
        <SListFrame>
            <SFoldButton>labels</SFoldButton>    
            <SLabelList>
                { labels?.map((label: Label, i: number) =>  
                    <li key={`${label.className} + ${i}`}>
                        <div>{label.className}</div>
                        <div>{`(${(label.position.lt.x).toFixed(2)},
                            ${(label.position.lt.y).toFixed(2)}) 
                            (${(label.position.rt.x).toFixed(2)}, 
                            ${(label.position.rt.y).toFixed(2)}) 
                            (${(label.position.lb.x).toFixed(2)}, 
                            ${(label.position.lb.y).toFixed(2)}) 
                            (${(label.position.rb.x).toFixed(2)}, 
                            ${(label.position.rb.y).toFixed(2)})`}</div>
                    </li> ) 
                }
            </SLabelList>
        </SListFrame>
    )
}

export default LabelList

const SListFrame = styled.div`
    background-color:#fafafa;
    border: thin solid #edeff3;
    width:20%;
`

const SFoldButton = styled.div`
    border-bottom: 2pt solid #edeff3;
    background-color:#fafafa;
    height: 20pt;
    padding-left: 10pt;
    padding-top: 5pt;
    vertical-align: start;
`

const SLabelList = styled.div`
`