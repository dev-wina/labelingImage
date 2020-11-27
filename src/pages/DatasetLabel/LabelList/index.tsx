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
                { labels?.map((label: Label, i: number) => { <li key={`${label.name} + ${i}`}>{label.name}</li> }) }
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