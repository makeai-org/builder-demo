<script lang="ts">
	import { onMount } from 'svelte';

	export function clearCanvas () {
		context.fillStyle = "black";
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

	export function getCanvasData() {
		canvasData = context.getImageData(0, 0, canvas.width, canvas.height).data;
	}
	export let canvasData: any;

	let canvas: HTMLCanvasElement;
	let context: any;
	let isDrawing = false;
	let start: any;

	let offsetX = 0;
	let offsetY = 0;
	
	onMount(() => {
		context = canvas.getContext('2d');
		context.fillStyle = "black";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.lineWidth = 2;
		context.strokeStyle = 'white';
		handleSize();
	})

	const handleSize = () => {
		const { top, left } = canvas.getBoundingClientRect();
		offsetX = left;
		offsetY = top;
	}
	
	const handleStart = ({ clientX, clientY, button }) => { 
		handleSize();
		isDrawing = true;
		start = {
			x: (clientX - offsetX) * (canvas.width / 280),
			y: (clientY - offsetY) * (canvas.height / 280),
			color: button == 2 ? 'black' : 'white', 
			size: button == 2 ? 4 : 2
		};
	}
	
	const handleEnd = () => { 
		isDrawing = false;
	}

	const handleMove = ({ clientX, clientY, button }) => {
		if(!isDrawing) return;
		
		const x1 = (clientX - offsetX) * (canvas.width / 280);
		const y1 = (clientY - offsetY) * (canvas.height / 280);
		
		const { x, y, color, size } = start;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x1, y1);
		context.closePath();
		context.lineWidth = size;
		context.strokeStyle = color;
		context.stroke();
		
		start = { x: x1, y: y1, color, size };
	}

</script>

<svelte:window on:scroll={handleSize} on:resize={handleSize} />

<canvas
	bind:this={canvas}
	width = {28}
	height = {28}
	style = "background-color: black; touch-action: none; width: 280px; height: 280px;"
	on:mousedown={handleStart}	
	on:contextmenu={e => e.preventDefault()}
	on:touchstart={e => {
		const { clientX, clientY, button } = e.touches[0];
		handleStart({ clientX, clientY, button });
	}}
	on:mouseup={handleEnd}				
	on:touchend={handleEnd}				
	on:mouseleave={handleEnd}
	on:mousemove={handleMove}
	on:touchmove={e => {
		const { clientX, clientY, button } = e.touches[0];
		handleMove({ clientX, clientY, button });
	}}
/>
