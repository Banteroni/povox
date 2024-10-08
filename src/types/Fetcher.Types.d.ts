import Album from "./Album"

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