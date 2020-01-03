<script>
  import { Button } from "svelte-chota";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import fetchToServer from "../js/fetch.js";

  const dispatch = createEventDispatcher();

  let cities = [];

  let firstSelected;
  let secondSelected;
  let errorMessage;

  onMount(async () => {
    const response = await fetch("http://localhost:4000/cities");
    const json = await response.json();
    cities = json.map(res => res);
  });

  async function compareCities() {
    if (firstSelected && secondSelected && firstSelected !== secondSelected) {
      const obj = {
        first: firstSelected.city_id,
        second: secondSelected.city_id
      };

      const json = await fetchToServer(obj, "cityDetails");

      dispatch("cityData", {
        data: json,
        firstCity: firstSelected.city,
        secondCity: secondSelected.city
      });
    } else {
      errorMessage = "Please choose two cities to compare";
    }
  }
</script>

<div class="row">
  <div class="col-12">
    <p class="is-center">Choose country to compare</p>
  </div>
  <div class="col">
    <select bind:value={firstSelected} required>
      <option disabled value="">Choose city</option>
      {#each cities as obj}
        <option value={obj}>{obj.city}</option>
      {/each}
    </select>
  </div>
  <div class="col">
    <select bind:value={secondSelected} required>
      <option disabled value="">Choose city</option>
      {#each cities as obj}
        <option value={obj}>{obj.city}</option>
      {/each}
    </select>
  </div>
</div>
<p>{errorMessage ? errorMessage : ''}</p>
<div class="is-center">
  <Button on:click={compareCities} class="bg-primary text-white">
    Compare Cities
  </Button>
</div>
