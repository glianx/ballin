<script lang="ts">
	import "../app.css";
    import { Button } from "$lib/components/ui/button";
    import { UserCircle, FolderKanban, MessageCircle, PlusSquare, Settings } from "lucide-svelte";
</script>

<div class="min-h-[100dvh] flex flex-col">
    <slot />

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 px-4">
        <div class="max-w-md mx-auto h-full flex items-center justify-between">
            <a href="/view-profiles" class="flex-1">
                <Button variant="ghost" class="w-full h-14 flex flex-col items-center justify-center gap-1 rounded-none">
                    <UserCircle class="h-6 w-6" />
                    <span class="text-xs">Profiles</span>
                </Button>
            </a>

            <a href="/view-projects" class="flex-1">
                <Button variant="ghost" class="w-full h-14 flex flex-col items-center justify-center gap-1 rounded-none">
                    <FolderKanban class="h-6 w-6" />
                    <span class="text-xs">Projects</span>
                </Button>
            </a>

            <a href="/chat-page" class="flex-1">
                <Button variant="ghost" class="w-full h-14 flex flex-col items-center justify-center gap-1 rounded-none">
                    <MessageCircle class="h-6 w-6" />
                    <span class="text-xs">Chat</span>
                </Button>
            </a>

            <a href="/add-project" class="flex-1">
                <Button variant="ghost" class="w-full h-14 flex flex-col items-center justify-center gap-1 rounded-none">
                    <PlusSquare class="h-6 w-6" />
                    <span class="text-xs">Add</span>
                </Button>
            </a>

            <a href="/edit-profile" class="flex-1">
                <Button variant="ghost" class="w-full h-14 flex flex-col items-center justify-center gap-1 rounded-none">
                    <Settings class="h-6 w-6" />
                    <span class="text-xs">Settings</span>
                </Button>
            </a>
        </div>
    </nav>

    <!-- Add padding to prevent content from being hidden behind the navigation bar -->
    <div class="h-16"></div>
</div>

<style>
    /* Prevent overscroll bounce effect on mobile */
    :global(body) {
        overscroll-behavior: none;
    }
</style>