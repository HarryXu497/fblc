import type { Crop } from "./Crop.model";

interface Tile {
    crop: Crop | null;
}

interface Garden extends GardenPreview {
    width: number; // number of tiles
    height: number; // number of tiles
    scale: number // real-life dimension of a tile
    tiles: Tile[][];
}

interface GardenPreview {
    id: string;
    name: string
}

export type { Garden, Tile, GardenPreview };