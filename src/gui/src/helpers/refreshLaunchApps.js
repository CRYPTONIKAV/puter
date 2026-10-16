/**
 * Revalidate the Start-menu app list against the server. The list is cached
 * at boot, but apps can be created or deleted elsewhere (e.g. Dev Centre)
 * while the desktop stays open — without this a deleted app lingers in the
 * menu. A failed refresh keeps the cached list instead of an empty menu.
 */
export async function refreshLaunchApps () {
    try {
        window.launch_apps = await $.ajax({
            url: `${window.api_origin }/get-launch-apps?icon_size=64`,
            type: 'GET',
            async: true,
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${window.auth_token}`,
            },
        });
    } catch {
        window.launch_apps ??= { recommended: [], recent: [] };
    }
    return window.launch_apps;
}
