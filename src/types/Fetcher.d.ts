import Album from "../models/Album"
import Artist from "../models/Artist"
import { GetEntityType } from "./enums"


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

export type GetArtistsResponse = {
    artists: {
        ignoredArticles: string,
        index: { name: string, artist: Artist[] }[]
    }
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
    type: GetEntityType,
    size?: number,
    offset?: number
}

export type GetArtistsPayload = {
    type: GetEntityType,
    size?: number,
    offset?: number
}
