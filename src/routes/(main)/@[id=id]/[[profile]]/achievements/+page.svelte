<script lang="ts">
	import Head from '$comp/head.svelte';
	import AchievementsPanel from '$comp/stats/achievements/achievements-panel.svelte';
	import { getAllAchievements } from '$lib/calc/achievements';
	import { getStatsContext } from '$lib/stores/stats.svelte';
	import { Skeleton } from '$ui/skeleton';

	const ctx = getStatsContext();
	const member = $derived(ctx.member.current);

	const achievements = $derived(getAllAchievements(member));
</script>

<Head
	title="{ctx.ignMeta} | Achievements"
	description="View farming achievements for {ctx.ign} in Hypixel Skyblock"
	canonicalPath="/@{ctx.ign}/{encodeURIComponent(ctx.selectedProfile?.profileName ?? '')}/achievements"
/>

{#if ctx.ready}
	<AchievementsPanel {achievements} />
{:else}
	<section class="my-8 flex w-full justify-center">
		<div class="mx-2 w-full max-w-7xl">
			<Skeleton class="mb-4 h-8 w-48" />
			<Skeleton class="mb-6 h-3 w-64" />
			<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{#each { length: 20 } as _, i (i)}
					<Skeleton class="h-24 w-full rounded-lg" />
				{/each}
			</div>
		</div>
	</section>
{/if}
