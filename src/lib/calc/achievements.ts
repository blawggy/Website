import type { ProfileMemberDto } from '$lib/api';
import {
	ALL_ACHIEVEMENTS,
	type PlayerAchievement,
} from '$lib/constants/achievements';
import { DEFAULT_SKILL_CAPS } from '$lib/constants/levels';
import { getLevelProgress } from '$lib/format';

/**
 * Calculate which achievements a player has earned and their progress.
 */
export function getAllAchievements(member: ProfileMemberDto | undefined | null): PlayerAchievement[] {
	if (!member) return ALL_ACHIEVEMENTS.map(toEmptyAchievement);

	const cropWeights: Record<string, number> = member.farmingWeight?.cropWeight ?? {};
	const rawCollections: Record<string, bigint | number | undefined> =
		member.collections as unknown as Record<string, bigint | number | undefined>;
	const jacobCrops = member.jacob?.stats?.crops ?? {};
	const totalWeight = member.farmingWeight?.totalWeight ?? 0;
	const farmingXp = member.skills?.farming ?? 0;
	const levelCap = (member.jacob?.perks?.levelCap ?? 0) + DEFAULT_SKILL_CAPS.farming;
	const farmingLevel = getLevelProgress('farming', farmingXp, levelCap).level;
	const participations = member.jacob?.participations ?? 0;

	// Map API collection keys to crop names
	const API_TO_CROP: Record<string, string> = {
		WHEAT: 'wheat',
		POTATO_ITEM: 'potato',
		CARROT_ITEM: 'carrot',
		MELON: 'melon',
		PUMPKIN: 'pumpkin',
		CACTUS: 'cactus',
		SUGAR_CANE: 'sugarcane',
		'INK_SACK:3': 'cocoa',
		INK_SACK: 'cocoa',
		MUSHROOM_COLLECTION: 'mushroom',
		NETHER_STALK: 'netherwart',
	};

	// Normalize collection keys to crop names
	const normalizedCollections: Record<string, number> = {};
	for (const [key, value] of Object.entries(rawCollections)) {
		const cropName = API_TO_CROP[key];
		if (cropName && value != null) {
			normalizedCollections[cropName] = (normalizedCollections[cropName] ?? 0) + Number(value);
		}
	}

	// Map jacob crop stats key patterns to crop names (e.g. "WHEAT" -> "wheat")
	const normalizedGoldMedals: Record<string, number> = {};
	for (const [key, stats] of Object.entries(jacobCrops)) {
		const cropName = API_TO_CROP[key] ?? key.toLowerCase();
		normalizedGoldMedals[cropName] = (normalizedGoldMedals[cropName] ?? 0) + (stats.medals?.gold ?? 0);
	}

	return ALL_ACHIEVEMENTS.map((achievement) => {
		let value = 0;

		switch (achievement.category) {
			case 'crop': {
				const crop = achievement.crop;
				if (!crop) break;
				if (achievement.id.startsWith('collection_')) {
					value = normalizedCollections[crop] ?? 0;
				} else if (achievement.id.startsWith('weight_')) {
					value = cropWeights[achievement.crop === 'sugarcane' ? 'Sugar Cane'
						: achievement.crop === 'netherwart' ? 'Nether Wart'
						: achievement.crop === 'cocoa' ? 'Cocoa Beans'
						: (achievement.crop ?? '').charAt(0).toUpperCase() + (achievement.crop ?? '').slice(1)] ?? 0;
				} else if (achievement.id.startsWith('contest_')) {
					value = normalizedGoldMedals[crop] ?? 0;
				}
				break;
			}
			case 'general': {
				if (achievement.id === 'total_weight') {
					value = totalWeight;
				} else if (achievement.id === 'farming_level') {
					value = farmingLevel;
				} else if (achievement.id === 'jacob_participations') {
					value = participations;
				}
				break;
			}
			case 'fortune':
			case 'contest':
				// Fortune achievements are computed externally (requires fortune calc library)
				// Contest category here is covered by crop contest achievements
				break;
		}

		return computeAchievementProgress(achievement, value);
	});
}

/**
 * Compute achievement progress for a given value.
 */
export function computeAchievementProgress(
	achievement: (typeof ALL_ACHIEVEMENTS)[number],
	value: number
): PlayerAchievement {
	const tiers = achievement.tiers;
	let currentTier = 0;

	for (let i = 0; i < tiers.length; i++) {
		if (value >= tiers[i].requirement) {
			currentTier = i + 1;
		}
	}

	const completed = currentTier >= tiers.length;
	const nextTier = completed ? tiers[tiers.length - 1] : tiers[currentTier];
	const prevReq = currentTier > 0 ? tiers[currentTier - 1].requirement : 0;

	return {
		achievement,
		currentTier,
		progress: completed ? nextTier.requirement : Math.max(0, value - prevReq),
		maxProgress: completed ? nextTier.requirement : nextTier.requirement - prevReq,
		completed,
	};
}

function toEmptyAchievement(achievement: (typeof ALL_ACHIEVEMENTS)[number]): PlayerAchievement {
	return {
		achievement,
		currentTier: 0,
		progress: 0,
		maxProgress: achievement.tiers[0].requirement,
		completed: false,
	};
}

/**
 * Get achievement progress with a known fortune value for fortune achievements.
 */
export function getAllAchievementsWithFortune(
	member: ProfileMemberDto | undefined | null,
	fortune: number
): PlayerAchievement[] {
	const achievements = getAllAchievements(member);
	return achievements.map((pa) => {
		if (pa.achievement.category === 'fortune') {
			return computeAchievementProgress(pa.achievement, fortune);
		}
		return pa;
	});
}
