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
    import { onMount } from 'svelte';

    interface Feature {
        title: string;
        description: string;
    }

    interface Project {
        title: string;
        status: string;
        technologies: string[];
        description: string;
        features: Feature[];
    }

    let project: Project = {
        title: "",
        status: "",
        technologies: [],
        description: "",
        features: [
            { title: "", description: "" },
            { title: "", description: "" },
            { title: "", description: "" }
        ]
    };

    let imageFile: FileList | null = null;
    let newTechnology = "";
    let error: string | null = null;

    onMount(() => {
        console.log('Add Project page mounted');
    });

    async function handleSubmit() {
        try {
            error = null;
            // Handle form submission
            console.log('Submitting project:', project);
            console.log('Image:', imageFile?.[0]);
            
            // Validate form
            if (!project.title) {
                error = "Project title is required";
                return;
            }

            // TODO: Add actual form submission logic here
            
        } catch (e) {
            console.error('Error submitting form:', e);
            error = e instanceof Error ? e.message : 'An error occurred while submitting the form';
        }
    }

    function addTechnology() {
        if (newTechnology) {
            project.technologies = [...project.technologies, newTechnology];
            newTechnology = "";
        }
    }

    function removeTechnology(tech: string) {
        project.technologies = project.technologies.filter(t => t !== tech);
    }

    function addFeature() {
        project.features = [...project.features, { title: "", description: "" }];
    }

    function removeFeature(index: number) {
        project.features = project.features.filter((_, i) => i !== index);
    }
</script>

<div class="min-h-screen bg-background pb-16">
    <!-- Hero section with image upload -->
    <div class="relative h-[300px] w-full bg-gradient-to-r from-primary/10 to-primary/5">
        <label for="image-upload" class="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
            {#if imageFile?.[0]}
                <img 
                    src={URL.createObjectURL(imageFile[0])} 
                    alt="Project preview"
                    class="w-full h-full object-cover"
                />
            {:else}
                <div class="w-full h-full flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                    <div class="text-center">
                        <p class="text-4xl mb-3">📸</p>
                        <p class="text-muted-foreground font-medium">Click to upload project image</p>
                        <p class="text-sm text-muted-foreground/75 mt-1">Recommended: 1200x600px</p>
                    </div>
                </div>
            {/if}
            <input
                id="image-upload"
                type="file"
                accept="image/*"
                class="hidden"
                bind:files={imageFile}
            />
        </label>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative">
        {#if error}
            <div class="fixed top-4 right-4 bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-lg shadow-lg" role="alert" transition:fade>
                <span class="block sm:inline">{error}</span>
            </div>
        {/if}

        <div transition:fade>
            <Card.Root class="w-full backdrop-blur-sm bg-background/95">
                <form on:submit|preventDefault={handleSubmit} class="space-y-8">
                    <Card.Header class="space-y-4">
                        <Card.Title class="text-2xl font-bold text-center">Add New Project</Card.Title>
                        <Card.Description class="text-center">Share your latest creation with the world</Card.Description>
                    </Card.Header>

                    <Card.Content class="space-y-8">
                        <!-- Basic Info Section -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold">Basic Information</h3>
                            <Separator />
                            <div class="grid gap-6">
                                <div class="space-y-2">
                                    <Label for="title">Project Title</Label>
                                    <Input id="title" bind:value={project.title} placeholder="Enter project title" required />
                                </div>
                                <div class="space-y-2">
                                    <Label for="status">Project Status</Label>
                                    <Input id="status" bind:value={project.status} placeholder="e.g., In Progress, Completed" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="description">Project Description</Label>
                                    <Textarea
                                        id="description"
                                        bind:value={project.description}
                                        placeholder="Describe your project..."
                                        class="min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Technologies Section -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold">Technologies Used</h3>
                            <Separator />
                            <div class="space-y-4">
                                <div class="flex gap-2">
                                    <Input
                                        placeholder="Add a technology..."
                                        bind:value={newTechnology}
                                        on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                                    />
                                    <Button type="button" on:click={addTechnology} variant="secondary">Add</Button>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    {#each project.technologies as tech}
                                        <Badge variant="secondary" class="px-3 py-1 cursor-pointer hover:bg-destructive/10" on:click={() => removeTechnology(tech)}>
                                            {tech}
                                            <span class="ml-2 opacity-70">×</span>
                                        </Badge>
                                    {/each}
                                </div>
                            </div>
                        </div>

                        <!-- Features Section -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold">Key Features</h3>
                                <Button type="button" variant="outline" size="sm" on:click={addFeature}>Add Feature</Button>
                            </div>
                            <Separator />
                            <div class="space-y-6">
                                {#each project.features as feature, i}
                                    <div class="space-y-4 p-4 rounded-lg bg-muted/50 relative group">
                                        <button
                                            type="button"
                                            class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center"
                                            on:click={() => removeFeature(i)}
                                        >×</button>
                                        <div class="space-y-2">
                                            <Label for="feature-title-{i}">Feature Title</Label>
                                            <Input
                                                id="feature-title-{i}"
                                                bind:value={feature.title}
                                                placeholder="Enter feature title"
                                            />
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="feature-desc-{i}">Feature Description</Label>
                                            <Textarea
                                                id="feature-desc-{i}"
                                                bind:value={feature.description}
                                                placeholder="Describe this feature..."
                                                class="min-h-[80px]"
                                            />
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </Card.Content>

                    <Card.Footer class="flex justify-end">
                        <Button type="submit" class="w-full sm:w-auto">Create Project</Button>
                    </Card.Footer>
                </form>
            </Card.Root>
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        background: hsl(var(--background));
    }
</style>