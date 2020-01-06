<script>
  import { onMount } from "svelte";
  import { Button } from "svelte-chota";
  import fetchToServer from "../js/fetch.js";
  
  export let data
  let showCountries = false
  let firstCountry
  let secondCountry

  onMount(async () => {
    const obj = {
      firstCity: data.data[0].city_id,
      secondCity: data.data[1].city_id
    }

    const result = await fetchToServer(obj, "countries")

    firstCountry = result.firstCountry
    secondCountry = result.secondCountry
  })

  function compareCountries() {
    showCountries = !showCountries
  }
</script>

<style>
  .country-comparer {
    padding-bottom: 60px;
  }
</style>

<div class="country-comparer container">
  <div class="is-center">
    <Button dark outline class="text-center compare" on:click={compareCountries}>
    {#if firstCountry && secondCountry}
      Compare average costs in {firstCountry.country} with {secondCountry.country}
    {/if}
    </Button>
  </div>
  {#if showCountries}
    <table>
      <tr>
        <th style="width:60%">Country Avg.</th>
        <th style="width:20%">{firstCountry.country}</th>
        <th style="width:20%">{secondCountry.country}</th>
      </tr>
      <tr>
        <td>Beer</td>
        <td>{firstCountry.beer}</td>
        <td>{secondCountry.beer}</td>
      </tr>
      <tr>
        <td>Taxi</td>
        <td>{firstCountry.taxi}</td>
        <td>{secondCountry.taxi}</td>
      </tr>
      <tr>
        <td>Cappuchino</td>
        <td>{firstCountry.cappuchino}</td>
        <td>{secondCountry.cappuchino}</td>
      </tr>
      <tr>
        <td>Lunch</td>
        <td>{firstCountry.lunch}</td>
        <td>{secondCountry.lunch}</td>
      </tr>
      <tr>
        <td>Gym membership</td>
        <td>{firstCountry.gym}</td>
        <td>{secondCountry.gym}</td>
      </tr>
      <tr>
        <td>Monthly public transport</td>
        <td>{firstCountry.public_transport}</td>
        <td>{secondCountry.public_transport}</td>
      </tr>
      <tr>
        <td>Small appt</td>
        <td>{firstCountry.small_appt}</td>
        <td>{secondCountry.small_appt}</td>
      </tr>
      <tr>
        <td>Medium appt</td>
        <td>{firstCountry.medium_appt}</td>
        <td>{secondCountry.medium_appt}</td>
      </tr>
      <tr>
        <td>Large appt</td>
        <td>{firstCountry.large_appt}</td>
        <td>{secondCountry.large_appt}</td>
      </tr>
      <tr>
        <td>Rent index</td>
        <td>{firstCountry.rent_index}</td>
        <td>{secondCountry.rent_index}</td>
      </tr>
    </table>
  {/if}
</div>
