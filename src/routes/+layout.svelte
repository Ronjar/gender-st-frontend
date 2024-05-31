<script>
    import "../app.css";
</script>

<div class="min-h-screen">
    <!-- TopBar -->
    <header>
        <div class="navbar bg-base-100">
            <div class="flex-1">
                <img src='/img/uni_logo.png' class="h-10" />
            </div>
            <div class="flex-none">
                <div class="dropdown dropdown-end">
                    <div
                        tabindex="0"
                        role="button"
                        class="m-2 avatar"
                    >
                        <div class="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                            />
                        </div>
                    </div>
                </div>
            </div>
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
