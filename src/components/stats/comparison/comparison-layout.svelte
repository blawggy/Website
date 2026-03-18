<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		player1Name: string;
		player2Name: string;
		children?: Snippet;
	}

	let { player1Name, player2Name, children }: Props = $props();
</script>

<div class="w-full">
	<div class="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
		<div class="flex items-center justify-center">
			<a href="/@{player1Name}" class="text-lg font-bold hover:underline">{player1Name}</a>
		</div>
		<div class="text-muted-foreground font-semibold">vs</div>
		<div class="flex items-center justify-center">
			<a href="/@{player2Name}" class="text-lg font-bold hover:underline">{player2Name}</a>
		</div>
	</div>

	{@render children?.()}
</div>
