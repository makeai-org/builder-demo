<script lang="ts">
    import {dndzone} from 'svelte-dnd-action';
	import {flip} from 'svelte/animate';

    const flipDurationMs = 100;
    let maxItems = 5;
    let dropFromOthersDisabled = false;
    function handleDndConsider(e) {
        items = e.detail.items;
    }
    function handleDndFinalize(e) {
        items = e.detail.items;
        dropFromOthersDisabled = (items.length >= maxItems);
    }
    export let items: any;

    function removeBlock(index: string) {
        let tempArr = items;
        items = tempArr.filter(obj => obj.id !== index);
        dropFromOthersDisabled = (items.length >= maxItems);
    }
</script>

{#if items.length == 0}
<p>Drag layers here to start building</p>
{/if}
<section class="w-72 px-6 pb-12" use:dndzone="{{items, flipDurationMs, dropFromOthersDisabled, dropTargetStyle: {outline: 'rgba(50, 61, 118, 1) solid 4px'}}}" on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}">
    {#each items as block(block.id)}
    <div class="touch-none" animate:flip="{{duration: flipDurationMs}}">
    <div class="flex flex-row items-center min-h-16 border-2 rounded-2xl border-base-100 {block.name == 'Dense Layer' ? 'bg-[#460e0e]' : block.name == 'Convolutional Layer' ? 'bg-[#1a2e1a]' : 'bg-blue-950'}">
    <button on:click={() => removeBlock(block.id)} class="btn btn-sm btn-circle bg-black bg-opacity-20 ml-1">
        <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
    </button>
    <p class="text-lg text-center w-full p-2">
        {block.name}
    </p>
    <div class="dropdown dropdown-bottom max-md:dropdown-end md:dropdown-right ml-auto my-auto mr-1">
        <label tabindex="0" class="btn btn-md bg-black bg-opacity-20">&gt;</label>
        <div tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            {#if block.name == "Convolutional Layer"}
            <input bind:value={block.layers} type="range" min="4" max="16" class="range" step="2" />
            <div class="flex flex-row">
              <p>Layers: {block.layers}</p>
            </div>
            <p class="pt-6">Pooling:</p>
            <select bind:value={block.pooling} class="select w-full max-w-xs">
                <option value="0">No pooling</option>
                <option value="2">2x2</option>
                <option value="4">4x4</option>
                <option value="7">7x7</option>
            </select>
            {:else}
            <input bind:value={block.layers} type="range" min="8" max="32" class="range" step="2" />
            <p>Nodes: {block.layers}</p>
            {/if}
            <select class="select w-full max-w-xs">
                <option disabled>Activation Function: </option>
                <option>ReLU</option>
            </select>
        </div>
    </div>
    </div>
    </div>
    {/each}
</section>
{#if dropFromOthersDisabled}
<div class="alert alert-warning">
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    <span>Maximum number of blocks is 5</span>
</div>
{/if}
