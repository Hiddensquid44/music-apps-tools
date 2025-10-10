import { Playlist } from "./playlist";

export class User {

    country: string = '';
    display_name: string = '';
    email: string = '';
    explicit_content: { filter_enabled: boolean; filter_locked: boolean } = { filter_enabled: false, filter_locked: false };
    external_urls: { spotify: string } = { spotify: '' };
    followers: { href: string | null; total: number } = { href: null, total: 0 };
    href: string = '';
    id: string = '';
    images: { height: number | null; url: string; width: number | null }[] = [];
    product: string = '';
    type: string = '';
    uri: string = '';
    playlists: Playlist[] = [];

    constructor(
        country: string = '',
        display_name: string = '',
        email: string = '',
        explicit_content: { filter_enabled: boolean; filter_locked: boolean } = { filter_enabled: false, filter_locked: false },
        external_urls: { spotify: string } = { spotify: '' },
        followers: { href: string ; total: number } = { href: '', total: 0 },
        href: string = '',
        id: string = '',
        images: { height: number ; url: string ; width: number }[] = [],
        product: string = '',
        type: string = '',
        uri: string = '',
        playlists: Playlist[] = []
    ) {
        this.country = country;
        this.display_name = display_name;
        this.email = email;
        this.explicit_content = explicit_content;
        this.external_urls = external_urls;
        this.followers = followers;
        this.href = href;
        this.id = id;
        this.images = images;
        this.product = product;
        this.type = type;
        this.uri = uri;
        this.playlists = playlists;
    }
}