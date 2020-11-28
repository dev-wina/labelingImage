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

        const canvas: HTMLCanvasElement = ref.current

        const img = new Image()
        img.src = image
        //화면에 정확히 적용되지 않음
        img.onload = () => {
            canvas.getContext('2d')?.drawImage(img, 0, 0, img.width*(canvas.height/img.height), img.height*(canvas.height/img.height))
            useImageSize(img)
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