import { beforeEach, describe, expect, it, vi } from 'vitest';

globalThis.window = globalThis.window ?? {};
window.api_origin = 'https://api.test';
window.auth_token = 'tok';

const { refreshLaunchApps } = await import('./refreshLaunchApps.js');

describe('refreshLaunchApps', () => {
    beforeEach(() => {
        delete window.launch_apps;
        globalThis.$ = { ajax: vi.fn() };
    });

    it('replaces a stale cached list with the server list', async () => {
        window.launch_apps = {
            recent: [{ name: 'deleted-app' }],
            recommended: [],
        };
        $.ajax.mockResolvedValue({ recent: [], recommended: [] });

        const apps = await refreshLaunchApps();

        expect($.ajax).toHaveBeenCalledOnce();
        expect(apps.recent).toEqual([]);
        expect(window.launch_apps.recent).toEqual([]);
    });

    it('keeps the cached list when the refresh fails', async () => {
        const cached = { recent: [{ name: 'keep-me' }], recommended: [] };
        window.launch_apps = cached;
        $.ajax.mockRejectedValue(new Error('offline'));

        const apps = await refreshLaunchApps();

        expect(apps).toBe(cached);
    });

    it('falls back to an empty menu when there is no cache and the refresh fails', async () => {
        $.ajax.mockRejectedValue(new Error('offline'));

        const apps = await refreshLaunchApps();

        expect(apps).toEqual({ recommended: [], recent: [] });
    });
});
