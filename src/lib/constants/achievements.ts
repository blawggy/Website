import type { CropName } from '$lib/skyblock';

export interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: string;
	category: 'crop' | 'fortune' | 'contest' | 'general';
	crop?: CropName;
	tiers: AchievementTier[];
}

export interface AchievementTier {
	tier: number;
	name: string;
	requirement: number;
	color: string;
}

export interface PlayerAchievement {
	achievement: Achievement;
	currentTier: number;
	progress: number;
	maxProgress: number;
	completed: boolean;
}

const TIER_NAMES = ['Bronze', 'Silver', 'Gold', 'Diamond', 'Emerald'] as const;
const TIER_COLORS = ['#cd7f32', '#c0c0c0', '#ffd700', '#b9f2ff', '#50c878'] as const;

function makeTiers(requirements: number[]): AchievementTier[] {
	return requirements.map((req, i) => ({
		tier: i + 1,
		name: TIER_NAMES[i],
		requirement: req,
		color: TIER_COLORS[i],
	}));
}

// ─── Per-crop collection milestones ──────────────────────────────────────────

const CROP_NAMES: CropName[] = [
	'cactus',
	'carrot',
	'cocoa',
	'melon',
	'mushroom',
	'netherwart',
	'potato',
	'pumpkin',
	'sugarcane',
	'wheat',
];

const CROP_DISPLAY: Record<CropName, string> = {
	cactus: 'Cactus',
	carrot: 'Carrot',
	cocoa: 'Cocoa Beans',
	melon: 'Melon',
	mushroom: 'Mushroom',
	netherwart: 'Nether Wart',
	potato: 'Potato',
	pumpkin: 'Pumpkin',
	sugarcane: 'Sugar Cane',
	wheat: 'Wheat',
};

const CROP_EMOJI: Record<CropName, string> = {
	cactus: '🌵',
	carrot: '🥕',
	cocoa: '🍫',
	melon: '🍈',
	mushroom: '🍄',
	netherwart: '🧱',
	potato: '🥔',
	pumpkin: '🎃',
	sugarcane: '🎋',
	wheat: '🌾',
};

export const CROP_COLLECTION_ACHIEVEMENTS: Achievement[] = CROP_NAMES.map((crop) => ({
	id: `collection_${crop}`,
	name: `${CROP_DISPLAY[crop]} Collector`,
	description: `Collect ${CROP_DISPLAY[crop]} from your farm`,
	icon: CROP_EMOJI[crop],
	category: 'crop',
	crop,
	tiers: makeTiers([100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000]),
}));

// ─── Per-crop weight milestones ───────────────────────────────────────────────

export const CROP_WEIGHT_ACHIEVEMENTS: Achievement[] = CROP_NAMES.map((crop) => ({
	id: `weight_${crop}`,
	name: `${CROP_DISPLAY[crop]} Weight`,
	description: `Earn farming weight from ${CROP_DISPLAY[crop]}`,
	icon: CROP_EMOJI[crop],
	category: 'crop',
	crop,
	tiers: makeTiers([10, 50, 100, 500, 1000]),
}));

// ─── Per-crop gold medal achievements ────────────────────────────────────────

export const CROP_CONTEST_ACHIEVEMENTS: Achievement[] = CROP_NAMES.map((crop) => ({
	id: `contest_${crop}`,
	name: `${CROP_DISPLAY[crop]} Champion`,
	description: `Earn gold medals in ${CROP_DISPLAY[crop]} contests`,
	icon: '🥇',
	category: 'contest',
	crop,
	tiers: makeTiers([5, 25, 50, 100, 250]),
}));

// ─── General achievements ─────────────────────────────────────────────────────

export const GENERAL_ACHIEVEMENTS: Achievement[] = [
	{
		id: 'total_weight',
		name: 'Farming Legend',
		description: 'Earn total farming weight',
		icon: '⚖️',
		category: 'general',
		tiers: makeTiers([100, 500, 1000, 2500, 5000]),
	},
	{
		id: 'farming_level',
		name: 'Farming Master',
		description: 'Reach farming skill levels',
		icon: '📜',
		category: 'general',
		tiers: makeTiers([25, 40, 50, 55, 60]),
	},
	{
		id: 'jacob_participations',
		name: 'Contest Veteran',
		description: 'Participate in Jacob\'s Farming Contests',
		icon: '🎪',
		category: 'general',
		tiers: makeTiers([50, 200, 500, 1000, 2500]),
	},
];

// ─── Fortune achievements ─────────────────────────────────────────────────────

export const FORTUNE_ACHIEVEMENTS: Achievement[] = [
	{
		id: 'farming_fortune',
		name: 'Fortune Seeker',
		description: 'Reach total Farming Fortune',
		icon: '🍀',
		category: 'fortune',
		tiers: makeTiers([100, 500, 1000, 1500, 2000]),
	},
];

// ─── All achievements ─────────────────────────────────────────────────────────

export const ALL_ACHIEVEMENTS: Achievement[] = [
	...CROP_COLLECTION_ACHIEVEMENTS,
	...CROP_WEIGHT_ACHIEVEMENTS,
	...CROP_CONTEST_ACHIEVEMENTS,
	...GENERAL_ACHIEVEMENTS,
	...FORTUNE_ACHIEVEMENTS,
];
