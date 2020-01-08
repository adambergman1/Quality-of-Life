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
  
  const dispatch = createEventDispatcher()

  let cities = []

  let showIntroContent = true
  let firstSelected
  let secondSelected
  let errorMessage

  let firstCity
  let secondCity

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

      if (json[0].city !== firstSelected.city) {
        firstCity = json[1]
        secondCity = json[0]
      } else {
        firstCity = json[0]
        secondCity = json[1]
      }

      const dataToDispatch = [firstCity, secondCity]

      dispatch("cityData", {
        data: dataToDispatch
        // data: json,
        // firstCity: firstSelected.city,
        // secondCity: secondSelected.city
      })

      $showCountriesStore = false
      showIntroContent = false

      setTimeout(() => {
        location.href = "#city-comparison"
      }, 0)
    } else {
      errorMessage = "Please choose two cities to compare"
    }
  }
</script>
<style>
.text-red {
  color: red;
}

.container {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>

<div class="container">
<div class="row">
<div class="col-3"></div>
  <div class="col-6">
  {#if showIntroContent}
    <p class="text-center">
    Quality of life is a city comparison 
    with more than 200 cities around the world 
    to choose from. Compare cities based on the
     cost of living by selecting two cities below.
    </p>
  {/if}
  </div>
  <div class="col-3"></div>
  <div class="col-6">
    <select bind:value={firstSelected} required>
      <option disabled selected value="">Choose city</option>
      {#each cities as obj}
        <option value={obj}>{obj.city}</option>
      {/each}
    </select>
  </div>
  <div class="col-6">
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
    Compare cities
  </Button>
</div>
</div>