import { Playlist } from "../../shared/models/playlist";
import { Track } from "../../shared/models/track";

export class BlindtestData {

  public static readonly MAX_TRACKS = 10;

  public static currentPlaylist: Playlist;
  public static currentTrack: Track;
}