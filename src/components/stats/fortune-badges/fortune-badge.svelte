<script lang="ts">
	import type { FortuneBadge } from '$lib/constants/fortune-badges';
	import { getFortuneBadgeProgress } from '$lib/calc/fortune-badges';
	import * as Popover from '$ui/popover';
	import { FORTUNE_BADGE_TIERS } from '$lib/constants/fortune-badges';

	interface Props {
		badge: FortuneBadge;
		fortune: number;
		compact?: boolean;
	}

	let { badge, fortune, compact = false }: Props = $props();

	const progress = $derived(getFortuneBadgeProgress(fortune));
	const nextTier = $derived(FORTUNE_BADGE_TIERS.find((t) => t.minFortune > badge.minFortune) ?? null);
	const progressPercent = $derived(Math.round(progress * 100));
</script>

<Popover.Root>
	<Popover.Trigger>
		<div
			class="flex cursor-pointer items-center gap-1.5 rounded-md border-2 px-2 py-1 transition-opacity hover:opacity-90"
			style="border-color: {badge.color}; color: {badge.color};"
		>
			<span class="{compact ? 'text-base' : 'text-xl'}">{badge.icon}</span>
			{#if !compact}
				<span class="text-sm font-semibold">{badge.name}</span>
			{/if}
		</div>
	</Popover.Trigger>
	<Popover.Content>
		<div class="flex max-w-xs flex-col gap-2">
			<div class="flex items-center gap-2">
				<span class="text-2xl">{badge.icon}</span>
				<div>
					<p class="font-semibold" style="color: {badge.color};">{badge.name}</p>
					<p class="text-muted-foreground text-xs">Farming Fortune Badge</p>
				</div>
			</div>
			<p class="text-sm">{badge.description}</p>
			<p class="text-muted-foreground text-sm">Current Fortune: <span class="font-semibold text-foreground">{Math.round(fortune).toLocaleString()}</span></p>
			{#if nextTier}
				<div class="flex flex-col gap-1">
					<p class="text-xs text-muted-foreground">Progress to <span style="color: {nextTier.color};">{nextTier.name}</span>: {progressPercent}%</p>
					<div class="bg-muted h-2 w-full rounded-full">
						<div
							class="h-2 rounded-full transition-all"
							style="width: {progressPercent}%; background-color: {badge.color};"
						></div>
					</div>
					<p class="text-xs text-muted-foreground">Need: {nextTier.minFortune.toLocaleString()} fortune</p>
				</div>
			{:else}
				<p class="text-xs font-medium text-green-500">Maximum tier reached! 🎉</p>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
