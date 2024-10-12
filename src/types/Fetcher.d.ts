import Album from "../models/Album"
import { GetAlbumsType } from "./enums"


export type SubsonicResponse = {
    "subsonic-response": {
        status: string,
        version: string,
        [key: string]: any,
    }
}

export type GetAlbumListResponse = {
    albumList: {
        album: Album[]
    }
}

export type GetAlbumsPayload = {
    type: GetAlbumsType,
    size?: number,
    offset?: number
}

