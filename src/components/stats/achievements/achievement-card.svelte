<script lang="ts">
	import type { PlayerAchievement } from '$lib/constants/achievements';
	import ProgressBar from '$comp/stats/progress-bar.svelte';
	import * as Popover from '$ui/popover';

	interface Props {
		playerAchievement: PlayerAchievement;
	}

	let { playerAchievement }: Props = $props();

	const { achievement, currentTier, progress, maxProgress, completed } = $derived(playerAchievement);
	const tier = $derived(achievement.tiers[currentTier - 1]);
	const nextTier = $derived(achievement.tiers[currentTier] ?? null);
	const percent = $derived(maxProgress > 0 ? (progress / maxProgress) * 100 : completed ? 100 : 0);
	const prevTierReq = $derived(currentTier > 0 ? (achievement.tiers[currentTier - 1]?.requirement ?? 0) : 0);
	const remainingToNext = $derived(nextTier ? nextTier.requirement - progress - prevTierReq : 0);

	const borderColor = $derived(
		completed ? (tier?.color ?? '#50c878') : currentTier > 0 ? (tier?.color ?? 'transparent') : 'transparent'
	);
</script>

<Popover.Root>
	<Popover.Trigger class="w-full text-left">
		<div
			class="bg-card flex flex-col gap-1 rounded-lg border-2 p-3 transition-opacity {!completed && currentTier === 0 ? 'opacity-50' : ''}"
			style="border-color: {borderColor};"
		>
			<div class="flex items-center gap-2">
				<span class="text-xl">{achievement.icon}</span>
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-semibold">{achievement.name}</p>
					{#if currentTier > 0}
						<p class="text-xs font-medium" style="color: {tier?.color};">{tier?.name}</p>
					{:else}
						<p class="text-muted-foreground text-xs">Locked</p>
					{/if}
				</div>
			</div>
			{#if !completed}
				<ProgressBar
					{percent}
					readable="{progress.toLocaleString()} / {maxProgress.toLocaleString()}"
					compact
				/>
			{:else}
				<div class="bg-completed h-5 w-full rounded-xs">
					<p class="flex h-full items-center justify-center text-xs font-semibold">Completed!</p>
				</div>
			{/if}
		</div>
	</Popover.Trigger>
	<Popover.Content>
		<div class="flex max-w-xs flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="text-2xl">{achievement.icon}</span>
				<p class="text-lg font-semibold">{achievement.name}</p>
			</div>
			<p class="text-muted-foreground text-sm">{achievement.description}</p>
			<div class="mt-1 flex flex-col gap-0.5">
				{#each achievement.tiers as t (t.tier)}
					<div class="flex items-center gap-2">
						<span class="text-xs font-medium" style="color: {t.color};">{t.name}</span>
						<span class="text-muted-foreground text-xs">— {t.requirement.toLocaleString()}</span>
						{#if currentTier >= t.tier}
							<span class="ml-auto text-xs text-green-500">✓</span>
						{/if}
					</div>
				{/each}
			</div>
			{#if nextTier && !completed}
				<p class="text-muted-foreground mt-1 text-xs">
					Next: <span style="color: {nextTier.color};">{nextTier.name}</span> — {remainingToNext.toLocaleString()} more needed
				</p>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
