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

<div class="min-h-screen bg-background">
    <!-- Hero section with image upload -->
    <div class="relative h-[300px] w-full">
        <label for="image-upload" class="block w-full h-full cursor-pointer">
            {#if imageFile?.[0]}
                <img 
                    src={URL.createObjectURL(imageFile[0])} 
                    alt="Project preview"
                    class="w-full h-full object-cover"
                />
            {:else}
                <div class="w-full h-full bg-muted flex items-center justify-center">
                    <div class="text-center">
                        <p class="text-2xl mb-2">📸</p>
                        <p class="text-muted-foreground">Click to upload project image</p>
                    </div>
                </div>
            {/if}
        </label>
        <input 
            id="image-upload"
            type="file"
            accept="image/*"
            class="hidden"
            bind:files={imageFile}
        />
    </div>

    <!-- Project form -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative">
        {#if error}
            <div class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                <span class="block sm:inline">{error}</span>
            </div>
        {/if}
        <div transition:fade>
            <Card.Root class="w-full">
                <form on:submit|preventDefault={handleSubmit}>
                    <Card.Header class="text-center space-y-4">
                        <Input
                            type="text"
                            placeholder="Project Title"
                            class="text-3xl text-center"
                            bind:value={project.title}
                        />
                        <div class="space-y-2">
                            <Input
                                type="text"
                                placeholder="Project Status (e.g., Active Development)"
                                bind:value={project.status}
                            />
                            <div class="flex flex-wrap gap-2">
                                {#each project.technologies as tech}
                                    <Badge variant="outline" class="cursor-pointer" on:click={() => removeTechnology(tech)}>
                                        {tech} ✕
                                    </Badge>
                                {/each}
                            </div>
                            <div class="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Add Technology"
                                    bind:value={newTechnology}
                                />
                                <Button type="button" variant="outline" on:click={addTechnology}>Add</Button>
                            </div>
                        </div>
                    </Card.Header>

                    <Card.Content class="space-y-6">
                        <!-- Project Overview -->
                        <div>
                            <Label for="description">Project Overview</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your project..."
                                class="mt-2"
                                bind:value={project.description}
                            />
                        </div>

                        <Separator />

                        <!-- Key Features -->
                        <div>
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-xl font-semibold">Key Features</h2>
                                <Button type="button" variant="outline" size="sm" on:click={addFeature}>
                                    Add Feature
                                </Button>
                            </div>
                            <div class="space-y-4">
                                {#each project.features as feature, i}
                                    <Card.Root class="relative">
                                        <Button 
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            class="absolute top-2 right-2"
                                            on:click={() => removeFeature(i)}
                                        >
                                            ✕
                                        </Button>
                                        <Card.Header>
                                            <Input
                                                type="text"
                                                placeholder="Feature Title"
                                                bind:value={feature.title}
                                            />
                                            <Textarea
                                                placeholder="Feature Description"
                                                class="mt-2"
                                                bind:value={feature.description}
                                            />
                                        </Card.Header>
                                    </Card.Root>
                                {/each}
                            </div>
                        </div>
                    </Card.Content>

                    <Card.Footer class="flex justify-center gap-4">
                        <Button type="submit" variant="default">Create Project</Button>
                        <Button type="button" variant="outline">Cancel</Button>
                    </Card.Footer>
                </form>
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