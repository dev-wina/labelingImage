import { useEffect, useState } from 'react'

export default function useImageSize(Image: HTMLImageElement|string|null){
    const [ image , setImageSize ] = useState(Image)
    useEffect(()=>{
        
    },[])
    return{
        image
    }
}