import Fetcher from "./Fetcher";
import Track from "./Track";

export default class Album {
    id: string;
    isDir: boolean;
    title: string;
    album: string;
    artist: string;
    year: number;
    genre: string;
    coverArt: string;
    playCount: number;
    created: string;

    constructor(id: string, isDir: boolean, title: string, album: string, artist: string, year: number, genre: string, coverArt: string, playCount: number, created: string) {
        this.id = id;
        this.isDir = isDir;
        this.title = title;
        this.album = album;
        this.artist = artist;
        this.year = year;
        this.genre = genre;
        this.coverArt = coverArt;
        this.playCount = playCount;
        this.created = created;
    }

    public async GetCoverArt(fetcher: Fetcher): Promise<BinaryData> {
        return await fetcher.GetCoverArt(this.id);
    }

    public async GetTracks(fetcher: Fetcher): Promise<Track[]> {
        var response = await fetcher.GetTracksByAlbum(this.id);
        response = response.map(v => {
            v.albumId = this.id
            return v;
        });
        return response;
    }
}