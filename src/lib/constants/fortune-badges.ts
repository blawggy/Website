export interface FortuneBadge {
	id: string;
	name: string;
	description: string;
	tier: 'novice' | 'apprentice' | 'adept' | 'expert' | 'master' | 'legend';
	minFortune: number;
	color: string;
	icon: string;
}

export const FORTUNE_BADGE_TIERS: FortuneBadge[] = [
	{
		id: 'fortune_novice',
		name: 'Novice',
		description: 'Just starting out with Farming Fortune',
		tier: 'novice',
		minFortune: 0,
		color: '#94a3b8',
		icon: '🌱',
	},
	{
		id: 'fortune_apprentice',
		name: 'Apprentice',
		description: 'Building up Farming Fortune',
		tier: 'apprentice',
		minFortune: 100,
		color: '#22c55e',
		icon: '🌿',
	},
	{
		id: 'fortune_adept',
		name: 'Adept',
		description: 'Solid Farming Fortune progress',
		tier: 'adept',
		minFortune: 500,
		color: '#3b82f6',
		icon: '🍀',
	},
	{
		id: 'fortune_expert',
		name: 'Expert',
		description: 'Impressive Farming Fortune',
		tier: 'expert',
		minFortune: 1000,
		color: '#a855f7',
		icon: '⭐',
	},
	{
		id: 'fortune_master',
		name: 'Master',
		description: 'Mastery of Farming Fortune',
		tier: 'master',
		minFortune: 1500,
		color: '#f59e0b',
		icon: '💫',
	},
	{
		id: 'fortune_legend',
		name: 'Legend',
		description: 'Legendary Farming Fortune',
		tier: 'legend',
		minFortune: 2000,
		color: '#ef4444',
		icon: '🔥',
	},
];
