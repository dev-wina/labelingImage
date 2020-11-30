import { MutableRefObject } from 'react';
import { Label, Point } from '~modules/data';

export default function useDrawRect(ref: MutableRefObject<any>, rectList: Label[]){
    const canvas: HTMLCanvasElement = ref.current
    const context = canvas.getContext('2d')
    if(context){
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        rectList.map((rect)=>{
            drawRect(context, rect.position.lt, rect.position.rt, rect.position.lb, rect.position.rb)
            drawAnchor(context, rect.position.lt, rect.position.rt, rect.position.lb, rect.position.rb)
            drawCoordBox(context, rect.isSelected, rect.className, rect.position.lt, rect.position.rt, rect.position.lb, rect.position.rb)
        })  
    }
    
    function drawRect(context, lt: Point, rt: Point, lb: Point, rb: Point){
        context.fillStyle="#5668D933"
        context.strokeStyle = "#5668D9"
        context.lineJoin = 'miter'
        context.lineWidth = 1

        context.beginPath()

        context.moveTo(lt.x * 600, lt.y * 600);
        context.lineTo(rt.x * 600, rt.y * 600);
        context.lineTo(rb.x * 600, rb.y * 600);
        context.lineTo(lb.x * 600, lb.y * 600);

        context.closePath()

        context.stroke()
        context.fill()
    }
    
    function drawAnchor(context, lt: Point, rt: Point, lb: Point, rb: Point){
        context.strokeStyle = "#5668D9"
        context.lineJoin = 'miter'
        context.lineWidth = 1

        context.beginPath();

        context.moveTo(lt.x * 600 - 4, lt.y * 600 - 4)
        context.lineTo(lt.x * 600 + 4, lt.y * 600 - 4)
        context.lineTo(lt.x * 600 + 4, lt.y * 600 + 4)
        context.lineTo(lt.x * 600 - 4, lt.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(lt.x * 600 - 4, lt.y * 600 - 4, 8, 8)


        
        context.moveTo(rt.x * 600 - 4, rt.y * 600 - 4)
        context.lineTo(rt.x * 600 + 4, rt.y * 600 - 4)
        context.lineTo(rt.x * 600 + 4, rt.y * 600 + 4)
        context.lineTo(rt.x * 600 - 4, rt.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rt.x * 600 - 4, rt.y * 600 - 4, 8, 8)

        context.moveTo(rb.x * 600 - 4, rb.y * 600 - 4)
        context.lineTo(rb.x * 600 + 4, rb.y * 600 - 4)
        context.lineTo(rb.x * 600 + 4, rb.y * 600 + 4)
        context.lineTo(rb.x * 600 - 4, rb.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(rb.x * 600 - 4, rb.y * 600 - 4, 8, 8)

        context.moveTo(lb.x * 600 - 4, lb.y * 600 - 4)
        context.lineTo(lb.x * 600 + 4, lb.y * 600 - 4)
        context.lineTo(lb.x * 600 + 4, lb.y * 600 + 4)
        context.lineTo(lb.x * 600 - 4, lb.y * 600 + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(lb.x * 600 - 4, lb.y * 600 - 4, 8, 8)

        //////////////////////////////////////////////////////////////////////
        context.moveTo(lt.x * 600 + (((rt.x * 600) - (lt.x * 600)) / 2) - 4, (lt.y * 600) - 4)
        context.lineTo(lt.x * 600 + (((rt.x * 600) - (lt.x * 600)) / 2) + 4, (lt.y * 600) - 4)
        context.lineTo(lt.x * 600 + (((rt.x * 600) - (lt.x * 600)) / 2) + 4, (lt.y * 600) + 4)
        context.lineTo(lt.x * 600 + (((rt.x * 600) - (lt.x * 600)) / 2) - 4, (lt.y * 600) + 4)

        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(lt.x * 600 + ((rt.x * 600 - lt.x * 600) / 2) - 4, lt.y * 600 - 4, 8, 8)

        context.moveTo(lt.x * 600 - 4, lt.y * 600 + ((lb.y * 600 - lt.y * 600) / 2) - 4)
        context.lineTo(lt.x * 600 + 4, lt.y * 600 + ((lb.y * 600 - lt.y * 600) / 2) - 4)
        context.lineTo(lt.x * 600 + 4, lt.y * 600 + ((lb.y * 600 - lt.y * 600) / 2) + 4)
        context.lineTo(lt.x * 600 - 4, lt.y * 600 + ((lb.y * 600 - lt.y * 600) / 2) + 4)
        
        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(lt.x * 600 - 4,lt.y * 600 + ((lb.y * 600 - lt.y * 600) / 2) - 4, 8, 8)

        context.moveTo(lb.x * 600 + ((rb.x * 600 - lb.x * 600) / 2) - 4, lb.y * 600 - 4)
        context.lineTo(lb.x * 600 + ((rb.x * 600 - lb.x * 600) / 2) + 4, lb.y * 600 - 4)
        context.lineTo(lb.x * 600 + ((rb.x * 600 - lb.x * 600) / 2) + 4, lb.y * 600 + 4)
        context.lineTo(lb.x * 600 + ((rb.x * 600 - lb.x * 600) / 2) - 4, lb.y * 600 + 4)
        
        context.closePath()
        context.stroke()
        context.fillStyle = "#fff"
        context.fillRect(lb.x * 600 + ((rb.x * 600 - lb.x * 600) / 2) - 4,lb.y * 600 - 4, 8, 8)

        context.moveTo(rt.x * 600 - 4, rt.y * 600 + ((rb.y * 600 - rt.y * 600) / 2) - 4)
        context.lineTo(rt.x * 600 + 4, rt.y * 600 + ((rb.y * 600 - rt.y * 600) / 2) - 4)
        context.lineTo(rt.x * 600 + 4, rt.y * 600 + ((rb.y * 600 - rt.y * 600) / 2) + 4)
        context.lineTo(rt.x * 600 - 4, rt.y * 600 + ((rb.y * 600 - rt.y * 600) / 2) + 4)
        
        context.closePath()
        context.stroke()
         context.fillStyle = "#fff"
        context.fillRect(rt.x * 600 - 4,rt.y * 600 + ((rb.y * 600 - rt.y * 600) / 2) - 4, 8, 8)
    }

    function drawCoordBox(context, isSelected: Boolean, className:string, lt: Point, rt: Point, lb: Point, rb: Point){
        if(isSelected == false) return

        context.fillStyle="#fff"
        context.fillRect(rb.x * 600 + 10, rb.y * 600 + 5, 79, 56)
        context.beginPath();
        //context.font = fontSize + 'px ' + fontFamily;
        //context.textAlign = textAlign;
        //context.textBaseline = textBaseline;
        context.fillStyle = "black";
        context.fillText( className?className:"class" ,rb.x * 600 + 20, rb.y * 600 + 20)
        context.fillText(`W ${Math.abs(rt.x-lt.x).toFixed(2)}m`,rb.x * 600 + 20, rb.y * 600 + 35)
        context.fillText(`H ${Math.abs(lb.y-lt.y).toFixed(2)}m`,rb.x * 600 + 20, rb.y * 600 + 50)
        context.stroke();
    }
}