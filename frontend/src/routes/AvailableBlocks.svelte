<script lang="ts">
    import {dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME} from 'svelte-dnd-action';
	import {flip} from 'svelte/animate';

    const flipDurationMs = 100;
    let shouldIgnoreDndEvents = false;
    let dropFromOthersDisabled = true;
    function handleDndConsider(e) {
        const {trigger, id} = e.detail.info;
        if (trigger === TRIGGERS.DRAG_STARTED) {
            const idx = items.findIndex(item => item.id === id);
            const newId = `${id}_copy_${Math.round(Math.random()*100000)}`;
			e.detail.items = e.detail.items.filter(item => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
            e.detail.items.splice(idx, 0, {...items[idx], id: newId});
            items = e.detail.items;
            shouldIgnoreDndEvents = true;
        }
        else if (!shouldIgnoreDndEvents) {
            items = e.detail.items;
        }
        else {
            items = [...items];
        }
    }
    function handleDndFinalize(e) {
        if (!shouldIgnoreDndEvents) {
            items = e.detail.items;
        }
        else {
            items = [...items];
            shouldIgnoreDndEvents = false;
        }
    }
    export let items: any;
</script>

<section class="p-6 relative" use:dndzone="{{items, flipDurationMs, dropFromOthersDisabled, dropTargetStyle: {}}}" on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}">
    {#each items as block(block.id)}
    <div class="mb-6 touch-none" animate:flip="{{duration: flipDurationMs}}">
    <div class="flex flex-row items-center w-48 min-h-16 border-2 rounded-2xl border-base-100 {block.name == 'Input Layer' ? 'bg-[#323d76]' : block.name == 'Dense Layer' ? 'bg-[#460e0e]' : block.name == 'Convolutional Layer' ? 'bg-[#1a2e1a]' : 'bg-blue-950'}">
    <svg class="w-4 h-4" fill="#ffffff" width="800px" height="800px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.375 3.67c0-.645-.56-1.17-1.25-1.17s-1.25.525-1.25 1.17c0 .646.56 1.17 1.25 1.17s1.25-.524 1.25-1.17zm0 8.66c0-.646-.56-1.17-1.25-1.17s-1.25.524-1.25 1.17c0 .645.56 1.17 1.25 1.17s1.25-.525 1.25-1.17zm-1.25-5.5c.69 0 1.25.525 1.25 1.17 0 .645-.56 1.17-1.25 1.17S4.875 8.645 4.875 8c0-.645.56-1.17 1.25-1.17zm5-3.16c0-.645-.56-1.17-1.25-1.17s-1.25.525-1.25 1.17c0 .646.56 1.17 1.25 1.17s1.25-.524 1.25-1.17zm-1.25 7.49c.69 0 1.25.524 1.25 1.17 0 .645-.56 1.17-1.25 1.17s-1.25-.525-1.25-1.17c0-.646.56-1.17 1.25-1.17zM11.125 8c0-.645-.56-1.17-1.25-1.17s-1.25.525-1.25 1.17c0 .645.56 1.17 1.25 1.17s1.25-.525 1.25-1.17z"/></svg>
    <p class="text-lg p-2">
        {block.name}
    </p>
    <div class="dropdown dropdown-hover dropdown-end ml-auto pr-1">
        <label tabindex="0" class="btn btn-circle btn-ghost btn-xs text-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </label>
        <div tabindex="0" class="card compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-48">
            <div class="card-body">
                <h2 class="card-title">About Layer</h2>
                {#if block.name == "Dense Layer"}
                <p>Layer consisting of a line of nodes, each node holds a single value and passes this value on to the next layer.</p>
                {:else if block.name == "Convolutional Layer"}
                <p>Layer consisting of multidimensional nodes, which could represent data like images.</p>
                {/if}
            </div>
        </div>
    </div>
    </div>
    </div>
    {/each}
</section>
