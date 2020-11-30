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
                    <SListItem key={`${label.className} + ${i}`}>
                        <SLabelName>{label.className}</SLabelName>
                        <div>{`lt: (${(label.position.lt.x).toFixed(2)}, ${(label.position.lt.y).toFixed(2)}) 
                            rt: (${(label.position.rt.x).toFixed(2)}, ${(label.position.rt.y).toFixed(2)})`}</div>
                        <div>{`lb: (${(label.position.lb.x).toFixed(2)}, ${(label.position.lb.y).toFixed(2)}) 
                            rb: (${(label.position.rb.x).toFixed(2)}, ${(label.position.rb.y).toFixed(2)})`}</div>
                    </SListItem> ) 
                }
            </SLabelList>
        </SListFrame>
    )
}

export default LabelList

const SListFrame = styled.div`
    background-color:#fafafa;
    border: thin solid #edeff3;
    width: 278px;
`

const SFoldButton = styled.div`
    border-bottom: 2pt solid #edeff3;
    background-color:#fafafa;
    height: 20pt;
    padding-left: 10pt;
    padding-top: 5pt;
    vertical-align: start;
`

const SLabelList = styled.ul`
    width:100%;
    height: 100%;
`

const SListItem = styled.li`
    padding: 21px 24px;
    font-size: 12px;
    border-bottom: thin solid #edeff3;
`

const SLabelName = styled.h1`
    font-size: 12px;
`



