import React from "react"
import { Link } from 'react-router-dom'
import { styled } from "~styles/themes"
import useData from "~hooks/useData"
import { PAGE_PATHS } from '~constant'

function AnnotatorHome() {
    const { data } = useData()
    return (
        <SAnnotatorHome>
            <SHeader>Annotator Home</SHeader>
            <SVideoList>
                {
                    data.map(video => 
                        <SVideoPreview key={video.id}>
                            <Link to={`${PAGE_PATHS.DATASET_LABEL}/${video.id}`}>
                                <SImg src={video.thumbnail} />
                                <SImageText>{video.name}</SImageText>
                            </Link>

                        </SVideoPreview>
                    ) 
                }
            </SVideoList>
            
        </SAnnotatorHome>
    )
}

export default AnnotatorHome

const SHeader = styled.h1`

`
const SAnnotatorHome = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    flex-wrap: wrap;
`

const SVideoList = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`

const SVideoPreview = styled.div`
    margin:0 3% 3% 0;
    display:flex;
    border: thin solid #edeff3;
`

const SImageText = styled.div`
    padding:5%;
`
const SImg = styled.img`
    width: 200px;
    height: 150px;
`