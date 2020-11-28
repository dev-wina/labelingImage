import { MutableRefObject, useEffect } from 'react';
import { Label } from '~modules/data';

export interface IRect{
    lt: {x: number, y: number}, 
    rt: {x: number, y: number},
    lb: {x: number, y: number},
    rb: {x: number, y: number},
    selected: boolean
}

const data: IRect[] = [
        { lt: {x:0, y:0}, rt: {x:0.2, y:0}, lb: {x:0, y:0.2}, rb: {x:0.2, y:0.2}, selected: false},
        { lt: {x:0, y:0}, rt: {x:0.9, y:0}, lb: {x:0, y:0.9}, rb: {x:0.9, y:0.9}, selected: false}
] // TODO : 삭제예정, 이미지에서의 비율  

export default function useDrawRect(ref: MutableRefObject<any>, rectList: Label[]){
    const canvas: HTMLCanvasElement = ref.current
    const context = canvas.getContext('2d')
    if(context){
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        rectList.map((rect)=>{
            const temp: IRect = { 
                lt: {x:rect.position.x, y:rect.position.y}, 
                rt: {x:rect.position.x + rect.width, y:rect.position.y}, 
                lb: {x:rect.position.x, y:rect.position.y + rect.height}, 
                rb: {x:rect.position.x + rect.width, y:rect.position.y + rect.height}, 
                selected: true
            }
            drawRect(context, temp)
            drawAnchor(context, temp)
        })  
    }
    
    function drawRect(context, rect: IRect){
        if(rect.selected == false) return

        context.fillStyle="#5668D933"
        context.strokeStyle = "#5668D9"
        context.lineJoin = 'miter'
        context.lineWidth = 1

        context.beginPath()

        context.moveTo(rect.lt.x * 600, rect.lt.y * 600);
        context.lineTo(rect.rt.x * 600, rect.rt.y * 600);
        context.lineTo(rect.rb.x * 600, rect.rb.y * 600);
        context.lineTo(rect.lb.x * 600, rect.lb.y * 600);

        context.closePath()

        context.stroke()
        context.fill()
    }
    
    function drawAnchor(context, rect: IRect){
        if(rect.selected == false) return
        context.strokeStyle = "#5668D9"
        context.lineJoin = 'miter'
        context.lineWidth = 1

        context.beginPath();

        context.moveTo(rect.lt.x * 600 - 4, rect.lt.y * 600 - 4)
        context.lineTo(rect.lt.x * 600 + 4, rect.lt.y * 600 - 4)
        context.lineTo(rect.lt.x * 600 + 4, rect.lt.y * 600 + 4)
        context.lineTo(rect.lt.x * 600 - 4, rect.lt.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.lt.x * 600 - 4, rect.lt.y * 600 - 4, 8, 8)


        
        context.moveTo(rect.rt.x * 600 - 4, rect.rt.y * 600 - 4)
        context.lineTo(rect.rt.x * 600 + 4, rect.rt.y * 600 - 4)
        context.lineTo(rect.rt.x * 600 + 4, rect.rt.y * 600 + 4)
        context.lineTo(rect.rt.x * 600 - 4, rect.rt.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.rt.x * 600 - 4, rect.rt.y * 600 - 4, 8, 8)

        context.moveTo(rect.rb.x * 600 - 4, rect.rb.y * 600 - 4)
        context.lineTo(rect.rb.x * 600 + 4, rect.rb.y * 600 - 4)
        context.lineTo(rect.rb.x * 600 + 4, rect.rb.y * 600 + 4)
        context.lineTo(rect.rb.x * 600 - 4, rect.rb.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.rb.x * 600 - 4, rect.rb.y * 600 - 4, 8, 8)

        context.moveTo(rect.lb.x * 600 - 4, rect.lb.y * 600 - 4)
        context.lineTo(rect.lb.x * 600 + 4, rect.lb.y * 600 - 4)
        context.lineTo(rect.lb.x * 600 + 4, rect.lb.y * 600 + 4)
        context.lineTo(rect.lb.x * 600 - 4, rect.lb.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.lb.x * 600 - 4, rect.lb.y * 600 - 4, 8, 8)

        //////////////////////////////////////////////////////////////////////
        context.moveTo(rect.lt.x * 600 + (((rect.rt.x * 600) - (rect.lt.x * 600)) / 2) - 4, (rect.lt.y * 600) - 4)
        context.lineTo(rect.lt.x * 600 + (((rect.rt.x * 600) - (rect.lt.x * 600)) / 2) + 4, (rect.lt.y * 600) - 4)
        context.lineTo(rect.lt.x * 600 + (((rect.rt.x * 600) - (rect.lt.x * 600)) / 2) + 4, (rect.lt.y * 600) + 4)
        context.lineTo(rect.lt.x * 600 + (((rect.rt.x * 600) - (rect.lt.x * 600)) / 2) - 4, (rect.lt.y * 600) + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.lt.x * 600 + ((rect.rt.x * 600 - rect.lt.x * 600) / 2) - 4, rect.lt.y * 600 - 4, 8, 8)

        context.moveTo(rect.lt.x * 600 - 4, rect.lt.y * 600 + ((rect.lb.y * 600 - rect.lt.y * 600) / 2) - 4)
        context.lineTo(rect.lt.x * 600 + 4, rect.lt.y * 600 + ((rect.lb.y * 600 - rect.lt.y * 600) / 2) - 4)
        context.lineTo(rect.lt.x * 600 + 4, rect.lt.y * 600 + ((rect.lb.y * 600 - rect.lt.y * 600) / 2) + 4)
        context.lineTo(rect.lt.x * 600 - 4, rect.lt.y * 600 + ((rect.lb.y * 600 - rect.lt.y * 600) / 2) + 4)
        
        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.lt.x * 600 - 4,rect.lt.y * 600 + ((rect.lb.y * 600 - rect.lt.y * 600) / 2) - 4, 8, 8)

        context.moveTo(rect.lb.x * 600 + ((rect.rb.x * 600 - rect.lb.x * 600) / 2) - 4, rect.lb.y * 600 - 4)
        context.lineTo(rect.lb.x * 600 + ((rect.rb.x * 600 - rect.lb.x * 600) / 2) + 4, rect.lb.y * 600 - 4)
        context.lineTo(rect.lb.x * 600 + ((rect.rb.x * 600 - rect.lb.x * 600) / 2) + 4, rect.lb.y * 600 + 4)
        context.lineTo(rect.lb.x * 600 + ((rect.rb.x * 600 - rect.lb.x * 600) / 2) - 4, rect.lb.y * 600 + 4)
        
        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rect.lb.x * 600 + ((rect.rb.x * 600 - rect.lb.x * 600) / 2) - 4,rect.lb.y * 600 - 4, 8, 8)

        context.moveTo(rect.rt.x * 600 - 4, rect.rt.y * 600 + ((rect.rb.y * 600 - rect.rt.y * 600) / 2) - 4)
        context.lineTo(rect.rt.x * 600 + 4, rect.rt.y * 600 + ((rect.rb.y * 600 - rect.rt.y * 600) / 2) - 4)
        context.lineTo(rect.rt.x * 600 + 4, rect.rt.y * 600 + ((rect.rb.y * 600 - rect.rt.y * 600) / 2) + 4)
        context.lineTo(rect.rt.x * 600 - 4, rect.rt.y * 600 + ((rect.rb.y * 600 - rect.rt.y * 600) / 2) + 4)
        
        context.closePath()
        context.stroke()
         context.fillStyle = "#fff"
        context.fillRect(rect.rt.x * 600 - 4,rect.rt.y * 600 + ((rect.rb.y * 600 - rect.rt.y * 600) / 2) - 4, 8, 8)
    }
}