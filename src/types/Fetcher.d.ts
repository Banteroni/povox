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

export type GetAlbumInfoResponse = {
    albumInfo: AlbumInfo
}

export type AlbumInfo = {
    notes: string,
    musicBrainzId: string,
    lastFmUrl: string,
    smallImageUrl: string,
    mediumImageUrl: string,
    largeImageUrl: string,
}


// Replace any with actual types once completed
export type QueryResponse = {
    searchResult2: {
        album: Album[],
        artist: any[],
        song: any[]
    }
}

export type GetAlbumsPayload = {
    type: GetAlbumsType,
    size?: number,
    offset?: number
}

