import { firestore } from "$lib/firebase";
import type { Crop } from "$lib/models/Crop.model";
import { collection, getDocs } from "firebase/firestore";

/**
 * Gets all crops stored in Firestore
 * @returns a list of 'Crop' objects
 */
async function getCrops(): Promise<Crop[]> {
    const cropCollectionRef = collection(firestore, "crops");

    const cropDocs = await getDocs(cropCollectionRef);

    return cropDocs.docs.map((c) => ({
        id: c.id,
        name: c.get("name"),
        density: c.get("density") as number,
        color: c.get("color"),
    }));
}

/**
 * Gets all crop tips associated with a crop stored in Firestore
 * @returns a list of strings
 */
async function getCropTips(cropId: string): Promise<string[]> {
    const cropCollectionRef = collection(firestore, "crops", cropId, "tips");

    const cropDocs = await getDocs(cropCollectionRef);

    return cropDocs.docs.map(c => c.get("tip") as string);
}

/**
 * Creates an object with a stateful 'value' property
 * and helper methods to retrieve a crop by its color or name
 */
function createCropState() {
    let cropState = $state<Crop[] | null>(null);
    let cropTips = $state<Map<string, string[]> | null>(null);

    // Compute a map of names to colors
    let cropColors = $derived.by(() => {
        if (cropState === null) {
            return;
        }

        const pairs = cropState.map(
            (c) => [c.name, c.color] as [string, string],
        );

        return new Map(pairs);
    });

    // Computes a map of names to 'Crop' objects
    let cropMap = $derived.by(() => {
        if (cropState === null) {
            return;
        }

        const pairs = cropState.map((c) => [c.name, c] as [string, Crop]);

        return new Map(pairs);
    });

    getCrops()
        .then((crops) => {
            cropState = crops;
            return cropState;
        })
        .then(crops => {
            return Promise.all(crops.map(c => getCropTips(c.id)));
        })
        .then(tips => {
            if (cropState !== null) {
                cropTips = new Map(cropState.map((_, i) => [cropState![i].id, tips[i]]))
            }
        });

    return {
        get value() {
            return cropState;
        },
        getTips(cropId: string) {
            return cropTips?.get(cropId) || null;
        },
        getColor(key: string) {
            return cropColors?.get(key) || null;
        },
        fromName(name: string) {
            return cropMap?.get(name) || null;
        },
    };
}

const crops = createCropState();
export default crops;
