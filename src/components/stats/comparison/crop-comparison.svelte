<script lang="ts">
	import type { ProfileMemberDto } from '$lib/api';
	import { CROPS_PER_ONE_WEIGHT } from '$lib/constants/weights';
	import { PROPER_CROP_NAMES, PROPER_CROP_TO_IMG } from '$lib/constants/crops';
	import StatsComparisonCard from './stats-comparison-card.svelte';

	interface Props {
		member1: ProfileMemberDto | null | undefined;
		member2: ProfileMemberDto | null | undefined;
	}

	let { member1, member2 }: Props = $props();

	// Normalize collection keys for a member
	const API_TO_CROP: Record<string, string> = {
		WHEAT: 'Wheat',
		POTATO_ITEM: 'Potato',
		CARROT_ITEM: 'Carrot',
		MELON: 'Melon',
		PUMPKIN: 'Pumpkin',
		CACTUS: 'Cactus',
		SUGAR_CANE: 'Sugar Cane',
		'INK_SACK:3': 'Cocoa Beans',
		INK_SACK: 'Cocoa Beans',
		MUSHROOM_COLLECTION: 'Mushroom',
		NETHER_STALK: 'Nether Wart',
	};

	function getCropCollection(member: ProfileMemberDto | null | undefined, cropName: string): number {
		if (!member?.collections) return 0;
		const apiKey = Object.entries(API_TO_CROP).find(([, v]) => v === cropName)?.[0];
		if (!apiKey) return 0;
		const col = member.collections as Record<string, bigint | number | undefined>;
		const val = col[apiKey] ?? col[apiKey.split(':')[0]] ?? 0;
		return Number(val);
	}

	function getCropWeight(member: ProfileMemberDto | null | undefined, cropName: string): number {
		return (member?.farmingWeight?.cropWeight as Record<string, number>)?.[cropName] ?? 0;
	}

	// Only include crops that are tracked for farming weight, derived from the weights constant
	// Map from weight key (lowercase) to display name
	const WEIGHT_CROP_KEY_TO_NAME: Record<string, string> = {
		wheat: 'Wheat',
		carrot: 'Carrot',
		potato: 'Potato',
		sugarcane: 'Sugar Cane',
		netherwart: 'Nether Wart',
		pumpkin: 'Pumpkin',
		melon: 'Melon',
		mushroom: 'Mushroom',
		cocoa: 'Cocoa Beans',
		cactus: 'Cactus',
	};

	// Only display crops that are both in weight tracking and in PROPER_CROP_NAMES
	const weightCrops = Object.values(WEIGHT_CROP_KEY_TO_NAME).filter((name) =>
		PROPER_CROP_NAMES.includes(name)
	);

	// Keep ordering consistent with CROPS_PER_ONE_WEIGHT
	const sortedWeightCrops = Object.keys(CROPS_PER_ONE_WEIGHT)
		.map((key) => WEIGHT_CROP_KEY_TO_NAME[key])
		.filter((name): name is string => !!name && weightCrops.includes(name));
</script>

<div class="flex flex-col gap-3">
	<h3 class="text-lg font-semibold">Crop Comparison</h3>
	{#each sortedWeightCrops as crop (crop)}
		{@const img = PROPER_CROP_TO_IMG[crop]}
		{@const col1 = getCropCollection(member1, crop)}
		{@const col2 = getCropCollection(member2, crop)}
		{@const w1 = getCropWeight(member1, crop)}
		{@const w2 = getCropWeight(member2, crop)}
		<div class="bg-card rounded-lg border p-3">
			<div class="mb-2 flex items-center gap-2">
				{#if img}
					<img src={img} alt={crop} class="size-6 pixelated" />
				{/if}
				<span class="font-medium">{crop}</span>
			</div>
			<div class="flex flex-col gap-1.5">
				<StatsComparisonCard label="Collection" value1={col1} value2={col2} />
				<StatsComparisonCard label="Weight" value1={w1} value2={w2} />
			</div>
		</div>
	{/each}
</div>
