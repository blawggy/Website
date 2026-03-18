import { FORTUNE_BADGE_TIERS, type FortuneBadge } from '$lib/constants/fortune-badges';

/**
 * Returns the highest badge tier the player qualifies for based on their total fortune.
 */
export function getOverallFortuneBadge(totalFortune: number): FortuneBadge {
	let badge = FORTUNE_BADGE_TIERS[0];
	for (const tier of FORTUNE_BADGE_TIERS) {
		if (totalFortune >= tier.minFortune) {
			badge = tier;
		}
	}
	return badge;
}

/**
 * Returns the next badge tier after the current one, or null if already at max.
 */
export function getNextFortuneBadge(currentFortune: number): FortuneBadge | null {
	for (const tier of FORTUNE_BADGE_TIERS) {
		if (currentFortune < tier.minFortune) {
			return tier;
		}
	}
	return null;
}

/**
 * Returns the progress toward the next fortune badge tier (0–1).
 */
export function getFortuneBadgeProgress(currentFortune: number): number {
	const current = getOverallFortuneBadge(currentFortune);
	const next = getNextFortuneBadge(currentFortune);

	if (!next) return 1;

	const range = next.minFortune - current.minFortune;
	const progress = currentFortune - current.minFortune;

	return Math.min(1, Math.max(0, progress / range));
}
