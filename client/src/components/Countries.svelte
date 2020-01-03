<script>
  import { onMount } from "svelte";
  import fetchToServer from "../js/fetch.js";
  export let data;
  let showCountries = false;

  onMount(async => {
    console.log(data.data[0].city_id);
    console.log(data.data[1].city_id);
    const obj = {
      firstCity: data.data[0].city_id,
      secondCity: data.data[1].city_id
    };
    fetchToServer(obj, "countries");
  });

  function compareCountries() {
    showCountries = !showCountries;
  }
</script>

<style>
  .country-comparer {
    padding-bottom: 60px;
  }
  .compare {
    cursor: pointer;
  }
</style>

<div class="country-comparer container">
  <div class="text-center compare" on:click={compareCountries}>
    Compare countries
  </div>
  {#if showCountries}
    <table>
      <tr>
        <th style="width:60%">Country Avg.</th>
        <th style="width:20%">Sweden</th>
        <th style="width:20%">USA</th>
      </tr>
      <tr>
        <td>Beer</td>
        <td>12</td>
        <td>32</td>
      </tr>
      <tr>
        <td>Taxi</td>
        <td>14</td>
        <td>14</td>
      </tr>
      <tr>
        <td>Cappuchino</td>
        <td>12</td>
        <td>12</td>
      </tr>
      <tr>
        <td>lunch</td>
        <td>62</td>
        <td>62</td>
      </tr>
      <tr>
        <td>Gym membership</td>
        <td>13</td>
        <td>13</td>
      </tr>
      <tr>
        <td>Monthly public transport</td>
        <td>12</td>
        <td>12</td>
      </tr>
      <tr>
        <td>Large appt</td>
        <td>123</td>
        <td>123</td>
      </tr>
      <tr>
        <td>Medium appt</td>
        <td>12</td>
        <td>25</td>
      </tr>
      <tr>
        <td>Small appt</td>
        <td>512</td>
        <td>512</td>
      </tr>
      <tr>
        <td>Rent index</td>
        <td>2</td>
        <td>2</td>
      </tr>
    </table>
  {/if}
</div>
