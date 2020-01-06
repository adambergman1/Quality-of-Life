<script>
  import { Button } from "svelte-chota";
  import fetchToServer from "../js/fetch.js";
  
  export let data

  let firstCountry
  let secondCountry

  async function getCountryDetails () {
    const obj = {
      firstCity: data.data[0].city_id,
      secondCity: data.data[1].city_id
    }

    const result = await fetchToServer(obj, "countries")

    firstCountry = result.firstCountry
    secondCountry = result.secondCountry
  }
</script>

<style>
  .country-comparer {
    padding-bottom: 60px;
  }
</style>

<div class="country-comparer container">
  <div class="is-center">
  </div>
  {#await getCountryDetails()}
  <p>Loading...</p>
  {:then}
    <table>
      <tr>
        <th style="width:60%">Country Avg.</th>
        <th style="width:20%">{firstCountry.country}</th>
        <th style="width:20%">{secondCountry.country}</th>
      </tr>
      <tr>
        <td>Beer</td>
        <td class="price-prefix">{firstCountry.beer}</td>
        <td class="price-prefix">{secondCountry.beer}</td>
      </tr>
      <tr>
        <td>Taxi</td>
        <td class="price-prefix">{firstCountry.taxi}</td>
        <td class="price-prefix">{secondCountry.taxi}</td>
      </tr>
      <tr>
        <td>Cappuchino</td>
        <td class="price-prefix">{firstCountry.cappuchino}</td>
        <td class="price-prefix">{secondCountry.cappuchino}</td>
      </tr>
      <tr>
        <td>Lunch</td>
        <td class="price-prefix">{firstCountry.lunch}</td>
        <td class="price-prefix">{secondCountry.lunch}</td>
      </tr>
      <tr>
        <td>Gym membership</td>
        <td class="price-prefix">{firstCountry.gym}</td>
        <td class="price-prefix">{secondCountry.gym}</td>
      </tr>
      <tr>
        <td>Monthly public transport</td>
        <td class="price-prefix">{firstCountry.public_transport}</td>
        <td class="price-prefix">{secondCountry.public_transport}</td>
      </tr>
      <tr>
        <td>Small appt</td>
        <td class="price-prefix">{firstCountry.small_appt}</td>
        <td class="price-prefix">{secondCountry.small_appt}</td>
      </tr>
      <tr>
        <td>Medium appt</td>
        <td class="price-prefix">{firstCountry.medium_appt}</td>
        <td class="price-prefix">{secondCountry.medium_appt}</td>
      </tr>
      <tr>
        <td>Large appt</td>
        <td class="price-prefix">{firstCountry.large_appt}</td>
        <td class="price-prefix">{secondCountry.large_appt}</td>
      </tr>
      <tr>
        <td>Rent index</td>
        <td>{firstCountry.rent_index}</td>
        <td>{secondCountry.rent_index}</td>
      </tr>
    </table>
    {/await}
</div>
