import React, { useEffect } from "react";
import useVideo from '~hooks/useVideo';
import RootRouter from "~pages";
import { styled } from "~styles/themes";

function App() {
    const { video , getVideo } = useVideo()
    
    useEffect(()=>{
        getVideo()
        console.log("비디오",video)
    },[])

    return (
        <SApp>
            <RootRouter/>
        </SApp>
    )
}

export default App;


const SApp = styled.div`
  display: grid;
  position: fixed;
  width: 100%;
  height: 100%;
`