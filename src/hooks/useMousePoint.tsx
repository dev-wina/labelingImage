import { MutableRefObject, useEffect, useState } from 'react'
import { Point } from '~modules/data'

export default function useMousePoint(ref: MutableRefObject<any>){
    const [ point, setPoint ] = useState<Point>({x: 0, y: 0})

    useEffect(()=>{
        const handleMouseMove = e => {
            setPoint( {
                x: (e.clientX - e.target.getBoundingClientRect().left) / e.target.getBoundingClientRect().width * ref.current.width,
                y: (e.clientY - e.target.getBoundingClientRect().top) / e.target.getBoundingClientRect().height * ref.current.height
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