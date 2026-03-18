<script lang="ts">
	import { getOverallFortuneBadge } from '$lib/calc/fortune-badges';
	import { FORTUNE_BADGE_TIERS } from '$lib/constants/fortune-badges';
	import FortuneBadgeComponent from './fortune-badge.svelte';

	interface Props {
		fortune: number;
	}

	let { fortune }: Props = $props();

	const badge = $derived(getOverallFortuneBadge(fortune));
</script>

<div class="bg-card rounded-xl border p-4">
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-lg font-semibold">Farming Fortune Badge</h3>
		<FortuneBadgeComponent {badge} {fortune} />
	</div>

	<div class="flex flex-wrap gap-2">
		{#each FORTUNE_BADGE_TIERS as tier (tier.id)}
			<div
				class="flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm {tier.minFortune <= fortune ? 'opacity-100' : 'opacity-40'}"
				style="border-color: {tier.color}; color: {tier.color};"
			>
				<span>{tier.icon}</span>
				<span class="font-medium">{tier.name}</span>
				<span class="text-muted-foreground text-xs">({tier.minFortune.toLocaleString()}+)</span>
			</div>
		{/each}
	</div>
</div>
