import { MutableRefObject, useEffect } from 'react'
import useImageSize from './useImageSize'

export default function useImage(ref: MutableRefObject<any>, image: any){
    useEffect(()=>{
        const handleKeyDown = (e) => {
            alert(`확인확인 ${e.key}`)
            if(e.key === "Space"){
                useImage(ref, image)        
            }
        }
        const img = new Image()
        img.src = image
        img.onload = () => {
            ref.current.getContext('2d')?.drawImage(img, 0, 0)
        }

        if (ref && ref.current) {
            ref.current.focus();
            ref.current.addEventListener("keydown", handleKeyDown )
        }

        return () => {
            ref.current.removeEventListener("keydown", handleKeyDown )
        }
        
    },[image])
}