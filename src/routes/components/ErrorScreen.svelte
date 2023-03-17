<script>
	export let search;
	export let isError;
</script>

<div
	class="max-w-[500px] fill-orange-300 top-0 min-h-screen w-full bg-neutral-600/20 backdrop-blur-md border-x-2 border-neutral-900 flex flex-col text-orange-400 justify-center items-center fixed"
>
	<div class="font-mono text-sm flex tracking-wide text-red-400">{isError.message}</div>
	{#if isError.retry}
		<button
			on:click={() => {
				search();
				isError = { error: false };
			}}
			class="text-xl text-lime-300">retry</button
		>
	{/if}
	<button
		on:click={() => {
			isError = { error: false };
		}}
		class="text-xl text-blue-300">close</button
	>
</div>
