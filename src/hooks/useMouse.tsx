import { MutableRefObject, useEffect, useState } from 'react'

export default function useMouse(ref: MutableRefObject<any>){
    const [ point, setPoint ] = useState<{x: number, y: number}>({x: 0, y: 0})

    useEffect(()=>{
        const handleMouseDown = e => {
            setPoint( {
                x: e.clientX - e.target.getBoundingClientRect().left /e.target.getBoundingClientRect().width *100,
                y: e.clientX - e.target.getBoundingClientRect().top /e.target.getBoundingClientRect().height *100
            })
        }

        if (ref && ref.current) 
            ref.current.addEventListener("mousedown", handleMouseDown )

        return () => ref.current.removeEventListener("mousedown", handleMouseDown )
    },[])

    return {
        point
    }
}