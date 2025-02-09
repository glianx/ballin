<script lang="ts">
    import { fade } from 'svelte/transition';
    import * as Card from "$lib/components/ui/card";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Separator } from "$lib/components/ui/separator";
    import { onMount } from 'svelte';
    import { getDatabase, ref, get } from "firebase/database";

    interface Profile {
        name: string;
        age: number;
        university: string;
        bio: string;
        projectProposals: ProjectProposal[];
    }

    let profile: Profile = {
        name: "",
        age: 0,
        university: "",
        bio: "",
        projectProposals: []
    };

    let error: string | null = null;

    onMount(async () => {
        const db = getDatabase();
        const profileRef = ref(db, profiles/${profileId});
        try {
        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
            profile = snapshot.val();
        } else {
            console.log("No profile data found for", profileId);
        }
        } catch (err) {
        error = err instanceof Error ? err.message : "Error fetching profile data";
        console.error("Error fetching profile data:", err);
        }
    });
</script>

<div class="min-h-screen bg-background">
    <!-- Hero section with background image -->
    <div class="relative h-[300px] w-full">
        <img 
            src="src/routes/view-profiles/founder.jpeg" 
            alt="Profile background"
            class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <!-- Profile content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative">
        <div transition:fade>
            <Card.Root class="w-full">
                <Card.Header class="text-center">
                    <div class="mx-auto mb-4">
                        <Avatar.Root class="h-24 w-24 mx-auto">
                            <Avatar.Image
                                src="/startup-founder.jpeg"
                                alt={profile.name}
                            />
                            <Avatar.Fallback>{profile.name.split(' ').map(n => n[0]).join('')}</Avatar.Fallback>
                        </Avatar.Root>
                    </div>
                    <Card.Title class="text-3xl">{profile.name}</Card.Title>
                    <Card.Description>
                        <div class="flex items-center justify-center gap-2 mt-2">
                            <Badge variant="secondary">Age: {profile.age}</Badge>
                            <Badge variant="outline">{profile.university}</Badge>
                        </div>
                    </Card.Description>
                </Card.Header>

                <Card.Content class="space-y-6">
                    <!-- Bio -->
                    <div>
                        <h2 class="text-xl font-semibold mb-3">About</h2>
                        <p class="text-muted-foreground leading-relaxed">{profile.bio}</p>
                    </div>

                    <Separator />

                    <!-- Project Proposals -->
                    <div>
                        <h2 class="text-xl font-semibold mb-4">Project Proposals</h2>
                        <div class="space-y-4">
                            {#each profile.projectProposals as project}
                                <Card.Root class="hover:bg-muted/50 transition-colors">
                                    <Card.Header>
                                        <Card.Title>{project.title}</Card.Title>
                                        <Card.Description>
                                            {project.description}
                                        </Card.Description>
                                    </Card.Header>
                                    <Card.Footer class="flex justify-end">
                                        <Button variant="outline" size="sm">Learn More</Button>
                                    </Card.Footer>
                                </Card.Root>
                            {/each}
                        </div>
                    </div>
                </Card.Content>

                <Card.Footer class="flex justify-center">
                    <Button variant="default">Contact Sarah</Button>
                </Card.Footer>
            </Card.Root>
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>