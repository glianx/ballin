<script lang="ts">
    import { fade } from 'svelte/transition';
    import * as Card from "$lib/components/ui/card";
    import * as Form from "$lib/components/ui/form";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Separator } from "$lib/components/ui/separator";
    import { Badge } from "$lib/components/ui/badge";
    import { Upload } from "lucide-svelte";
    import { onMount } from 'svelte';

    interface Profile {
        name: string;
        username: string;
        bio: string;
        email: string;
        website: string;
        skills: string[];
    }

    let profile: Profile = {
        name: "",
        username: "",
        bio: "",
        email: "",
        website: "",
        skills: []
    };

    let avatarFile: FileList | null = null;
    let newSkill = "";
    let error: string | null = null;

    onMount(() => {
        // TODO: Fetch current user profile data
        console.log('Edit Profile page mounted');
    });

    async function handleSubmit() {
        try {
            error = null;
            console.log('Submitting profile:', profile);
            console.log('Avatar:', avatarFile?.[0]);
            
            if (!profile.name || !profile.username) {
                error = "Name and username are required";
                return;
            }

            // TODO: Add actual profile update logic here
            
        } catch (e) {
            console.error('Error updating profile:', e);
            error = e instanceof Error ? e.message : 'An error occurred while updating the profile';
        }
    }

    function addSkill() {
        if (newSkill && !profile.skills.includes(newSkill)) {
            profile.skills = [...profile.skills, newSkill];
            newSkill = "";
        }
    }

    function removeSkill(skill: string) {
        profile.skills = profile.skills.filter(s => s !== skill);
    }
</script>

<div class="min-h-screen bg-background pb-16">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {#if error}
            <div class="fixed top-4 right-4 bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-lg shadow-lg" role="alert" transition:fade>
                <span class="block sm:inline">{error}</span>
            </div>
        {/if}

        <div transition:fade>
            <Card.Root class="w-full">
                <form on:submit|preventDefault={handleSubmit} class="space-y-8">
                    <Card.Header class="space-y-4">
                        <Card.Title class="text-2xl font-bold text-center">Edit Profile</Card.Title>
                        <Card.Description class="text-center">Update your personal information</Card.Description>
                        
                        <!-- Avatar Upload -->
                        <div class="flex justify-center">
                            <label for="avatar-upload" class="cursor-pointer">
                                <div class="w-32 h-32 rounded-full overflow-hidden bg-muted hover:opacity-90 transition-opacity border-2 border-dashed border-muted-foreground/25 flex items-center justify-center relative group">
                                    {#if avatarFile?.[0]}
                                        <img 
                                            src={URL.createObjectURL(avatarFile[0])} 
                                            alt="Avatar preview"
                                            class="w-full h-full object-cover"
                                        />
                                    {:else}
                                        <div class="w-full h-full flex items-center justify-center bg-muted">
                                            <div class="text-center">
                                                <Upload class="w-12 h-12 mb-2 mx-auto text-muted-foreground" />
                                                <p class="text-muted-foreground font-medium">Upload Photo</p>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    bind:files={avatarFile}
                                />
                            </label>
                        </div>
                    </Card.Header>

                    <Card.Content class="space-y-8">
                        <!-- Basic Info Section -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold">Basic Information</h3>
                            <Separator />
                            <div class="grid gap-6">
                                <div class="grid sm:grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <Label for="name">Full Name</Label>
                                        <Input id="name" bind:value={profile.name} placeholder="Your full name" required />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="username">Username</Label>
                                        <Input id="username" bind:value={profile.username} placeholder="@username" required />
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <Label for="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        bind:value={profile.bio}
                                        placeholder="Tell us about yourself..."
                                        class="min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Contact Section -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold">Contact Information</h3>
                            <Separator />
                            <div class="grid gap-4">
                                <div class="space-y-2">
                                    <Label for="email">Email</Label>
                                    <Input id="email" type="email" bind:value={profile.email} placeholder="your@email.com" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="website">Website</Label>
                                    <Input id="website" type="url" bind:value={profile.website} placeholder="https://yourwebsite.com" />
                                </div>
                            </div>
                        </div>

                        <!-- Skills Section -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold">Skills</h3>
                            <Separator />
                            <div class="space-y-4">
                                <div class="flex gap-2">
                                    <Input
                                        placeholder="Add a skill..."
                                        bind:value={newSkill}
                                        on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    />
                                    <Button type="button" on:click={addSkill} variant="secondary">Add</Button>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    {#each profile.skills as skill}
                                        <Badge variant="secondary" class="px-3 py-1 cursor-pointer hover:bg-destructive/10" on:click={() => removeSkill(skill)}>
                                            {skill}
                                            <span class="ml-2 opacity-70">×</span>
                                        </Badge>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </Card.Content>

                    <Card.Footer class="flex justify-end gap-4">
                        <Button type="button" variant="outline">Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </Card.Footer>
                </form>
            </Card.Root>
        </div>
    </div>
</div>
