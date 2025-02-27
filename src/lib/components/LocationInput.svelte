<script module lang="ts">
    export type LatLngLocation = {
        lat: number;
        lng: number;
    };

    /**
     * modulo function that always returns a non-negative integer
     */
    const modulo = (dividend: number, divisor: number) =>
        ((dividend % divisor) + divisor) % divisor;

    export { modulo };
</script>

<script lang="ts">
    /**
     * A component that allows users to select a location of a Leaflet Map
     */

    import getUserLocation from "$lib/utils/userLocation.svelte";

    import L from "leaflet";
    import "leaflet/dist/leaflet.css";

    /**
     * @param location the currently selected location or null if it has not been selected
     */
    interface Props {
        location: LatLngLocation | null;
    }

    let { location = $bindable() }: Props = $props();

    let map = $state<L.Map | null>(null);

    // Center the map to the user's current location
    $effect(() => {
        getUserLocation().then((loc) => {
            if (loc && map && !location) {
                map.setView([loc.coords.latitude, loc.coords.longitude], 16);
            }
        });
    });

    // Set up map using a Svelte Diretive on the component div
    function initMap(node: HTMLDivElement) {
        map = L.map(node).setView([43.64188, -79.37668], 16);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        map.on("click", (event) => (location = event.latlng));
    }

    // Add a marker on the selected location
    $effect(() => {
        if (map && location) {
            const marker = L.marker([location.lat, location.lng]);

            marker
                .addTo(map)
                .bindPopup(
                    `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`,
                )
                .openPopup();

            // Return a function to remove the current marker
            // when the location changes
            return () => map && marker.removeFrom(map);
        }
    });
</script>

<div use:initMap></div>

<style>
    div {
        width: 100%;
        height: 250px;
    }
</style>
