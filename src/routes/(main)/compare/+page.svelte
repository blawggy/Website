<script lang="ts">
	import Head from '$comp/head.svelte';
	import PlayerSearch from '$comp/player-search.svelte';
	import ComparisonLayout from '$comp/stats/comparison/comparison-layout.svelte';
	import ComparisonSummary from '$comp/stats/comparison/comparison-summary.svelte';
	import CropComparison from '$comp/stats/comparison/crop-comparison.svelte';
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let open1 = $state(false);
	let open2 = $state(false);

	let player1Input = $state(data.p1 ?? '');
	let player2Input = $state(data.p2 ?? '');

	function compare() {
		if (player1Input && player2Input) {
			goto(`/compare?p1=${encodeURIComponent(player1Input)}&p2=${encodeURIComponent(player2Input)}`);
		}
	}

	const hasData = $derived(!!data.player1Data?.member && !!data.player2Data?.member);
	const p1Name = $derived(data.player1Data?.name ?? data.p1);
	const p2Name = $derived(data.player2Data?.name ?? data.p2);
</script>

<Head
	title="Player Comparison | Elite SkyBlock"
	description="Compare farming stats side-by-side between two Hypixel Skyblock players"
/>

<div class="mx-auto my-8 w-full max-w-5xl px-4">
	<h1 class="mb-6 text-center text-3xl font-bold">Player Comparison</h1>

	<div class="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
		<PlayerSearch
			bind:open={open1}
			bind:search={player1Input}
			useButton
			cmd={(player) => {
				player1Input = player;
				open1 = false;
			}}
			class="w-48"
		/>

		<span class="text-muted-foreground font-semibold">vs</span>

		<PlayerSearch
			bind:open={open2}
			bind:search={player2Input}
			useButton
			cmd={(player) => {
				player2Input = player;
				open2 = false;
			}}
			class="w-48"
		/>

		<button
			onclick={compare}
			disabled={!player1Input || !player2Input}
			class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Compare
		</button>
	</div>

	{#if hasData}
		<ComparisonLayout player1Name={p1Name} player2Name={p2Name}>
			<div class="flex flex-col gap-6">
				<ComparisonSummary
					member1={data.player1Data?.member}
					player1Name={p1Name}
					member2={data.player2Data?.member}
					player2Name={p2Name}
				/>
				<CropComparison member1={data.player1Data?.member} member2={data.player2Data?.member} />
			</div>
		</ComparisonLayout>
	{:else if data.p1 || data.p2}
		<div class="text-muted-foreground my-8 text-center">
			{#if data.p1 && !data.player1Data}
				<p>Could not find player: <strong>{data.p1}</strong></p>
			{/if}
			{#if data.p2 && !data.player2Data}
				<p>Could not find player: <strong>{data.p2}</strong></p>
			{/if}
		</div>
	{:else}
		<p class="text-muted-foreground my-8 text-center">Search for two players above to compare their stats.</p>
	{/if}
</div>
