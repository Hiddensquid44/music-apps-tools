import { Injectable } from '@angular/core';
import { TrackService } from '../../shared/services/spotify-api/track-service';
import { PlaybackStateService } from '../../shared/services/spotify-api/playback-state-service';

@Injectable({
  providedIn: 'root'
})
export class BlindtestService {

  constructor(private playbackStateService: PlaybackStateService, private trackService: TrackService) {}

  public async skipToTrack(trackHref: string): Promise<void> {
    try {
      let queueEmpty = false;
      while (!queueEmpty) {
        await new Promise(res => setTimeout(res, 500));
        const track = await this.playbackStateService.getCurrentPlayingTrack();
        console.log('Currently playing track:', track?.href);
        console.log('Target track to skip to:', trackHref);
        if (track?.href === trackHref) {
          queueEmpty = true;
        } else {
          // Skip the currently playing track
          await this.trackService.playNextTrack();
        }
      }
      console.log('User queue cleared.');
    } catch (error) {
      console.error('Error clearing user queue:', error);
      throw error;
    }
  }
  
}
