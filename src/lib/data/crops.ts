import type { CropType } from "$lib/models/Garden.model";

const crops = ["Carrot", "Potato"] as const;
const cropColors: Record<CropType, string> = {
    "Carrot": "#ffae17",
    "Potato": "#f2e355",
}

export { cropColors }
export default crops;