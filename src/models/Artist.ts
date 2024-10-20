import Album from "./Album";

export default class Artist {
    id: string;
    name: string;
    coverArt: string;
    artistImageUrl: string;
    albumCount: number;
    album: Album[];

    constructor(id: string, name: string, coverArt: string, artistImageUrl: string, albumCount: number, album: Album[]) {
        this.id = id;
        this.name = name;
        this.coverArt = coverArt;
        this.artistImageUrl = artistImageUrl;
        this.albumCount = albumCount;
        this.album = album;
    }
}