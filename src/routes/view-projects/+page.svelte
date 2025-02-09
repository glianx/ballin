<script lang="ts">
    import { fade } from 'svelte/transition';
    import * as Card from "$lib/components/ui/card";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Separator } from "$lib/components/ui/separator";

    const project = {
        title: "AI-Powered Code Assistant",
        status: "Active Development",
        technologies: ["Python", "Machine Learning", "Natural Language Processing"],
        description: "An intelligent coding companion that helps developers write better code faster. Using advanced machine learning algorithms, it provides real-time suggestions, identifies potential bugs, and automates repetitive tasks.",
        features: [
            {
                title: "Smart Code Completion",
                description: "Context-aware code suggestions that understand your project's structure and coding patterns."
            },
            {
                title: "Bug Prevention",
                description: "Real-time code analysis to catch potential issues before they become problems."
            },
            {
                title: "Automated Refactoring",
                description: "Intelligent suggestions for code improvements and automatic refactoring capabilities."
            }
        ]
    };
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
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>