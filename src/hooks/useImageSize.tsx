import { useEffect, useState } from 'react'

export default function useImageSize(Image: HTMLImageElement){
    const [ width , setWidth ] = useState<number>()
    const [ height , setHeight ] = useState<number>()
    useEffect(()=>{
        alert(Image)
        if(Image) {
            setWidth(Image.width)
            setHeight(Image.height)
        }
    },[Image])
    return{
        width,
        height
    }
}