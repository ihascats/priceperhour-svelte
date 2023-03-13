<script>
	import Loading from '../icons/Loading.svelte';

	export let isLoading = {};
</script>

<div
	class="max-w-[500px] fill-orange-300 top-0 min-h-screen w-full bg-neutral-600/20 backdrop-blur-md border-x-2 border-neutral-900 flex flex-col text-orange-400 justify-center items-center fixed"
>
	<Loading />
	<div class="font-mono flex text-center">
		{isLoading.message}..
	</div>
	{#if isLoading?.completion}
		<div class="h-full w-1/2 border-2 border-orange-600 rounded">
			<div class={`loading-bar bg-lime-500 h-4`} />
		</div>
	{/if}
</div>
