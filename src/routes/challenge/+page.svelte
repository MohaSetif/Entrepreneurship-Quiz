<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { quizQuestions } from '$lib/questions';
    import type { Question, Team } from '$lib/types';
	import { goto } from '$app/navigation';

    let currentQuestionIndex = 0;
    let timer = 30;
    let timerInterval: number;
    let selectedAnswer: number | null = null;
    let isAnswerSubmitted = false;
    let quizCompleted = false;
    let currentTeam = 0; // 0 for team 1, 1 for team 2

    let teams: Team[] = [
        { name: "الفريق الأول", score: 0, questionsAnswered: 0 },
        { name: "الفريق الثاني", score: 0, questionsAnswered: 0 }
    ];

    function startTimer() {
        timer = 30;
        timerInterval = setInterval(() => {
            if (timer > 0 && !selectedAnswer) {
                timer--;
                if (timer === 0) {
                    handleTimerExpired();
                }
            }
        }, 1000);
    }

    function handleTimerExpired() {
        clearInterval(timerInterval);
        isAnswerSubmitted = true;
        teams[currentTeam].questionsAnswered++;
        // Auto proceed to next question after 5 seconds
        setTimeout(() => nextQuestion(), 5000);
    }

    function selectAnswer(index: number) {
        if (!isAnswerSubmitted) {
            selectedAnswer = index;
            clearInterval(timerInterval);
        }
    }

    function submitAnswer() {
        if (selectedAnswer === null) return;

        isAnswerSubmitted = true;
        const currentQuestion = quizQuestions[currentQuestionIndex];
        
        if (selectedAnswer === currentQuestion.correctAnswer) {
            teams[currentTeam].score += 10;
            if (timer > 0) {
                teams[currentTeam].score += Math.floor(timer / 2); // Bonus points for quick answers
            }
        }
        teams[currentTeam].questionsAnswered++;
    }

    function nextQuestion() {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            selectedAnswer = null;
            isAnswerSubmitted = false;
            currentTeam = (currentTeam + 1) % 2; // Switch teams
            startTimer();
        } else {
            quizCompleted = true;
        }
    }

    onMount(() => {
        startTimer();
    });

    onDestroy(() => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
    });
</script>

<div class="flex items-center justify-center" dir="rtl">
    <div class="w-full max-w-2xl mx-4">
        <div class="bg-white rounded-3xl shadow-2xl p-6">
            {#if !quizCompleted}
                <div class="w-full">
                    <div class="space-y-4">
                        <!-- Team Scores -->
                        <div class="flex justify-between text-sm">
                            <div class="text-indigo-950">
                                {teams[0].name}: {teams[0].score} نقطة
                            </div>
                            <div class="text-red-600">
                                {teams[1].name}: {teams[1].score} نقطة
                            </div>
                        </div>

                        <div class="flex justify-between">
                            <span class="font-bold text-indigo-950">سؤال {currentQuestionIndex + 1}/10</span>
                            <span class="font-bold {timer <= 5 ? 'text-red-600 animate-pulse' : 'text-red-600'}">
                                الوقت: {timer} ثانية
                            </span>
                        </div>
                        
                        <div class="text-xl font-semibold text-center">
                            دور {teams[currentTeam].name}
                        </div>

                        <p class="text-xl font-semibold">
                            {quizQuestions[currentQuestionIndex].question}
                        </p>

                        <div class="space-y-3">
                            {#each quizQuestions[currentQuestionIndex].options as option, index}
                                <button
                                    class="w-full p-3 text-right rounded-lg transition-colors duration-200 {
                                        isAnswerSubmitted && index === quizQuestions[currentQuestionIndex].correctAnswer
                                            ? 'bg-green-200 border-2 border-green-500' // Always highlight correct answer
                                            : selectedAnswer === index
                                                ? isAnswerSubmitted
                                                    ? 'bg-red-200'  // Wrong answer
                                                    : 'bg-blue-200' // Selected but not submitted
                                                : 'bg-gray-100 hover:bg-gray-200'
                                    }"
                                    on:click={() => selectAnswer(index)}
                                    disabled={isAnswerSubmitted}
                                >
                                    {option}
                                </button>
                            {/each}
                        </div>

                        <div class="mt-4">
                            {#if !isAnswerSubmitted}
                                <button
                                    class="w-full bg-indigo-950 text-white rounded-lg px-4 py-2 hover:bg-indigo-950 disabled:opacity-50"
                                    on:click={submitAnswer}
                                    disabled={selectedAnswer === null}
                                >
                                    تأكيد الإجابة
                                </button>
                            {:else}
                                <button
                                    class="w-full bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700"
                                    on:click={nextQuestion}
                                >
                                    السؤال التالي
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            {:else}
                <div class="text-center">
                    <h2 class="text-2xl font-bold mb-4">انتهى الاختبار!</h2>
                    <div class="space-y-4">
                        <p class="text-xl">نتيجة {teams[0].name}: {teams[0].score} نقطة</p>
                        <p class="text-xl">نتيجة {teams[1].name}: {teams[1].score} نقطة</p>
                        <p class="text-2xl font-bold mt-4">
                            {#if teams[0].score > teams[1].score}
                                الفائز: {teams[0].name}!
                            {:else if teams[1].score > teams[0].score}
                                الفائز: {teams[1].name}!
                            {:else}
                                تعادل!
                            {/if}
                        </p>
                    </div>
                    <button
                        class="mt-8 bg-indigo-950 text-white rounded-lg px-6 py-2 hover:bg-indigo-950"
                        on:click={() => goto("/")}
                    >
                        العب مرة أخرى
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>