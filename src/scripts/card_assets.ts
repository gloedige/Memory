import { resolveAssetPath } from "./asset_paths";

const createThemeImagePaths = (themeFolder: string, filePrefix: string): string[] => {
        return Array.from({ length: 18 }, (_, index) => {
                const fileNumber = String(index + 1).padStart(2, "0");
                return resolveAssetPath(`assets/images/${themeFolder}/${filePrefix}_${fileNumber}.svg`);
        });
};

export const CODE_VIBES_CARDS_IMAGES: string[] = createThemeImagePaths("code_vibes_theme", "code_vibes_theme");
export const CODE_VIBES_CARD_BACK: string = resolveAssetPath("assets/images/code_vibes_theme/code_vibes_card_back.svg");

export const GAMES_CARDS_IMAGES: string[] = createThemeImagePaths("games_theme", "games_theme");
export const GAMES_CARD_BACK: string = resolveAssetPath("assets/images/games_theme/gaming_card_back.svg");