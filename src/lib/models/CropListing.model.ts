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
    imageIDs: string[]
    imageURLs: string[];
}

export type { CropListing };
