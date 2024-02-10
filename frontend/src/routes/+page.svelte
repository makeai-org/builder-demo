<svelte:head>
    <title>Builder Demo - MakeAI</title>
    <meta name="description" content="Builder Demo - MakeAI" />
</svelte:head>

<script lang="ts">
    import AvailableBlocks from "./AvailableBlocks.svelte";
    import BlocksSpace from "./BlocksSpace.svelte";
    import AddParameters from "./AddParameters.svelte";
    import Canvas from "./Canvas.svelte";
    import CustomCanvas from "./CustomCanvas.svelte";
    import PreviewCanvas from "./PreviewCanvas.svelte";

    let blocks = [
		{
			id: '1',
			name: 'Dense Layer',
			layers: 16,
			pooling: 0,
		},
		{
			id: '2',
			name: 'Convolutional Layer',
			layers: 8,
			pooling: 0,
		},
	];
    let items: any[] = [];

	let mainCanvas: any;
	let mainCanvasData: any = null;

	let customCanvas: any;
	let customCanvasData: any = null;
	let customCanvasLabel: string = "";
	let customCanvasDataArray: ImageWithLabel[] = [];
	class ImageWithLabel {
		constructor (
			public image: any,
			public label: string,
			public id: number,
		){}
	}
	class DataWithLabel {
		constructor (
			public drawing: number[],
			public label: string,
		){}
	}
	
	let epochs = 2;
	let learningRate = 0.001;
	let customData: any[] = [];
	let useCustomData = false;
	class Layer {
		constructor (
			public name: string,
			public layers: number,
			public pooling: number,
		){}
	}

	let submitting: boolean = false;
	let error: any = null;

	let result: any = null;
	let currentModel: string = "";
	
	async function train() {
		submitting = true;
		error = null;

		if(items.length == 0) {
			error = "No Layers added";
			submitting = false;
			return;
		}

		if(!useCustomData) {
			customData = [];
		} else {
			if (customCanvasDataArray.length == 0) {
				error = "Custom data not added";
				submitting = false;
				return;
			} else {
				let trainingData: DataWithLabel[] = [];
				for(let i = 0; i < customCanvasDataArray.length; i++) {
					let pixels = customCanvasDataArray[i].image;
					let pixelsArray: number[] = [];
					for(let j = 0; j < pixels.length; j+=4) {
						pixelsArray.push(pixels[j]);
					}
					let label = customCanvasDataArray[i].label;
					trainingData.push(new DataWithLabel(pixelsArray, label));
				}
				customData = trainingData;
			}
		}

		let theLayers: Layer[] = [];
		for(let i = 0; i < items.length; i++) {
			theLayers[i] = new Layer(items[i].name, items[i].layers, items[i].pooling);
		}
		const inputs = {
			layers: theLayers,
			epochs,
			learningRate,
			customData,
		}
		const response = await fetch('/api/train/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( inputs ),
		});
		
		if(response.ok) {
			const resultArr = await response.json();
			result = resultArr[0];
			if(result.error.length > 0) {
				error = result.error;
			} else {
				currentModel = result.modelID;
			}
		} else {
			error = await response.json();
			if(error.message.length > 0) {
				error = error.message;
				if(error = "Internal Error") {
					error = "Server Error";
				}
			} else {
				error = JSON.stringify(error);
			}
		}
		submitting = false;
	}

	let predicting = false;
	let prediction: string = "";
	let labels: string[] = [];
	
	async function predict() {
		if (!useCustomData) {
			labels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
		} else {
			let uniqueLabels: string[] = [];
			for(let i = 0; i < customData.length; i++) {
				let testLabel = customData[i].label;
				if (!uniqueLabels.includes(testLabel)) {
					uniqueLabels.push(testLabel);
				}
			}
			labels = uniqueLabels;
		}

		if (currentModel.length == 0) {
			predicting = false;
			prediction = "No model loaded";
			return;
		}
		prediction = "";
		predicting = true;
		mainCanvas.getCanvasData();
		let predictionArray: number[] = [];
		for(let i = 0; i < mainCanvasData.length; i+=4) {
			predictionArray.push(mainCanvasData[i]);
		}
		const inputsPred = {
			modelID: currentModel,
			predictImg: predictionArray,
			labels,
		}
		const response = await fetch('/api/predict/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( inputsPred ),
		});
        if (response.ok) {
            let resultPred = await response.json();
		    resultPred = resultPred[0];
            prediction = resultPred.prediction;
        } else {
            let predictionError = await response.json();
			if(predictionError.message.length > 0) {
				prediction = predictionError.message;
				if(prediction = "Internal Error") {
					prediction = "Server Error";
				}
			} else {
				prediction = JSON.stringify(predictionError);
			}
        }
		predicting = false;
	}

	let addLabelError: any = null;
	let imageWithLabelID = 0;
	async function addCustomData() {
		addLabelError = null;
		if (customCanvasLabel.length == 0) {
			addLabelError = "Label must not be empty";
			return;
		} 
		if (customCanvasDataArray.length == 100) {
			addLabelError = "Maximum number of custom data is 100";
			return;
		}
		customCanvas.getCanvasData();
		customCanvasDataArray.push(new ImageWithLabel(customCanvasData.data, customCanvasLabel, imageWithLabelID));
		customCanvasDataArray = customCanvasDataArray;
		imageWithLabelID++;
	}

