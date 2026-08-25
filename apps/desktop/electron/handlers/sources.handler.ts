import { desktopApplication } from '../composition/createDesktopApplication';
import { registerHandler } from '../utils/ipc';

registerHandler('sources:list', async () => ({
  success: true,
  data: desktopApplication.sources.list(),
}));

registerHandler('sources:search', async (_event, sourceId: unknown, query: unknown) => {
  try {
    const data = await desktopApplication.sources.search(String(sourceId ?? ''), String(query ?? ''));
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [], error: error instanceof Error ? error.message : 'Source search failed' };
  }
});

registerHandler('sources:resolve-playable-url', async (_event, sourceId: unknown, itemId: unknown) => {
  try {
    const data = await desktopApplication.sources.resolvePlayableUrl(String(sourceId ?? ''), String(itemId ?? ''));
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Source resolution failed' };
  }
});
