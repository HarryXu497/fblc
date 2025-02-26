/**
 * @param id the crop id
 * @param name the name of the crop
 * @param density the number of the crop that can fit in a square meter
 * @param color the color of the crop
 */
interface Crop {
    id: string;
    name: string;
    density: number;
    color: string;
}

export type { Crop };
