import { Track } from "./track";

export class PlaybackState {
    device: {
        id: string;
        is_active: boolean;
        is_private_session: boolean;
        is_restricted: boolean;
        name: string;
        type: string;
        volume_percent: number;
        supports_volume: boolean;
    } | null = null;
    repeat_state: 'off' | 'context' | 'track' = 'off';
    shuffle_state: boolean = false;
    context: { type: string; href: string | null; external_urls: { spotify: string }; uri: string } | null = null;
    timestamp: number = 0;
    progress_ms: number = 0;
    is_playing: boolean = false;
    item: Track | Object | null = null;
    currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown' = 'unknown';
    actions: {
        interrupting_playback: boolean;
        pausing: boolean;
        resuming: boolean;
        seeking: boolean;
        skipping_next: boolean;
        skipping_prev: boolean;
        toggling_repeat_context: boolean;
        toggling_repeat_track: boolean;
        toggling_shuffle: boolean;
        transferring_playback: boolean;
    } | null = null;

    constructor(
        device?: {
            id: string;
            is_active: boolean;
            is_private_session: boolean;
            is_restricted: boolean;
            name: string;
            type: string;
            volume_percent: number;
            supports_volume: boolean;
        },
        repeat_state?: 'off' | 'context' | 'track',
        shuffle_state?: boolean,
        context?: { type: string; href: string | null; external_urls: { spotify: string }; uri: string },
        timestamp?: number,
        progress_ms?: number,
        is_playing?: boolean,
        item?: Track | Object | null,
        currently_playing_type?: 'track' | 'episode' | 'ad' | 'unknown',
        actions?: {
            interrupting_playback: boolean;
            pausing: boolean;
            resuming: boolean;
            seeking: boolean;
            skipping_next: boolean;
            skipping_prev: boolean;
            toggling_repeat_context: boolean;
            toggling_repeat_track: boolean;
            toggling_shuffle: boolean;
            transferring_playback: boolean;
        } | null
    ) {
        this.device = device ?? null;
        this.repeat_state = repeat_state ?? 'off';
        this.shuffle_state = shuffle_state ?? false;
        this.context = context ?? null;
        this.timestamp = timestamp ?? 0;
        this.progress_ms = progress_ms ?? 0;
        this.is_playing = is_playing ?? false;
        this.item = item ?? null;
        this.currently_playing_type = currently_playing_type ?? 'unknown';
        this.actions = actions ?? null;
    }
}
