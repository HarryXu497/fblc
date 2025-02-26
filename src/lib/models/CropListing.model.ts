/**
 * @param id the crop listing id
 * @param geohash the computed geohash of the listing's location
 * @param lat the latitude of the listing's location
 * @param lng the longitude of the listing's location
 * @param name the name of the crop listing
 * @param description the description of the crop listing
 * @param price the price of the crop listing
 * @param quantity the quantity of the crop listing
 * @param uid the id of the user that owns the crop listing
 * @param imageIDs a list of the image IDs of the listing
 * @param imageURLs a list of the image URLs of the listing
 */
interface CropListing {
    id: string;
    geohash: string;
    lat: number;
    lng: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    uid: string;
    imageIDs: string[];
    imageURLs: string[];
}

export type { CropListing };
