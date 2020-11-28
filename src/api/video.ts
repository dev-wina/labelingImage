import axios from "axios"

export async function getVideo(): Promise<VideoResponse[]> {
    return (
        await axios
            .get<VideoResponse[]>("https://jsonplaceholder.typicode.com/photos")
    ).data
}


export interface VideoResponse {
    albumId: number, //영상id
    id: number, //프레임넘버
    title: string, //영상타이틀인지 프레임이미지타이틀인지
    url: string, //프레임이미지
    thumbnailUrl: string //프레임썸네일
}