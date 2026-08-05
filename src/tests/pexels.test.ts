import assert from 'assert';
import { test, describe } from 'node:test';
import { PexelsService } from '../lib/services/pexelsService';
import { PexelsImageProvider } from '../modules/image-kernel/infrastructure/providers/PexelsImageProvider';

describe('Pexels Stock Photo Integration Tests', () => {
  test('PexelsService throws clear error when query is empty', async () => {
    await assert.rejects(
      async () => {
        await PexelsService.searchPhotos('  ');
      },
      (err: any) => err.message.includes('INVALID_PEXELS_QUERY')
    );
  });

  test('PexelsImageProvider has correct provider name', () => {
    const provider = new PexelsImageProvider();
    assert.strictEqual(provider.name, 'pexels');
  });
});
