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
        collaborative?: boolean | null,
        description?: string | null,
        external_urls?: { spotify: string } | null,
        href?: string | null,
        id?: string | null,
        images?: { height: number; url: string; width: number }[] | null,
        name?: string | null,
        owner?: { display_name: string; external_urls: { spotify: string }; href: string; id: string; type: string; uri: string } | null,
        isPublic?: boolean | null,
        snapshot_id?: string | null,
        tracks?: { href: string; total: number } | null,
        type?: string | null,
        uri?: string | null
    ) {
        this.collaborative = collaborative ?? false;
        this.description = description ?? '';
        this.external_urls = external_urls ?? { spotify: '' };
        this.href = href ?? '';
        this.id = id ?? '';
        this.images = images ?? [];
        this.name = name ?? '';
        this.owner = owner ?? { display_name: '', external_urls: { spotify: '' }, href: '', id: '', type: '', uri: '' };
        this.public = isPublic ?? true;
        this.snapshot_id = snapshot_id ?? '';
        this.tracks = tracks ?? { href: '', total: 0 };
        this.type = type ?? '';
        this.uri = uri ?? '';
    }
}