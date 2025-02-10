<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fade, fly, scale, slide } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import type { Step } from '$lib/types';
    import { startupSteps } from '$lib/startup_steps';
    import { GripVertical } from 'lucide-svelte';

    let steps: Step[] = [];
    let timer = 180;
    let timerInterval: ReturnType<typeof setInterval>;
    let gameCompleted = false;
    let score = 0;
    let draggedItem: Step | null = null;
    let draggedIndex: number | null = null;
    let hoveredIndex: number | null = null;

    function shuffleArray(array: Step[]): Step[] {
        const arrayCopy = [...array];
        for (let i = arrayCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }
        return arrayCopy;
    }

    function startGame(): void {
        steps = shuffleArray(startupSteps);
        startTimer();
    }

    function startTimer(): void {
        timer = 180;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
            } else {
                endGame();
            }
        }, 1000);
    }

    function formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function handleDragStart(e: DragEvent, item: Step, index: number): void {
        draggedItem = item;
        draggedIndex = index;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
        }
    }

    function handleDragOver(e: DragEvent, index: number): void {
        e.preventDefault();
        hoveredIndex = index;
    }

    function handleDragLeave(): void {
        hoveredIndex = null;
    }

    function handleDrop(e: DragEvent, targetItem: Step, targetIndex: number): void {
        e.preventDefault();
        hoveredIndex = null;

        if (draggedItem && draggedItem !== targetItem && draggedIndex !== null) {
            const newSteps = [...steps];
            newSteps.splice(draggedIndex, 1);
            newSteps.splice(targetIndex, 0, draggedItem);
            steps = newSteps;
        }

        draggedItem = null;
        draggedIndex = null;
    }

    function handleDragEnd(): void {
        draggedItem = null;
        draggedIndex = null;
        hoveredIndex = null;
    }

    function checkOrder(): void {
        score = steps.reduce((acc, step, index) => {
            return acc + (step.correctOrder === index ? 1 : 0);
        }, 0);
        endGame();
    }

    function endGame(): void {
        clearInterval(timerInterval);
        gameCompleted = true;
    }

    function restartGame(): void {
        gameCompleted = false;
        score = 0;
        startGame();
    }

    onMount(() => {
        startGame();
    });

    onDestroy(() => {
        clearInterval(timerInterval);
    });
</script>

<div class="fixed inset-0 p-4 flex items-center justify-center" dir="rtl">
    <div class="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl flex flex-col h-[90vh]">
        <div class="p-6 flex flex-col h-full">
            {#if !gameCompleted}
                <div class="flex flex-col h-full" in:fade>
                    <div class="flex-shrink-0">
                        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                            <h2 class="text-xl font-bold text-gray-800">رتب خطوات بدء المشروع</h2>
                            <span class="font-bold {timer <= 30 ? 'text-red-600 animate-pulse' : 'text-indigo-600'}" role="timer" aria-label="الوقت المتبقي">
                                الوقت المتبقي: {formatTime(timer)}
                            </span>
                        </div>
                        <p class="text-gray-600 text-sm sm:text-base mb-4">اسحب وأفلت الخطوات لترتيبها بشكل صحيح</p>
                    </div>

                    <div class="flex-grow overflow-y-auto overflow-x-hidden mb-4 scrollbar-thin">
                        <ul class="space-y-2 list-none p-0 min-h-min" role="list">
                            {#each steps as step, index (step.id)}
                                <li animate:flip={{duration: 300}} class="transform transition-all duration-200">
                                    <div class="p-3 bg-gray-100 rounded-lg flex items-center gap-2 cursor-move hover:bg-gray-200 transition-colors duration-200 border-2 touch-manipulation {hoveredIndex === index ? 'border-indigo-500' : 'border-transparent'} {draggedItem?.id === step.id ? 'opacity-50' : ''}" draggable="true" on:dragstart={(e) => handleDragStart(e, step, index)} on:dragover={(e) => handleDragOver(e, index)} on:dragleave={handleDragLeave} on:drop={(e) => handleDrop(e, step, index)} on:dragend={handleDragEnd} role="listitem" aria-grabbed={draggedItem?.id === step.id} aria-dropeffect="move">
                                        <button class="drag-handle cursor-grab p-2 rounded-full bg-white shadow-md hover:bg-gray-200">
                                            <GripVertical size={20} />
                                        </button>
                                        {step.content}
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>
                    <button class="flex-shrink-0 w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]" on:click={checkOrder}>تحقق من الترتيب</button>
                </div>
            {:else}
                <div class="h-full overflow-y-auto text-center space-y-4" in:fly={{ y: 20, duration: 500 }} out:fly={{ y: -20, duration: 500 }}>
                    <h2 class="text-2xl font-bold mb-4">انتهت اللعبة!</h2>
                    <p class="text-xl">لقد رتبت {score} خطوات بشكل صحيح من أصل 10</p>
                </div>
                <button class="mt-8 mb-4 bg-indigo-600 text-white rounded-lg px-6 py-2 hover:bg-indigo-700 transform transition-transform duration-200 hover:scale-105 active:scale-95" on:click={restartGame}>العب مرة أخرى</button>
            {/if}
        </div>
    </div>
</div>