</script>

<div class="grid md:grid-flow-col grid-cols-1 md:grid-cols-6 md:min-h-screen">

<div class="md:col-span-1 md:row-span-3 order-2 md:order-1 md:border-y-4 md:border-r-4 md:rounded-tr-xl md:rounded-br-xl md:border-[#1f202d] md:mr-2 p-2">
	<div class="rounded-md bg-[#14333d]"><p class="p-2 text-center text-xl font-semibold">Available Blocks: </p></div>
	<div class="flex flex-col items-center p-6">
		<AvailableBlocks items = {blocks}/>
	</div>
	<div class="rounded-md bg-[#14333d]"><p class="p-2 text-center text-xl font-semibold">Additional Parameters: </p></div>
	<div class="px-6">
		<AddParameters bind:epochs = {epochs} bind:learningRate = {learningRate}/>
	</div>
</div>

<div class="md:col-span-4 md:row-span-2 order-1 md:order-2 bg-[#1f202d] rounded-md mx-2 mb-2 mt-3">
	<div class="rounded-md border-b-2 border-solid border-base-100 bg-[#212051]"><p class="p-2 text-center text-xl font-semibold">Build Space: </p></div>
	<div class="flex justify-center">
		<div class="flex flex-row items-center w-80 min-h-16 border-2 rounded-2xl border-base-100 bg-[#323d76]">
		<p class="flex-grow text-lg text-center p-2 ml-6">Input Layer</p>
		<div class="dropdown dropdown-hover dropdown-bottom dropdown-end ml-auto pr-1">
		  <label tabindex="0" class="btn btn-circle btn-ghost btn-xs text-info">
		    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
		  </label>
		  <div tabindex="0" class="card compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
		    <div class="card-body">
		      <h2 class="card-title">About Layer</h2>
		      <p>This layer is where the data is inputted. It has to be the same shape as the data but we handle that for you!</p>
		    </div>
		  </div>
		</div>
	</div>
	</div>
	<div class="flex flex-col items-center px-6 pb-6">
		<BlocksSpace bind:items/>
	</div>
</div>

