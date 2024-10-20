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

export type GetArtistInfoResponse = {
    artistInfo: ArtistInfo
}

export type GetArtistsResponse = {
    artists: {
        ignoredArticles: string,
        index: { name: string, artist: Artist[] }[]
    }
}

export type GetMusicDirectoryResponse = {
    directory: {
        id: string,
        name: string,
        playCount: number,
        child: Album[] 
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

export type ArtistInfo = {
    biography: string,
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
        artist: Artist[],
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
