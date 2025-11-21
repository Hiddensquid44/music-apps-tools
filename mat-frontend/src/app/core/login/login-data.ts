export class LoginData {
    static clientId: string = '6de6bb333dca4a10ae884de483317f3f';
    static clientSecret: string = 'f8e22f56d9d54e2d8e78e689facb0275';
    static redirectUriLogin: string = 'http://[::1]:4200/login';
    static scope: string = 
        'playlist-read-private ' +
        'user-read-private ' +
        'user-read-email ' +
        'user-modify-playback-state ' +
        'user-read-currently-playing ' +
        'user-read-playback-state';

    public static _accessToken: string = '';
    public static _refreshToken: string = '';

    public static get accessToken(): string {
        return this._accessToken;
    }

    public static get refreshToken(): string {
        return this._refreshToken;
    }

    public static set accessToken(value: string) {
        this._accessToken = value;
        this.saveLoginData();
    }

    public static set refreshToken(value: string) {
        this._refreshToken = value;
        this.saveLoginData();
    }

    public static clearLoginData() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('login_accessToken');
            localStorage.removeItem('login_refreshToken');
        }
    }

    public static saveLoginData() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('login_accessToken', this.accessToken);
            localStorage.setItem('login_refreshToken', this.refreshToken);
        }
    }

    public static loadLoginData() {
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('login_accessToken');
            if (accessToken && accessToken !== 'undefined') {
                this.accessToken = accessToken;
            }
            const refreshToken = localStorage.getItem('login_refreshToken');
            if (refreshToken && refreshToken !== 'undefined') {
                this.refreshToken = refreshToken;
            }
        }
    }
}