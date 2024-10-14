export default class Artist {
    id: string;
    name: string;
    coverArt: string;
    artistImageUrl: string;
    albumCount: number;

    constructor(id: string, name: string, coverArt: string, artistImageUrl: string, albumCount: number) {
        this.id = id;
        this.name = name;
        this.coverArt = coverArt;
        this.artistImageUrl = artistImageUrl;
        this.albumCount = albumCount;
    }
}