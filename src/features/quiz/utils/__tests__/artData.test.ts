import { fetchArtMetadata } from '../artData';

// We mock fetch because we are in a test environment
global.fetch = jest.fn();

describe('artData utility', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it('should fetch and parse artwork metadata correctly', async () => {
        const mockResponse = {
            ok: true,
            json: async () => {
                await Promise.resolve();
                return {
                    title: 'Mona Lisa',
                    description: 'painting by Leonardo da Vinci',
                    extract:
                        'The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci...',
                    originalimage: {
                        source: 'https://example.com/mona_lisa.jpg',
                    },
                    content_urls: {
                        desktop: {
                            page: 'https://en.wikipedia.org/wiki/Mona_Lisa',
                        },
                    },
                };
            },
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await fetchArtMetadata('Mona Lisa');

        expect(result).not.toBeNull();
        expect(result?.title).toBe('Mona Lisa');
        expect(result?.artist).toBe('Leonardo da Vinci');
        expect(result?.imageUrl).toBe('https://example.com/mona_lisa.jpg');
    });

    it('should handle fetch errors gracefully', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
        const result = await fetchArtMetadata('NonExistentPainting');
        expect(result).toBeNull();
    });
});
