export function resolveAssetPath(assetPath: string): string {
    const normalizedAssetPath = assetPath.replace(/^\/+/, "");
    return `${import.meta.env.BASE_URL}${normalizedAssetPath}`;
}