<div class="md:col-span-4 md:row-span-1 order-4 md:order-3 m-2">
	<div class="mt-auto pb-[15px] bg-base-100">
	<div class="rounded-md bg-[#212051]"><p class="p-2 text-center text-xl font-semibold">Testing Space: </p></div>
	<div>
		<div class="flex flex-col md:flex-row items-center md:items-start md:place-content-center gap-4 py-6">
			<div class="flex flex-col items-center gap-4">
				<p>Draw Here</p>
				<div class="flex flex-col">
					<p>Left click - draw</p>
					<p>Right click - erase</p>
					<p>Touch - only draw</p>
				</div>
				<button on:click={mainCanvas.clearCanvas} class="order-last md:order-first btn btn-primary">Clear</button>
			</div>
			
			<div class="border-4 border-[#1f202d] rounded-lg overflow-hidden">
			<Canvas bind:canvasData={mainCanvasData} bind:this={mainCanvas}/>
			</div>

			<div class="flex flex-col gap-4 items-center">
				<button on:click={predict} class="btn btn-secondary">Predict</button>
				<div class="stat rounded-lg bg-base-100">
					<div class="stat-title">Prediction: </div>
					<div class="stat-value">
						{#if predicting}
							<span class="loading loading-ring loading-lg"></span>
						{/if}
						{prediction}
					</div>
					<div class="stat-desc">Note: prediction can be innacurate</div>
				  </div>
			</div>
		</div>
	</div>
	</div>
</div>

<div class="md:col-span-1 md:row-span-3 order-3 md:order-4 md:border-y-4 md:border-l-4 md:rounded-tl-xl md:rounded-bl-xl md:border-[#1f202d] md:ml-2 p-2">
	<p class="rounded-md p-2 text-center text-xl font-semibold border-solid border-b-2 border-base-100 bg-[#02005f]">Training: </p>
	<div class="px-2 pt-2">
		<div class="form-control">
			<label class="label cursor-pointer">
			  <span class="label-text">Use pre-made number data</span> 
			  <input value={false} bind:group={useCustomData} type="radio" name="radio-10" class="radio checked:bg-blue-500" checked />
			</label>
		</div>
		<div class="form-control">
			<label class="label cursor-pointer" >
			  <span class="label-text">Use custom data</span> 
			  <input value={true} bind:group={useCustomData} type="radio" name="radio-10" class="radio checked:bg-blue-500" />
			</label>
		</div>
	</div>

	<div class="flex justify-center"><button class="btn btn-primary" onclick="my_modal_1.showModal()">Add custom data</button></div>
	<dialog id="my_modal_1" class="modal">
		<div class="modal-box w-11/12 max-w-full max-md:w-full max-md:max-w-full bg-[#1a1b27]">
			<div class="flex items-center">
				<p class="font-bold text-lg pt-2">Add custom drawing data</p>
				<div class="modal-action ml-auto" onclick="my_modal_1.close()">
					<button class="btn btn-error btn-circle" aria-label="Close">
						<svg class="fill-black" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
					</button>
				</div>
			</div>
			<div class="flex flex-col md:flex-row py-2 gap-4">
				<div class="flex flex-col gap-2">
					<CustomCanvas bind:canvasData={customCanvasData} bind:this={customCanvas} />
					<div class="join">
						<div class="form-control w-[11rem] max-w-xs">
							<input bind:value={customCanvasLabel} on:submit={addCustomData} type="text" class="input input-bordered join-item" placeholder="Label"/>
							<div class="label">
								<span class="label-text-alt">Note: label is case-sensitive</span>
							</div>
						</div>
						<button class="btn join-item" on:click={addCustomData}>Add</button>
					</div>
					<button on:click={customCanvas.clearCanvas} class="btn btn-primary w-fit">Clear canvas</button>
					{#if addLabelError}
					<div class="alert alert-error">
						<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
						<span>{addLabelError}</span>
					</div>
					{/if}
				</div>
				<div>
					<p class="pb-2 text-lg font-bold">Added data:</p>
					<div class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
					{#each customCanvasDataArray as preview}
						<div class="indicator">
							<PreviewCanvas label={preview.label} previewCanvasData={preview.image} />
						</div>
					{/each}
					</div>
				</div>
		  	</div>
		</div>
	</dialog>

	{#if ! submitting}
	<div class="flex justify-center">
		<div class="p-6"><button  on:click={train} class="btn btn-secondary">Train</button></div>
	</div>
	<br><br>
	{:else}
	<div class="flex justify-center">
		<div class="p-6"><button  on:click={train} class="btn btn-secondary btn-disabled">Train</button></div>
	</div>
	<div class="flex flex-col items-center pb-4">
		<p>Training...</p>
		<progress class="progress w-32"></progress>
	</div>
	{/if}

	{#if error}
	<div class="py-2"><div class="alert alert-error">
		<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
		<span>{error}</span>
	</div></div>
	{/if}

	{#if currentModel.length <= 1}
	<div class="alert alert-info mb-2">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
		<span>No model trained</span>
	</div>
	{:else}
	<div class="alert alert-success mb-2">
		<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
		<span>Model trained</span>
	</div>
	{/if}

	<p class="rounded-md p-2 text-center text-xl font-semibold border-solid border-t-2 border-b-2 border-base-100 bg-[#02005f]">Training Statistics: </p>
	<div class="flex justify-center">
	<div class="stats stats-horizontal md:stats-vertical shadow">

		<div class="stat">
		  <div class="stat-title">Test accuracy: </div>
		  {#if result}
		  {#if result.accuracy == 101 || result.accuracy == 0}
		  <div class="stat-value">N/A</div>
		  {:else}
		  <div class="stat-value">{Math.round(result.accuracy * 100) / 100}%</div>
		  {/if}
		  {:else}
		  <div class="stat-value">0%</div>
		  {/if}
		  <div class="stat-desc">Accuracy of the model</div>
		</div>
		
		<div class="stat">
		  <div class="stat-title">Parameters: </div>
		  {#if result}
		  {#if result.parameters == 0}
		  <div class="stat-value">N/A</div>
		  {:else}
		  <div class="stat-value">{result.parameters}</div>
		  {/if}
		  {:else}
		  <div class="stat-value">0</div>
		  {/if}
		  <div class="stat-desc">Number of parameters</div>
		</div>
		
		<div class="stat">
		  <div class="stat-title">Training time: </div>
		  {#if result}
		  {#if result.trainingTime == 0}
		  <div class="stat-value">N/A</div>
		  {:else}
		  <div class="stat-value">{result.trainingTime}s</div>
		  {/if}
		  {:else}
		  <div class="stat-value">0s</div>
		  {/if}
		  <div class="stat-desc">Model training time (s)</div>
		</div>
		
	</div>
	</div>
</div>
</div>
