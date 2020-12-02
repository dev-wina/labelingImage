import React, { useEffect } from "react"
import useData from '~hooks/useData'
import { Label, Video } from '~modules/data/types'
import { withProps } from '~styles/themed-components'
import { styled } from "~styles/themes"

interface ILabel
{
    data?: Video
    labels?: Label[]
    tool: number
}

function LabelList(prop: ILabel) {
    const { 
        data,
        labels,
        tool
    } = prop
    
    const { modify } = useData()

    const handleClickItem = (i) => {
        if(!labels) return
        if(tool === 0){
            labels.map((label)=>{
                label.isSelected = false
            })
            labels[i].isSelected = !labels[i].isSelected
        } else{
            labels[i].isSelected = !labels[i].isSelected
        }
        modify({...data, ...{labels: labels}})
    }

    return (
        <SListFrame>
            <SFoldButton>labels</SFoldButton>    
            <SLabelList>
                { labels?.map((label: Label, i: number) => 
                    <SListItem {...label} key={`${label.className} + ${i}`} onClick={()=> handleClickItem(i)}>
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

const SListItem = withProps(styled.li)`
    padding: 21px 24px;
    font-size: 12px;
    border-bottom: thin solid #edeff3;
    background-color: ${props => props.isSelected? "#EBEDF2" : "#fafafa" }
`

const SLabelName = styled.h1`
    font-size: 12px;
`



