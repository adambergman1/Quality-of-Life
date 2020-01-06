<script>
  import { Button, Container, Row } from "svelte-chota";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import fetchToServer from "../js/fetch.js";
  import { showCountriesStore } from "../js/store.js";
  import { fly, scale, fade } from 'svelte/transition'

  let showCountries

  showCountriesStore.subscribe(value => {
    showCountries = value
  })
  
  const dispatch = createEventDispatcher();

  let cities = [];

  let firstSelected;
  let secondSelected;
  let errorMessage;
  let showIntroContent = true;

  onMount(async () => {
    const response = await fetch("http://localhost:4000/cities")
    const json = await response.json()
    cities = json.map(res => res)
  });

  async function compareCities() {
    if (firstSelected && secondSelected && firstSelected !== secondSelected) {
      errorMessage = ''

      const obj = {
        first: firstSelected.city_id,
        second: secondSelected.city_id
      }

      const json = await fetchToServer(obj, "cityDetails")

      dispatch("cityData", {
        data: json,
        firstCity: firstSelected.city,
        secondCity: secondSelected.city
      })

      $showCountriesStore = false
      showIntroContent = false

    } else {
      errorMessage = "Please choose two cities to compare"
    }
  }
</script>
<style>
.text-red {
  color: red;
}
</style>

<div class="container">
<div class="row">
  <div class="col-12">
  {#if showIntroContent}
    <p class="is-center">Choose country to compare</p>
  {/if}
  </div>
  <div class="col">
    <select bind:value={firstSelected} required>
      <option disabled selected value="">Choose city</option>
      {#each cities as obj}
        <option value={obj}>{obj.city}</option>
      {/each}
    </select>
  </div>
  <div class="col">
    <select bind:value={secondSelected} required>
      <option disabled selected value="">Choose city</option>
      {#each cities as obj}
        <option value={obj}>{obj.city}</option>
      {/each}
    </select>
  </div>
</div>
{#if errorMessage}
<p class="text-center text-red">{errorMessage}</p>
{/if}
<div class="is-center">
  <Button on:click={compareCities} class="bg-primary text-white">
    Compare Cities
  </Button>
</div>
</div>