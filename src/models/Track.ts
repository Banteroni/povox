export default class Track {
    album: string;
    albumId: string;
    artist: string;
    artistId: string;
    bitRate: number;
    contentType: string;
    created: string;
    discNumber: number;
    duration: number;
    genre: string;
    id: string;
    isDir: boolean;
    path: string;
    playCount: number;
    size: number;
    suffix: string;
    title: string;
    track: number;
    transcodedContentType: string;
    transcodedSuffix: string;
    type: string;
    year: number;

    constructor(album: string, albumId: string, artist: string, artistId: string, bitRate: number, contentType: string, created: string, discNumber: number, duration: number, genre: string, id: string, isDir: boolean, path: string, playCount: number, size: number, suffix: string, title: string, track: number, transcodedContentType: string, transcodedSuffix: string, type: string, year: number) {
        this.album = album;
        this.albumId = albumId;
        this.artist = artist;
        this.artistId = artistId;
        this.bitRate = bitRate;
        this.contentType = contentType;
        this.created = created;
        this.discNumber = discNumber;
        this.duration = duration;
        this.genre = genre;
        this.id = id;
        this.isDir = isDir;
        this.path = path;
        this.playCount = playCount;
        this.size = size;
        this.suffix = suffix;
        this.title = title;
        this.track = track;
        this.transcodedContentType = transcodedContentType
        this.transcodedSuffix = transcodedSuffix;
        this.type = type;
        this.year = year;
    }


}