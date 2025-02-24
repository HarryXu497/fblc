import { firestore } from "$lib/firebase";
import type { Crop } from "$lib/models/Crop.model";
import { collection, getDocs } from "firebase/firestore";

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

function createCropState() {
    let cropState = $state<Crop[] | null>(null);
    let cropColors = $derived.by(() => {
        if (cropState === null) {
            return;
        }

        const pairs = cropState.map(
            (c) => [c.name, c.color] as [string, string],
        );

        return new Map(pairs);
    });
    let cropMap = $derived.by(() => {
        if (cropState === null) {
            return;
        }

        const pairs = cropState.map((c) => [c.name, c] as [string, Crop]);

        return new Map(pairs);
    });

    getCrops().then((c) => (cropState = c));

    return {
        get value() {
            return cropState;
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
