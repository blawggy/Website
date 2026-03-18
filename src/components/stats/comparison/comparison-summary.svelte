<script lang="ts">
	import type { ProfileMemberDto } from '$lib/api';
	import StatsComparisonCard from './stats-comparison-card.svelte';

	interface Props {
		member1: ProfileMemberDto | null | undefined;
		player1Name: string;
		member2: ProfileMemberDto | null | undefined;
		player2Name: string;
	}

	let { member1, player1Name, member2, player2Name }: Props = $props();

	const w1 = $derived(member1?.farmingWeight?.totalWeight ?? 0);
	const w2 = $derived(member2?.farmingWeight?.totalWeight ?? 0);

	const participations1 = $derived(member1?.jacob?.participations ?? 0);
	const participations2 = $derived(member2?.jacob?.participations ?? 0);

	const goldMedals1 = $derived(member1?.jacob?.earnedMedals?.gold ?? 0);
	const goldMedals2 = $derived(member2?.jacob?.earnedMedals?.gold ?? 0);

	const diamondMedals1 = $derived(member1?.jacob?.earnedMedals?.diamond ?? 0);
	const diamondMedals2 = $derived(member2?.jacob?.earnedMedals?.diamond ?? 0);

	const winner = $derived(w1 > w2 ? player1Name : w2 > w1 ? player2Name : null);
</script>

<div class="bg-card rounded-xl border p-4">
	<h3 class="mb-4 text-lg font-semibold">Summary</h3>

	{#if winner}
		<div class="mb-4 rounded-lg bg-muted p-3 text-center">
			<span class="text-muted-foreground text-sm">Higher Farming Weight: </span>
			<span class="font-bold text-yellow-500">🏆 {winner}</span>
		</div>
	{/if}

	<div class="flex flex-col gap-2">
		<StatsComparisonCard label="Total Farming Weight" value1={w1} value2={w2} />
		<StatsComparisonCard label="Contest Participations" value1={participations1} value2={participations2} />
		<StatsComparisonCard label="Gold Medals" value1={goldMedals1} value2={goldMedals2} />
		<StatsComparisonCard label="Diamond Medals" value1={diamondMedals1} value2={diamondMedals2} />
	</div>
</div>
