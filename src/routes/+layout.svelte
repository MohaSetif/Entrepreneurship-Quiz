<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 to-orange-600 py-6 flex flex-col justify-center" >
	{@render children()}
</div>

