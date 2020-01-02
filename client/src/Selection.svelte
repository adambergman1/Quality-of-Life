<script>
  import { Button } from "svelte-chota";
  import { onMount } from "svelte";

  let cities = [];

  onMount(async () => {
    const response = await fetch("http://localhost:4000");
    const json = await response.json();
    cities = json.map(res => res.city);
    console.log(cities);
  });
</script>

<div class="row">
  <div class="col-12">
    <p class="is-center">Choose country to compare</p>
  </div>
  <div class="col">
    <select>
      {#each cities as city}
        <option>{city}</option>
      {/each}
    </select>
  </div>
  <div class="col">
    <select>
      {#each cities as city}
        <option>{city}</option>
      {/each}
    </select>
  </div>
</div>
<div class="is-center">
  <Button class="bg-primary text-white">GO!</Button>
</div>
