export class LoginData {
    static clientId: string = '6de6bb333dca4a10ae884de483317f3f';
    static clientSecret: string = 'f8e22f56d9d54e2d8e78e689facb0275';
    static redirectUriLogin: string = 'http://[::1]:4200/login';
    static scope: string = 'playlist-read-private user-read-private user-read-email user-modify-playback-state';

    public static accessToken: string = '';
    public static refreshToken: string = '';
}