export interface MusicSourceItem {
  id: string;
  sourceId: string;
  title: string;
  artist?: string;
  artworkUrl?: string;
  duration?: number;
  playable: boolean;
}

export interface MusicSource {
  readonly id: string;
  readonly displayName: string;
  search(query: string): Promise<MusicSourceItem[]>;
  resolvePlayableUrl?(itemId: string): Promise<string>;
}
