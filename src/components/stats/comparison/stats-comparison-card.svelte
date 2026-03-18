<script lang="ts">
	interface Props {
		label: string;
		value1: number | string;
		value2: number | string;
		format?: (v: number | string) => string;
		higherIsBetter?: boolean;
	}

	let { label, value1, value2, format, higherIsBetter = true }: Props = $props();

	const fmt = (v: number | string) => format ? format(v) : typeof v === 'number' ? v.toLocaleString() : v;

	const num1 = $derived(typeof value1 === 'number' ? value1 : parseFloat(String(value1)) || 0);
	const num2 = $derived(typeof value2 === 'number' ? value2 : parseFloat(String(value2)) || 0);
	const total = $derived(num1 + num2);
	const p1Percent = $derived(total > 0 ? (num1 / total) * 100 : 50);
	const p2Percent = $derived(total > 0 ? (num2 / total) * 100 : 50);

	const p1Higher = $derived(num1 > num2);
	const p2Higher = $derived(num2 > num1);

	const p1Color = $derived(
		higherIsBetter
			? p1Higher ? '#22c55e' : p2Higher ? '#ef4444' : '#94a3b8'
			: p1Higher ? '#ef4444' : p2Higher ? '#22c55e' : '#94a3b8'
	);
	const p2Color = $derived(
		higherIsBetter
			? p2Higher ? '#22c55e' : p1Higher ? '#ef4444' : '#94a3b8'
			: p2Higher ? '#ef4444' : p1Higher ? '#22c55e' : '#94a3b8'
	);
</script>

<div class="flex flex-col gap-1">
	<p class="text-muted-foreground text-center text-xs">{label}</p>
	<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
		<p class="text-right text-sm font-semibold" style="color: {p1Color};">{fmt(value1)}</p>
		<div class="h-4 w-20 overflow-hidden rounded-full bg-muted sm:w-32">
			<div class="flex h-full">
				<div class="h-full transition-all" style="width: {p1Percent}%; background-color: {p1Color};"></div>
				<div class="h-full transition-all" style="width: {p2Percent}%; background-color: {p2Color};"></div>
			</div>
		</div>
		<p class="text-sm font-semibold" style="color: {p2Color};">{fmt(value2)}</p>
	</div>
</div>
