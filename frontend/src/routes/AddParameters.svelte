<script lang="ts">
    export let epochs: number;
    export let learningRate: number;
</script>

<div class="flex flex-col">
    <div class="pt-4 pb-4">
    <div class="flex flex-row">
    <label for="epochs">Epochs: {epochs}</label>
    <div class="dropdown dropdown-hover dropdown-bottom max-md:dropdown-end md:dropdown-right ml-auto">
		  <label tabindex="0" class="btn btn-circle btn-ghost btn-xs text-info">
		    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
		  </label>
		  <div tabindex="0" class="card compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
		    <div class="card-body">
		      <h2 class="card-title">Epochs</h2>
		      <p>The number of times the model trains on the data set. For example, if you choose two epochs, the model will see each data point twice.</p>
		    </div>
		  </div>
		</div>
    </div>
    <input bind:value={epochs} type="range" min="1" max="5" class="range" step="1" id="epochs" />
    <div class="w-full flex justify-between text-xs px-2">
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
    </div>
    </div>
    <div class="pb-4">
    <div class="flex flex-row">
    <label for="learningRate">Learning Rate: {learningRate}</label>
    <div class="dropdown dropdown-hover dropdown-bottom max-md:dropdown-end md:dropdown-right ml-auto">
		  <label tabindex="0" class="btn btn-circle btn-ghost btn-xs text-info">
		    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
		  </label>
		  <div tabindex="0" class="card compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
		    <div class="card-body">
		      <h2 class="card-title">Learning rate</h2>
		      <p>How fast the model learns, a higher number may increase accuracy in the short term but could lead to overfitting.</p>
		    </div>
		  </div>
		</div>
    </div>
    <input bind:value={learningRate} type="range" min="0.001" max="0.01" class="range" step="0.001" id="learningRate" />
    <div class="w-full flex justify-between text-xs px-2">
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
    </div>
    </div>
</div>
