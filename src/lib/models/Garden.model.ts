import type { Crop } from "./Crop.model";

/**
 * @param crop the crop stored in the tile
 */
interface Tile {
    crop: Crop | null;
    planted?: boolean;
}

/**
 * @param id the id of the garden
 * @param name the name of the garden
 */
interface GardenPreview {
    id: string;
    name: string;
}

/**
 * @param width the width of the garden
 * @param height the height of the garden
 * @param scale the real-life size each tile corresponds to, in meters
 * @param tiles a 2D array of the crops in the garden
 */
interface Garden extends GardenPreview {
    width: number;
    height: number;
    scale: number;
    tiles: Tile[][];
}

export type { Garden, Tile, GardenPreview };
