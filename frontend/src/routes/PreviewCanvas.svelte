<script lang="ts">
    import { onMount } from 'svelte';

    let canvas: HTMLCanvasElement;
    let ctx: any;
    export let previewCanvasData: any;
	let imageData = new ImageData(previewCanvasData, 28, 28)
	export let label: string;

    onMount(() => {
		ctx = canvas.getContext('2d');
		ctx.putImageData(imageData, 0, 0);
	})
</script>

<div class="flex flex-col gap-1">
	<canvas
		bind:this={canvas}
		width = {28}
		height = {28}
		style = "width: 140px; height: 140px;"
	/>
	<p class="break-all text-xs">
		{label}
	</p>
</div>
