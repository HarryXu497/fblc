<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import auth from "$lib/state/auth.svelte";
    import type { UserCredential } from "firebase/auth";

    type FormType = "log-in" | "sign-up";

    interface Props {
        formType: FormType;
    }

    let { formType }: Props = $props();

    let firstName: string = $state("");
    let lastName: string = $state("");
    let email: string = $state("");
    let password: string = $state("");
    let error: string = $state("");

    async function onLogIn(e: SubmitEvent) {
        if (!email || !password) {
            error = "Invalid email or password";
            return;
        }

        try {
            await auth.logIn(email, password);
            goto("/gardens");
        } catch (e) {
            const code = (e as any).code;

            if (code === "auth/email-already-in-use") {
                await auth.logIn(email, password);
                await goto("/");
                return;
            }

            if (code === "auth/invalid-email") {
                error = "Invalid email";
                return;
            }

            if (code === "auth/invalid-credential") {
                error = "Wrong password";
                return;
            }

            error = "Something went wrong (" + code + ")";
            return;
        }
    }

    async function onSignUp() {
        if (!email.trim() || !password.trim()) {
            error = "Invalid input(s)";
            return;
        }

        let credentials: UserCredential;

        try {
            credentials = await auth.signUp(
                email,
                password,
                firstName,
                lastName,
            );
            await goto("/gardens");
        } catch (e) {
            const code = (e as any).code;

            if (code === "auth/email-already-in-use") {
                error = "Email already exists";
                return;
            }

            if (code === "auth/invalid-email") {
                error = "Invalid email";
                return;
            }

            if (code === "auth/weak-password") {
                error = "Password should be at least 6 characters";
                return;
            }

            error = "Something went wrong";
            return;
        }
    }
</script>

<form
    class="auth-form w-full items-center"
    onsubmit={(e) => {
        e.preventDefault();
        const callback = formType === "log-in" ? onLogIn : onSignUp;
        callback(e);
    }}
>
    {#if formType === "sign-up"}
        <div class="name-control flex w-full justify-between gap-[10%]">
            <div class="form-control w-1/2">
                <label for="first-name" class="font-bold">first name</label>
                <input
                    bind:value={firstName}
                    required
                    type="text"
                    name="first-name"
                    id="first-name"
                    placeholder="first name"
                />
            </div>
            <div class="form-control w-1/2">
                <label for="last-name">last name</label>
                <input
                    bind:value={lastName}
                    required
                    type="text"
                    name="last-name"
                    id="last-name"
                    placeholder="last name"
                />
            </div>
        </div>
    {/if}
    <div class="form-control">
        <label for="email">email</label>
        <input
            required
            type="email"
            name="email"
            id="email"
            placeholder="email"
            bind:value={email}
        />
    </div>
    <div class="form-control">
        <label for="password">password</label>
        <input
            required
            type="password"
            name="password"
            id="password"
            placeholder="password"
            bind:value={password}
        />
    </div>
    {#if error}
        <p class="text-[#b64040]">{error}</p>
    {/if}
    {#if formType === "sign-up"}
        <p>
            already have an account? <a
                class="font-bold text-accent hover:underline"
                href="{base}/log-in">log in</a
            >
        </p>
    {/if}
    <button
        class="mt-2 w-full rounded-lg bg-accent py-2 text-white transition-transform hover:-translate-y-1"
        type="submit">{formType === "log-in" ? "log in" : "sign up"}</button
    >
</form>

<style lang="postcss">
    @reference "tailwindcss";

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label {
        @apply mb-[2px] block w-full font-bold text-black;
    }
    .form-control > input {
        @apply w-full rounded-md p-2 placeholder-black outline-none;
        background-color: var(--color-light-accent);
    }

    .form-control > input:focus {
        @apply shadow-inner;
    }

    .form-control,
    .name-control {
        width: min(60vw, 30rem);
    }
</style>
