<script lang="ts">
    export let params;
    const projectId = params.projectId;
  
    import { fade } from 'svelte/transition';
    import * as Card from "$lib/components/ui/card";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Separator } from "$lib/components/ui/separator";
  
    import { onMount } from 'svelte';
    import { getDatabase, ref, get } from "firebase/database";
  
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
  
    let error: string | null = null;
  
    onMount(async () => {
      const db = getDatabase();
      const projectRef = ref(db, `projects/${projectId}`);
      try {
        const snapshot = await get(projectRef);
        if (snapshot.exists()) {
          project = snapshot.val();
        } else {
          console.log("No project data found for", projectId);
        }
      } catch (err) {
        error = err instanceof Error ? err.message : "Error fetching project data";
        console.error("Error fetching project data:", err);
      }
    });
  </script>
  
  <div class="min-h-screen bg-background">
    <!-- Hero section with background image -->
    <div class="relative h-[300px] w-full">
      <img 
        src="src/routes/view-projects/idea.avif" 
        alt="Project concept"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/40"></div>
    </div>
  
    <!-- Project content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative">
      {#if error}
        <div class="bg-red-500 text-white p-4">{error}</div>
      {/if}
  
      {#if project.title}
        <div transition:fade>
          <Card.Root class="w-full">
            <Card.Header class="text-center">
              <Card.Title class="text-3xl">{project.title}</Card.Title>
              <Card.Description>
                <div class="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="secondary">{project.status}</Badge>
                  {#each project.technologies as tech}
                    <Badge variant="outline">{tech}</Badge>
                  {/each}
                </div>
              </Card.Description>
            </Card.Header>
  
            <Card.Content class="space-y-6">
              <!-- Project Overview -->
              <div>
                <h2 class="text-xl font-semibold mb-3">Project Overview</h2>
                <p class="text-muted-foreground leading-relaxed">{project.description}</p>
              </div>
  
              <Separator />
  
              <!-- Key Features -->
              <div>
                <h2 class="text-xl font-semibold mb-4">Key Features</h2>
                <div class="space-y-4">
                  {#each project.features as feature}
                    <Card.Root class="hover:bg-muted/50 transition-colors">
                      <Card.Header>
                        <Card.Title>{feature.title}</Card.Title>
                        <Card.Description>
                          {feature.description}
                        </Card.Description>
                      </Card.Header>
                    </Card.Root>
                  {/each}
                </div>
              </div>
            </Card.Content>
  
            <Card.Footer class="flex justify-center gap-4">
              <Button variant="default">Join Project</Button>
              <Button variant="outline">View Repository</Button>
            </Card.Footer>
          </Card.Root>
        </div>
      {:else}
        <p class="text-center mt-10">Loading project...</p>
      {/if}
    </div>
  </div>
  
  <style>
    :global(body) {
      margin: 0;
      padding: 0;
    }
  </style>
  