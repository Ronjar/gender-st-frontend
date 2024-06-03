<script>
    import "../app.css";
    import { isAvatarEnabled } from "../store";
    let avatarEnabled = false;
    isAvatarEnabled.subscribe((value) => {
        avatarEnabled = value;
    });
</script>

<div class="min-h-screen">
    <!-- TopBar -->
    <header>
        <div class="navbar bg-base-100">
            <div class="flex-1">
                <img src="/img/uni_logo.png" class="h-20 m-2" />
            </div>
            {#if avatarEnabled}
                <div class="flex-none">
                    <div class="avatar">
                        <div class="w-20 m-2 rounded-full">
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                alt="User Avatar"
                            />
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
