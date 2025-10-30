export class Track {
    album: {
        album_type: string;
        total_tracks: number;
        available_markets: string[];
        external_urls: { spotify: string; };
        href: string;
        id: string;
        images: { height: number; url: string; width: number; }[];
        name: string;
        release_date: string;
        release_date_precision: string;
        restrictions: { reason: string; };
        type: string;
        uri: string;
        artists: { external_urls: { spotify: string; }; href: string; id: string; name: string; type: string; uri: string; }[];
    } | undefined;
    artists: {
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
    }[] | undefined;
    available_markets: string[] = [];
    disc_number: number = 0;
    duration_ms: number = 0;
    explicit: boolean = true;
    external_ids: { isrc: string } = { isrc: '' };
    external_urls: { spotify: string } = { spotify: '' };
    href: string = '';
    id: string = '';
    isPlayable: boolean = true;
    linked_from: any;
    restrictions: { reason: string } = { reason: '' };
    name: string = '';
    popularity: number = 0;
    preview_url: string = '';
    track_number: number = 0;
    type: string = '';
    uri: string = '';
    isLocal: boolean = false;

    constructor(
        available_markets: string[],
        disc_number: number,
        duration_ms: number,
    ) {
        this.available_markets = available_markets;
        this.disc_number = disc_number;
        this.duration_ms = duration_ms;
    }
}
