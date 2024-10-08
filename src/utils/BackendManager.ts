import { createStore, Store } from "@tauri-apps/plugin-store";
import { UserData } from "../types/BackendManager.Types";


export default class BackendManager {
    private store: Store | null = null;
    public isReady = false;

    constructor() {
    }

    public async Initialize(): Promise<void> {
        this.store = await this.UpsertStorage();
        this.isReady = true;
    }

    public async SetUserData(userData: UserData): Promise<void> {
        if (!this.isReady) {
            throw new Error('Store not ready');
        }
        await this.store!.set('userData', userData);
    }

    public async GetUserData(): Promise<UserData | null> {
        if (!this.isReady) {
            throw new Error('Store not ready');
        }
        const userData = await this.store!.get<UserData>('userData');
        if (userData === undefined) {
            throw new Error('User data not found');
        }
        console.log(userData);
        return userData as UserData | null;
    }

    private async UpsertStorage(): Promise<Store> {
        const store = await createStore('store.bin', {
            // we can save automatically after each store modification
            // @ts-ignore
            autoSave: 1,
        });
        return store;
    }
}