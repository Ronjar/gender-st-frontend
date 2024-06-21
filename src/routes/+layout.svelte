<script>
    import "../app.css";
    import unsaveddialog from "$lib/scripts/unsaveddialog";
    import { onMount } from "svelte";
    import { VERSION } from "$lib/constants";
    const { action } = unsaveddialog();
    import { avatarPath as storeAvatarPath } from "../store";

    export const ssr = false;

    console.log("Version:" + VERSION);

    let avatarEnabled = false;
    let avatarPath = "";
    storeAvatarPath.subscribe((value) => {
        avatarPath = value;
    });
    onMount( async() => {
        window.addEventListener('beforeunload', e => {
		e.preventDefault()
		return e.returnValue = "Are you sure you want to exit?";
	});
    })

</script>

<div class="min-h-screen">
    <!-- TopBar -->
    <header>
        <div class="navbar bg-base-100">
            <div class="flex-1">
                <img src="/img/uni_logo.png" class="h-20 m-2" alt="Icon of the University of Stuttgart"/>
            </div>
            {#if avatarPath}
                <div class="flex-none">
                    <div class="avatar">
                        <div class="w-20 m-2 rounded-full">
                            {#if avatarPath}
                            <img
                                src={avatarPath}
                            />
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-4">
        <slot />
    </main>

    <!-- Footer
    <footer class="footer p-10 bg-neutral text-neutral-content">
        <p>© 2024 Meine Anwendung</p>
    </footer> -->
</div>
