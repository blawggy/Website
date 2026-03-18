import { getAccount, getSelectedProfile } from '$lib/api';
import type { PageServerLoad } from './$types';

async function fetchPlayerData(id: string) {
	if (!id) return null;
	try {
		const { data: account } = await getAccount(id.replaceAll('-', ''));
		if (!account?.id || !account?.name) return null;

		const { data: member } = await getSelectedProfile(account.id);
		return { name: account.name, uuid: account.id, member: member ?? null };
	} catch {
		return null;
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const p1 = url.searchParams.get('p1') ?? '';
	const p2 = url.searchParams.get('p2') ?? '';

	const [player1Data, player2Data] = await Promise.all([
		p1 ? fetchPlayerData(p1) : null,
		p2 ? fetchPlayerData(p2) : null,
	]);

	return {
		p1,
		p2,
		player1Data,
		player2Data,
	};
};
