<script lang="ts">
    import FallbackIcon from "$lib/components/FallbackIcon.svelte";
    import GardenGridPreview from "$lib/components/Garden/GardenGridPreview.svelte";
    import Window from "$lib/components/Window.svelte";
    import type { Garden } from "$lib/models/Garden.model";

    const garden1: Garden = {
        id: "MStF9SbHCsFR2557mE3j",
        name: "hello world",
        width: 5,
        height: 3,
        scale: 1,
        tiles: [
            [
                {
                    crop: null,
                },
                {
                    crop: {
                        id: "7y8a9dRxiKIAhMQcjCC4",
                        name: "tomato",
                        density: 5,
                        color: "#ec2d01",
                    },
                },
                { crop: null },
                {
                    crop: {
                        id: "8KCAM0VNslKqIhkhOmQ7",
                        name: "carrot",
                        density: 8,
                        color: "#ffae17",
                    },
                },
                {
                    crop: {
                        id: "8KCAM0VNslKqIhkhOmQ7",
                        name: "carrot",
                        density: 8,
                        color: "#ffae17",
                    },
                },
            ],
            [
                {
                    crop: {
                        id: "7y8a9dRxiKIAhMQcjCC4",
                        name: "tomato",
                        density: 5,
                        color: "#ec2d01",
                    },
                },
                { crop: null },
                { crop: null },
                { crop: null },
                {
                    crop: {
                        id: "8KCAM0VNslKqIhkhOmQ7",
                        name: "carrot",
                        density: 8,
                        color: "#ffae17",
                    },
                },
            ],
            [
                { crop: null },
                {
                    crop: {
                        id: "8KCAM0VNslKqIhkhOmQ7",
                        name: "carrot",
                        density: 8,
                        color: "#ffae17",
                    },
                },
                { crop: null },
                {
                    crop: {
                        id: "8KCAM0VNslKqIhkhOmQ7",
                        name: "carrot",
                        density: 8,
                        color: "#ffae17",
                    },
                },
                { crop: null },
            ],
        ],
    };

    const garden2: Garden = {
        id: "MStF9SbHCsFR2557mE3j",
        name: "hello world",
        width: 5,
        height: 3,
        scale: 1,
        tiles: [
            [
                {
                    crop: {
                        id: "7y8a9dRxiKIAhMQcjCC4",
                        name: "tomato",
                        density: 5,
                        color: "#ec2d01",
                    },
                },
                {
                    crop: {
                        id: "aoJr3J8PFdPX06QSYhZP",
                        name: "potato",
                        density: 12,
                        color: "#f2e355",
                    },
                },
                { crop: null },
                { crop: null },
                {
                    crop: {
                        id: "8KCAM0VNslKqIhkhOmQ7",
                        name: "carrot",
                        density: 8,
                        color: "#ffae17",
                    },
                },
            ],
            [
                {
                    crop: {
                        id: "8KCAM0VNslKqIhkhOmQ7",
                        name: "carrot",
                        density: 8,
                        color: "#ffae17",
                    },
                },
                {
                    crop: {
                        id: "7y8a9dRxiKIAhMQcjCC4",
                        name: "tomato",
                        density: 5,
                        color: "#ec2d01",
                    },
                },
                {
                    crop: {
                        id: "aoJr3J8PFdPX06QSYhZP",
                        name: "potato",
                        density: 12,
                        color: "#f2e355",
                    },
                },
                { crop: null },
                { crop: null },
            ],
            [
                { crop: null },
                {
                    crop: {
                        id: "8KCAM0VNslKqIhkhOmQ7",
                        name: "carrot",
                        density: 8,
                        color: "#ffae17",
                    },
                },
                {
                    crop: {
                        id: "7y8a9dRxiKIAhMQcjCC4",
                        name: "tomato",
                        density: 5,
                        color: "#ec2d01",
                    },
                },
                {
                    crop: {
                        id: "aoJr3J8PFdPX06QSYhZP",
                        name: "potato",
                        density: 12,
                        color: "#f2e355",
                    },
                },
                { crop: null },
            ],
        ],
    };
</script>

<svelte:head>
    <title>Farmers Market</title>
</svelte:head>

<main>
    <section class="grid grid-cols-12 grid-rows-12 h-screen fixed-height">
        <h1
            class="text-[72px] col-start-2 row-start-3 col-end-6 row-end-4 font-bold"
        >
            farmers<span class="text-accent">market</span>
        </h1>
        <div
            class="text-[24px] leading-8 col-start-2 row-start-5 col-end-6 row-end-7 flex flex-col gap-6"
        >
            <p>only 50% of canadians make a effort to buy local</p>
            <a
                class="proceed text-2xl text-accent flex flex-row gap-4 items-center"
                href="/gardens"
            >
                <span>lets change that!</span>
                <FallbackIcon
                    icon="ri:arrow-right-long-line"
                    preload={["ri:arrow-right-long-line"]}
                    class="inline-block mr-1"
                />
            </a>
        </div>
        <div class="col-start-7 col-end-12 row-start-3 row-end-10 pl-16">
            <Window>
                <div
                    class="flex flex-row justify-center items-center w-full h-full"
                >
                    <GardenGridPreview
                        garden={garden1}
                        pxTransform={(px) => px - 2}
                    />
                </div>
            </Window>
        </div>
    </section>
    <section class="grid grid-cols-12 grid-rows-12 h-screen">
        <h1 class="text-[52px] font-bold col-start-7 col-end-12 row-start-1 row-end-2">
            <span class="text-accent">plan</span> and <span class="text-accent">connect</span>
        </h1>
        <div
            class="text-[24px] mt-6 leading-8 col-start-7 row-start-2 col-end-11 row-end-4 flex flex-col gap-6"
        >
            <p>
                plan your gardens and connect with our large community of
                <span class="text-accent">gardeners and farmers</span>.
            </p>
        </div>
        <div class="col-start-2 row-start-1 col-end-7 row-end-8 pr-16 pb-14">
            <Window>
                <div
                    class="flex flex-row justify-center items-center w-full h-full"
                >
                    <GardenGridPreview
                        garden={garden2}
                        pxTransform={(px) => px - 2}
                    />
                </div>
            </Window>
        </div>
    </section>
</main>

<style lang="scss">
    .fixed-height {
        height: calc(100vh - 5rem);
    }

    .proceed {
        width: fit-content;
        background: linear-gradient(currentColor 0 0) bottom left/
            var(--underline-width, 0%) 0.1em no-repeat;
        padding: 0 0 0.2em;
        text-decoration: none;
        transition: background-size 0.25s;
    }

    .proceed:hover {
        --underline-width: 100%;
        cursor: pointer;
    }
</style>
