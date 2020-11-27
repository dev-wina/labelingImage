import React from 'react'
import { Label } from '~modules/data'
import Rect from './Rect'

export interface IRects{
    rects: Label[]
}

function RectController(props: IRects){
    const {
        rects
    } = props

    return(
        <div>
            {
                rects.map((label , index) => (
                    <Rect key={index} {...label} />
                 ))
            }
        </div>
    )
}
export default RectController
