import crops from "$lib/data/crops";

type CropType = typeof crops[number]

interface Tile {
    crop: CropType | null;
}

interface Garden {
    width: number; // number of tiles
    height: number; // number of tiles
    scale: number // real-life dimension of a tile
    tiles: Tile[][];
}

export type { Garden, Tile, CropType };