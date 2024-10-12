import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Album from '../models/Album';
import { invoke } from '@tauri-apps/api/core';
import type { GetAlbumsPayload, SubsonicResponse } from '../types/Fetcher';
import Track from '../models/Track';
import { ReadableStreamDefaultReader } from 'stream/web';

export default class Fetcher {

    baseUrl: string;
    private token: string | null = null;
    private salt: string;
    private client: string = "music-player";
    private username: string;
    private fetcher: AxiosInstance
    isReady: boolean = false;

    constructor(baseUrl: string, username: string, token: string, salt: string) {
        this.baseUrl = baseUrl;
        this.token = token;
        this.username = username;
        this.salt = salt;
        this.fetcher = axios.create({
            baseURL: `${this.baseUrl}/rest`,
            params: {
                c: this.client,
                u: this.username,
                t: this.token,
                s: this.salt,
                f: 'json',
                v: '1.16.1'
            }
        });
    }

    // Endpoints

    public async Ping(): Promise<boolean> {
        const response = await this.GenericRequest('/ping', {});
        return response.data["subsonic-response"].status === 'ok';
    }

    public async getAlbums(payload: GetAlbumsPayload): Promise<Album[]> {
        var finalPayload: { [key: string]: string } = {};
        if (payload.size) {
            finalPayload["size"] = payload.size.toString();
        }
        if (payload.offset) {
            finalPayload["offset"] = payload.offset.toString();
        }
        if (payload.type) {
            finalPayload["type"] = payload.type;
        }

        const response = await this.GenericRequest('/getAlbumList', finalPayload);
        return response.data["subsonic-response"].albumList.album.map((album: any) => new Album(album.id, album.isDir, album.title, album.album, album.artist, album.year, album.genre, album.coverArt, album.playCount, album.created));
    }

    public async GetCoverArt(id: string): Promise<BinaryData> {
        const response = await this.BinaryRequest("/getCoverArt", {
            id: id
        })
        return response.data
    }

    public async GetTracksByAlbum(id: string): Promise<Track[]> {
        const response = await this.GenericRequest('/getMusicDirectory', {
            id: id
        });
        return response.data["subsonic-response"].directory.child.map((track: any) => new Track(track.album, track.albumId, track.artist, track.artistId, track.bitRate, track.contentType, track.created, track.discNumber, track.duration, track.genre, track.id, track.isDir, track.path, track.playCount, track.size, track.suffix, track.title, track.track, track.transcoded, track.transcodedSuffix, track.type, track.year));
    }

    public async GetStream(id: string): Promise<ReadableStreamDefaultReader> {
        const response = await this.StreamRequest('/stream', {
            id: id
        });
        return response;
    }


    // Configuration

    public async prepareFetcher() {
        this.fetcher = axios.create({
            baseURL: `${this.baseUrl}/rest`,
            params: {
                c: this.client,
                u: this.username,
                t: this.token,
                s: this.salt,
                f: 'json',
                v: '1.16.1'
            }
        });
        this.isReady = true;
    }

    // Static methods to help the user create the token

    public static generateSalt(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    public static async generateToken(password: string, salt: string): Promise<string> {
        var response = await invoke("to_md5", { x: password + salt }).then(x => x as string);
        return response;
    }

    // Private methods

    private async BinaryRequest(path: string, params: { [key: string]: string }): Promise<AxiosResponse<BinaryData>> {
        if (!this.fetcher) {
            throw new Error('Fetcher is not defined');
        }
        return this.fetcher.get(path, {
            params: {
                ...params
            },
            responseType: 'arraybuffer'
        }).then(x => x as AxiosResponse<BinaryData>);
    }

    private async StreamRequest(path: string, params: { [key: string]: string }): Promise<ReadableStreamDefaultReader> {
        if (!this.fetcher) {
            throw new Error('Fetcher is not defined');
        }
        var fetchedStream = await fetch(`${this.baseUrl}/rest/${path}?id=${params.id}&u=${this.username}&t=${this.token}&s=${this.salt}&c=${this.client}&v=1.16.1`);
        const reader = fetchedStream.body?.getReader();
        if (!reader) {
            throw new Error('Reader is not defined');
        }
        return reader;

    }


    private async GenericRequest(path: string, params: { [key: string]: string }, method: string = "GET"): Promise<AxiosResponse<SubsonicResponse>> {
        if (!this.fetcher) {
            throw new Error('Fetcher is not defined');
        }
        switch (method) {
            case 'GET':
                return this.fetcher.get(path, {
                    params: {
                        ...params
                    }
                }).then(x => x as AxiosResponse<SubsonicResponse>);
            case 'POST':
                return this.fetcher.post(path, {
                    params: {
                        ...params
                    }
                }).then(x => x as AxiosResponse<SubsonicResponse>);;
            default:
                throw new Error('Method not supported');
        }
    }
}