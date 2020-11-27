import { MutableRefObject, useEffect, useState } from 'react'

export default function useMousePoint(ref: MutableRefObject<any>){
    const [ point, setPoint ] = useState<{x: number, y: number}>({x: 0, y: 0})

    useEffect(()=>{
        const handleMouseMove = e => {
            setPoint( {
                x: (e.clientX - e.target.getBoundingClientRect().left) / e.target.getBoundingClientRect().width * 100,
                y: (e.clientY - e.target.getBoundingClientRect().top) / e.target.getBoundingClientRect().height * 100
            })
        }

        if (ref && ref.current) 
            ref.current.addEventListener("mousemove", handleMouseMove )

        return () => ref.current.removeEventListener("mousemove", handleMouseMove )
    },[])

    return {
        point
    }
}