<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import qr_code from "$lib/img/winner_forms.jpeg";

    interface Term {
        id: number;
        text: string;
        category: string;
        matched: boolean;
    }

    const allTerms: Term[] = [
        { id: 1, text: "رأس المال المخاطر", category: "A", matched: false },
        { id: 2, text: "المستثمر الملاك", category: "A", matched: false },
        { id: 3, text: "عرض الشرائح", category: "B", matched: false },
        { id: 4, text: "نموذج العمل التجاري", category: "B", matched: false },
        { id: 5, text: "الحد الأدنى من المنتج القابل للتطبيق", category: "C", matched: false },
        { id: 6, text: "النموذج الأولي", category: "C", matched: false },
        { id: 7, text: "أبحاث السوق", category: "D", matched: false },
        { id: 8, text: "استكشاف العملاء", category: "D", matched: false },
        { id: 9, text: "التمويل الذاتي", category: "E", matched: false },
        { id: 10, text: "الاعتماد على الموارد الخاصة", category: "E", matched: false },
        { id: 11, text: "قابلية التوسع", category: "F", matched: false },
        { id: 12, text: "استراتيجية النمو", category: "F", matched: false },
        { id: 13, text: "الملكية الفكرية", category: "G", matched: false },
        { id: 14, text: "براءة الاختراع", category: "G", matched: false },
        { id: 15, text: "التسويق الرقمي", category: "H", matched: false },
        { id: 16, text: "وسائل التواصل الاجتماعي", category: "H", matched: false },
        { id: 17, text: "الشركات الناشئة", category: "I", matched: false },
        { id: 18, text: "ريادة الأعمال", category: "I", matched: false },
    ];

    let terms: Term[] = [];
    let timer = 90;
    let timerInterval: ReturnType<typeof setInterval>;
    let gameCompleted = false;
    let score = 0;
    let selectedTerm: Term | null = null;
    let shuffledTerms: Term[] = [];
    let matchedPairs = 0;
    let totalPairs = 0;

    function shuffleArray(array: Term[]): Term[] {
        const arrayCopy = [...array];
        for (let i = arrayCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }
        return arrayCopy;
    }

    function selectRandomTerms(): Term[] {
        const shuffledMaster = shuffleArray([...allTerms]);
        return shuffledMaster.map(term => ({ ...term, matched: false }));
    }

    function startGame(): void {
        terms = selectRandomTerms();
        shuffledTerms = [...terms];
        timer = 90;
        score = 0;
        matchedPairs = 0;
        totalPairs = terms.length / 2;
        gameCompleted = false;
        selectedTerm = null;
        startTimer();
    }

    function startTimer(): void {
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

    function selectTerm(term: Term): void {
        if (!term.matched) {
            if (!selectedTerm) {
                selectedTerm = term;
            } else {
                if (selectedTerm.id !== term.id && selectedTerm.category === term.category) {
                    terms = terms.map(t =>
                        (t.id === selectedTerm?.id || t.id === term.id)
                            ? { ...t, matched: true }
                            : t
                    );
                    score += 10;
                    matchedPairs++;

                    if (matchedPairs === totalPairs) {
                        score += timer * 2;
                        endGame();
                    }
                }
                selectedTerm = null;
            }

            shuffledTerms = terms.map(t => ({ ...t }));
        }
    }

    function endGame(): void {
        clearInterval(timerInterval);
        gameCompleted = true;
    }

    function restartGame(): void {
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
    <div class="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl flex flex-col h-[95vh]">
        <div class="p-4 sm:p-6 flex flex-col h-full space-y-6">
            {#if !gameCompleted}
                <div class="flex flex-col h-full" in:fade>
                    <div class="flex-shrink-0">
                        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                            <h2 class="text-lg sm:text-xl font-bold text-gray-800">اربط مصطلحات ريادة الأعمال</h2>
                            <span class="font-bold text-sm sm:text-base {timer <= 20 ? 'text-red-600 animate-pulse' : 'text-indigo-600'}">
                                الوقت المتبقي: {formatTime(timer)}
                            </span>
                        </div>
                        <p class="text-gray-600 text-sm sm:text-base mb-4">اضغط على مصطلحين مرتبطين لربطهما معًا</p>
                        <div class="flex justify-between items-center mb-4 text-sm sm:text-base">
                            <span class="font-bold text-indigo-600">النقاط: {score}</span>
                            <span class="font-bold text-gray-700">تم ربط: {matchedPairs}/{totalPairs}</span>
                        </div>
                    </div>

                    <div class="flex-grow overflow-y-auto mb-4 scrollbar-thin">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {#each shuffledTerms as term (term.id)}
                                <div animate:flip={{ duration: 300 }}>
                                    <button
                                        class="w-full h-20 sm:h-24 aspect-none flex items-center justify-center p-2 rounded-xl text-center font-medium text-sm sm:text-base transition-all duration-200
                                            {term.matched
                                                ? 'bg-green-100 text-green-800 opacity-70 cursor-default'
                                                : selectedTerm?.id === term.id
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}"
                                        on:click={() => selectTerm(term)}
                                        disabled={term.matched}
                                    >
                                        {term.text}
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {:else}
                <div class="h-full overflow-y-auto text-center space-y-6 p-2 sm:p-4" in:fly={{ y: 20, duration: 500 }}>
                    <h2 class="text-xl sm:text-2xl font-bold">انتهت اللعبة!</h2>
                    <p class="text-lg sm:text-xl">لقد ربطت {matchedPairs} من أصل {totalPairs} مصطلحات</p>
                    <p class="text-base sm:text-lg font-bold text-indigo-600">النقاط النهائية: {score}</p>

                    <div class="mt-4">
                        <h3 class="font-bold mb-4 text-lg sm:text-xl">المصطلحات المرتبطة:</h3>
                        <ul class="space-y-4 text-right px-2">
                            {#each Array.from(new Set(terms.map(t => t.category))).sort() as category, i}
                                {@const categoryTerms = terms.filter(t => t.category === category)}
                                {#if categoryTerms.length > 0}
                                    <li class="p-4 bg-gray-50 rounded-lg" in:fly={{ x: -20, delay: i * 100, duration: 300 }}>
                                        <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                            {#each categoryTerms as term}
                                                <div class="p-3 bg-indigo-100 rounded-lg text-indigo-800 flex-1 text-sm sm:text-base">
                                                    {term.text}
                                                </div>
                                            {/each}
                                        </div>
                                    </li>
                                {/if}
                            {/each}
                        </ul>
                    </div>

                    <div class="flex flex-col justify-center items-center gap-4 mt-6">
                        <img
                            src={qr_code}
                            alt="QR code"
                            class="w-28 h-28 sm:w-36 sm:h-36 object-contain border border-gray-300 rounded-md shadow"
                        />
                        <h2 class="text-xl font-bold">امسح الكود!</h2>
                    </div>

                    <div class="flex items-center gap-4 justify-center">
                        <button
                            class="mt-8 mb-4 w-36 h-14 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transform transition-transform duration-200 hover:scale-105 active:scale-95 text-center"
                            on:click={restartGame}
                        >
                            العب مرة أخرى
                        </button>
                        
                        <a
                            href="/"
                            class="mt-8 mb-4 w-36 h-14 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transform transition-transform duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
                        >
                            إرجع
                        </a>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
