import React, { useEffect, useState } from "react"
import { styled } from "~styles/themes"
import Tools from "./Tools"
import LabelList from "./LabelList"
import LabelingView from "./LabelingView"
import { RouteComponentProps } from 'react-router'
import useData from '~hooks/useData'
import { MatchParams } from '~pages/AnnotatorHome/VideoList'
import { Video } from '~modules/data'

function DatasetLabel(props: RouteComponentProps<MatchParams>) {
    const { 
        match, 
        history 
    } = props
    
    const [ tool, setTool ] = useState(0)

    const { data, findById } = useData()
    const videoData: Video|null = findById(parseInt(match.params.id))
    return (
        <SDatasetLabel>
            <SHeader>Dataset Label</SHeader>
            <SFragment>
                <Tools tool={tool} setTool={setTool} />
                <LabelList labels={videoData?.labels}/>
                <LabelingView image={videoData?.url} data={videoData}/>
            </SFragment>
        </SDatasetLabel>
    )
}

export default DatasetLabel

const SDatasetLabel = styled.div`
    display: flex;
    flex-direction: column;
    width:100%;
    height:100%;
`
const SHeader = styled.div`
    border-bottom: thin solid #edeff3;
    color:black;
    padding:10pt 32pt;
    font-size:20pt;
    background-color:#fafafa;
`

const SFragment = styled.div`
    display: flex;
    flex: 1;
    height: 100%;
`