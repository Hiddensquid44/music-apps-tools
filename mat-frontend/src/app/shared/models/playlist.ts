export class Playlist {
    collaborative: boolean = false;
    description: string = '';
    external_urls: { spotify: string } = { spotify: '' };
    href: string = '';
    id: string = '';
    images: { height: number | null; url: string; width: number | null }[] = [];
    name: string = '';
    owner: { display_name: string; external_urls: { spotify: string }; href: string; id: string; type: string; uri: string } = { display_name: '', external_urls: { spotify: '' }, href: '', id: '', type: '', uri: '' };
    public: boolean | null = null;
    snapshot_id: string = '';
    tracks: { href: string; total: number } = { href: '', total: 0 };
    type: string = '';
    uri: string = '';

    constructor(
        collaborative: boolean,
        description: string,
        external_urls: { spotify: string },
        href: string,
        id: string,
        images: { height: number | null; url: string; width: number | null }[],
        name: string,
        owner: { display_name: string; external_urls: { spotify: string }; href: string; id: string; type: string; uri: string },
        isPublic: boolean | null,
        snapshot_id: string,
        tracks: { href: string; total: number },
        type: string,
        uri: string
    ) {
        this.collaborative = collaborative;
        this.description = description;
        this.external_urls = external_urls;
        this.href = href;
        this.id = id;
        this.images = images;
        this.name = name;
        this.owner = owner;
        this.public = isPublic;
        this.snapshot_id = snapshot_id;
        this.tracks = tracks;
        this.type = type;
        this.uri = uri;
    }
}