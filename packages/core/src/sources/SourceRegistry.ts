import type { MusicSource, MusicSourceItem } from '@chaos-music/contracts';
import { AppError } from '../errors/AppError';

export class SourceRegistry {
  private readonly sources = new Map<string, MusicSource>();

  register(source: MusicSource) {
    if (!source.id.trim()) throw new AppError('VALIDATION', 'Music source id is required');
    this.sources.set(source.id, source);
  }

  get(sourceId: string) {
    const source = this.sources.get(sourceId);
    if (!source) throw new AppError('SOURCE_UNAVAILABLE', `Music source '${sourceId}' is not available`);
    return source;
  }

  list() {
    return [...this.sources.values()].map(({ id, displayName }) => ({ id, displayName }));
  }

  async search(sourceId: string, query: string): Promise<MusicSourceItem[]> {
    const normalized = query.trim();
    if (!normalized) return [];
    try {
      return await this.get(sourceId).search(normalized);
    } catch (error) {
      throw AppError.fromUnknown(error, 'EXTERNAL_PROVIDER_FAILURE');
    }
  }

  async resolvePlayableUrl(sourceId: string, itemId: string) {
    const source = this.get(sourceId);
    if (!source.resolvePlayableUrl) {
      throw new AppError('SOURCE_UNAVAILABLE', `Music source '${sourceId}' cannot resolve playback URLs`);
    }
    try {
      return await source.resolvePlayableUrl(itemId);
    } catch (error) {
      throw AppError.fromUnknown(error, 'EXTERNAL_PROVIDER_FAILURE');
    }
  }
}
