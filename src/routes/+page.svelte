<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import encu_logo from "../lib/img/encu_logo.png"
    let team1Name = "الفريق الأول";
    let team2Name = "الفريق الثاني";
    let isConfiguring = false;
    let error = '';

    function startQuiz() {
        if (team1Name.trim() && team2Name.trim()) {
            if (team1Name === team2Name) {
                error = 'يجب أن يكون اسم الفريقين مختلفًا';
                return;
            }
            localStorage.setItem('team1Name', team1Name);
            localStorage.setItem('team2Name', team2Name);
            goto('/challenge');
        } else {
            error = 'يرجى إدخال اسم كلا الفريقين';
        }
    }
</script>

<div dir="rtl">

    <div class="relative py-3 sm:max-w-xl sm:mx-auto text-center">
        <div 
            class="relative p-4 bg-white/90 backdrop-blur-sm mx-8 md:mx-0 shadow-2xl rounded-3xl sm:p-4"
        >
            <img 
                src={encu_logo} 
                class="w-32 h-auto my-2 mx-auto"
                alt="ENCU's Logo" 
                style="max-width: 120px; height: auto; object-fit: contain;"
            />
            <div class="max-w-md mx-auto">
                {#if !isConfiguring}
                    <div 
                        class="space-y-4"
                        in:fly="{{ y: 50, duration: 500 }}"
                    >
                        <h1 class="text-4xl font-bold text-gray-800 mb-4">
                            تحدي المعرفة
                        </h1>
                        
                        <div class="space-y-4 text-gray-600">
                            <p class="text-lg">
                                اختبر معلوماتك وتنافس مع أصدقائك في هذا التحدي المثير!
                            </p>
                            <ul class="text-right space-y-2">
                                <li class="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                    <span>10 أسئلة متنوعة</span>
                                </li>
                                <li class="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                                    <span>نظام نقاط تنافسي</span>
                                </li>
                                <li class="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                    <span>مؤقت زمني للإجابة</span>
                                </li>
                            </ul>
                        </div>

                        <div class="flex gap-2">
                            <button
                            class="w-full bg-gradient-to-r from-indigo-950 to-orange-600 text-white rounded-lg px-4 py-3 mt-6 hover:opacity-90 transform transition hover:scale-105 font-bold text-lg"
                            on:click={() => isConfiguring = true}
                            >
                                ابدأ التحدي الأول!
                            </button>

                            <a
                                class="w-full bg-gradient-to-r from-indigo-950 to-orange-600 text-white rounded-lg px-4 py-3 mt-6 hover:opacity-90 transform transition hover:scale-105 font-bold text-lg"
                                href="/challenge2"
                            >
                                ابدأ التحدي الثاني!
                            </a>
                        </div>
                    </div>
                {:else}
                    <div 
                        class="space-y-6"
                        in:fly="{{ y: 50, duration: 500 }}"
                    >
                        <h2 class="text-2xl font-bold text-gray-800 mb-6">
                            إعداد الفرق
                        </h2>

                        <div class="space-y-4">
                            <div>
                                <label for="team1" class="block text-sm font-medium text-gray-700 mb-1">
                                    اسم الفريق الأول
                                </label>
                                <input
                                    type="text"
                                    id="team1"
                                    bind:value={team1Name}
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950"
                                    placeholder="أدخل اسم الفريق الأول"
                                />
                            </div>

                            <div>
                                <label for="team2" class="block text-sm font-medium text-gray-700 mb-1">
                                    اسم الفريق الثاني
                                </label>
                                <input
                                    type="text"
                                    id="team2"
                                    bind:value={team2Name}
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950"
                                    placeholder="أدخل اسم الفريق الثاني"
                                />
                            </div>

                            {#if error}
                                <p class="text-red-500 text-sm">{error}</p>
                            {/if}
                        </div>

                        <div class="flex gap-4">
                            <button
                                class="w-1/2 bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition"
                                on:click={() => isConfiguring = false}
                            >
                                رجوع
                            </button>
                            <button
                                class="w-1/2 bg-gradient-to-r from-indigo-950 to-orange-600 text-white rounded-lg px-4 py-2 hover:opacity-90 transition"
                                on:click={startQuiz}
                            >
                                ابدأ اللعب
                            </button>
                        </div>
                    </div>
                {/if}

                <div class="mt-8 text-sm text-gray-500">
                    تم التطوير بواسطة ENCU
                </div>
            </div>
        </div>

        <!-- Decorative Elements -->
        <div class="absolute -top-5 -left-5 w-20 h-20 bg-orange-500 rounded-full opacity-20 animate-pulse"></div>
        <div class="absolute -bottom-5 -right-5 w-20 h-20 bg-indigo-950 rounded-full opacity-20 animate-pulse"></div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>