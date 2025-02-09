<script lang="ts">
    export let params;
    const projectId = params.projectId;
  
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Separator } from "$lib/components/ui/separator";
    import { Badge } from "$lib/components/ui/badge";
  
    import { getDatabase, ref, get, update } from "firebase/database";
    import { getAuth } from "firebase/auth"; //for user auth into project
  
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
      features: []
    };
  
    let newTechnology = "";
    let newFeature: Feature = { title: "", description: "" };
    let error: string | null = null;
  
    onMount(async () => {
      const db = getDatabase();
      const projectRef = ref(db, `projects/${projectId}`);
      try {
        const snapshot = await get(projectRef);
        if (snapshot.exists()) {
          project = snapshot.val();
        }
      } catch (err) {
        error = err instanceof Error ? err.message : "Error fetching project data";
      }
    });
  
    function addTechnology() {
      if (newTechnology && !project.technologies.includes(newTechnology)) {
        project.technologies = [...project.technologies, newTechnology];
        newTechnology = "";
      }
    }
  
    function removeTechnology(tech: string) {
      project.technologies = project.technologies.filter(t => t !== tech);
    }
  
    function addFeature() {
      if (newFeature.title.trim() && newFeature.description.trim()) {
        project.features = [...project.features, { ...newFeature }];
        newFeature = { title: "", description: "" };
      }
    }
  
    function removeFeature(index: number) {
      project.features = project.features.filter((_, i) => i !== index);
    }
  
    async function handleSubmit() {
      try {
        error = null;
        if (!project.title || !project.status) {
          error = "Project title and status are required";
          return;
        }
        const db = getDatabase();
        const projectRef = ref(db, `projects/${projectId}`);
        await update(projectRef, {
          ...project,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        error = e instanceof Error ? e.message : "An error occurred while updating the project";
      }
    }
  </script>
  
  <div class="min-h-screen bg-background pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      {#if error}
        <div class="fixed top-4 right-4 bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-lg shadow-lg" role="alert" transition:fade>
          <span class="block sm:inline">{error}</span>
        </div>
      {/if}
      <div transition:fade>
        <Card.Root class="w-full">
          <form on:submit|preventDefault={handleSubmit} class="space-y-8">
            <Card.Header class="space-y-4">
              <Card.Title class="text-2xl font-bold text-center">Edit Project</Card.Title>
              <Card.Description class="text-center">Update project details</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-8">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Basic Information</h3>
                <Separator />
                <div class="grid gap-6">
                  <div class="space-y-2">
                    <Label for="title">Project Title</Label>
                    <Input id="title" bind:value={project.title} placeholder="Project title" required />
                  </div>
                  <div class="space-y-2">
                    <Label for="status">Status</Label>
                    <Input id="status" bind:value={project.status} placeholder="Project status" required />
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Project Overview</h3>
                <Separator />
                <div class="space-y-2">
                  <Label for="description">Description</Label>
                  <Textarea id="description" bind:value={project.description} placeholder="Describe your project..." class="min-h-[100px]" />
                </div>
              </div>
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Technologies</h3>
                <Separator />
                <div class="flex gap-2">
                  <Input placeholder="Add a technology..." bind:value={newTechnology} on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())} />
                  <Button type="button" on:click={addTechnology} variant="secondary">Add</Button>
                </div>
                <div class="flex flex-wrap gap-2">
                  {#each project.technologies as tech}
                    <Badge variant="secondary" class="px-3 py-1 cursor-pointer hover:bg-destructive/10" on:click={() => removeTechnology(tech)}>
                      {tech} <span class="ml-2 opacity-70">×</span>
                    </Badge>
                  {/each}
                </div>
              </div>
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Key Features</h3>
                <Separator />
                <div class="space-y-4">
                  {#each project.features as feature, index}
                    <div class="border p-4 rounded-md">
                      <div class="space-y-2">
                        <Label for="feature-title-{index}">Feature Title</Label>
                        <Input id="feature-title-{index}" bind:value={feature.title} placeholder="Feature title" />
                      </div>
                      <div class="space-y-2 mt-2">
                        <Label for="feature-description-{index}">Feature Description</Label>
                        <Textarea id="feature-description-{index}" bind:value={feature.description} placeholder="Feature description" class="min-h-[80px]" />
                      </div>
                      <Button type="button" variant="outline" on:click={() => removeFeature(index)} class="mt-2">Remove Feature</Button>
                    </div>
                  {/each}
                </div>
                <div class="border p-4 rounded-md space-y-2">
                  <h4 class="font-semibold">Add New Feature</h4>
                  <div class="space-y-2">
                    <Label for="new-feature-title">Feature Title</Label>
                    <Input id="new-feature-title" bind:value={newFeature.title} placeholder="Feature title" />
                  </div>
                  <div class="space-y-2">
                    <Label for="new-feature-description">Feature Description</Label>
                    <Textarea id="new-feature-description" bind:value={newFeature.description} placeholder="Feature description" class="min-h-[80px]" />
                  </div>
                  <Button type="button" variant="secondary" on:click={addFeature}>Add Feature</Button>
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
  