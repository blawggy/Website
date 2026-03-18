<script lang="ts">
	import type { PlayerAchievement } from '$lib/constants/achievements';
	import AchievementCard from './achievement-card.svelte';

	interface Props {
		achievements: PlayerAchievement[];
	}

	let { achievements }: Props = $props();

	const completed = $derived(achievements.filter((a) => a.completed).length);
	const total = $derived(achievements.length);
	const overallPercent = $derived(total > 0 ? Math.round((completed / total) * 100) : 0);

	const categories = ['crop', 'contest', 'general', 'fortune'] as const;

	const categoryLabels: Record<string, string> = {
		crop: 'Crop Collection & Weight',
		contest: 'Contest Champions',
		general: 'General Farming',
		fortune: 'Farming Fortune',
	};

	function getAchievementsForCategory(cat: string) {
		return achievements.filter((a) => a.achievement.category === cat);
	}
</script>

<section id="Achievements" class="my-8 flex w-full justify-center">
	<div class="mx-2 w-full max-w-7xl">
		<div class="mb-4 flex flex-col gap-2">
			<h2 class="text-2xl font-bold">Achievements</h2>
			<div class="flex items-center gap-3">
				<div class="bg-muted h-3 w-full max-w-sm rounded-full">
					<div
						class="bg-progress h-3 rounded-full transition-all"
						style="width: {overallPercent}%;"
					></div>
				</div>
				<span class="text-muted-foreground text-sm font-medium">{completed} / {total}</span>
			</div>
		</div>

		{#each categories as cat (cat)}
			{@const catAchievements = getAchievementsForCategory(cat)}
			{#if catAchievements.length > 0}
				<div class="mb-6">
					<h3 class="mb-3 text-lg font-semibold">{categoryLabels[cat]}</h3>
					<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{#each catAchievements as pa (pa.achievement.id)}
							<AchievementCard playerAchievement={pa} />
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</section>
