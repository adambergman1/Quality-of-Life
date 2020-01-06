<script>
  import { Container, Row, Col, Button, Card } from "svelte-chota";
  import Countries from "./Countries.svelte";
  import { onMount } from "svelte";
  import { showCountriesStore } from '../js/store.js'
  import { fly, fade } from 'svelte/transition'

  export let data
  let showCountries = false

  showCountriesStore.subscribe(value => {
    showCountries = value
  })

  function toggleCountries() {
    showCountriesStore.update(value => {
      return value = !value
    })
  }
</script>

<style>
  .bold {
    font-weight: 700;
  }
</style>

<div class="container">
<div class="cities-information" transition:fly="{{ y: 50, duration: 800 }}">
    <Row>
    <Col class="text-center">
      <p class="bold">{data.firstCity}</p>
      <p>{data.data[0].information}</p>
    </Col>
    <Col class="text-center">
      <p class="bold">{data.secondCity}</p>
      <p>{data.data[1].information}</p>
    </Col>
  </Row>
</div>
  <Row>
    <table transition:fade="{{ delay: 600, duration: 800 }}">
      <tr>
        <th style="width:60%">City info</th>
        <th style="width:20%">{data.firstCity}</th>
        <th style="width:20%">{data.secondCity}</th>
      </tr>
      <tr>
        <td>Beer</td>
        <td class="price-prefix">{data.data[0].beer}</td>
        <td class="price-prefix">{data.data[1].beer}</td>
      </tr>
      <tr>
        <td>Taxi</td>
        <td class="price-prefix">{data.data[0].taxi}</td>
        <td class="price-prefix">{data.data[1].taxi}</td>
      </tr>
      <tr>
        <td>Cappuchino</td>
        <td class="price-prefix">{data.data[0].cappuchino}</td>
        <td class="price-prefix">{data.data[1].cappuchino}</td>
      </tr>
      <tr>
        <td>Lunch</td>
        <td class="price-prefix">{data.data[0].lunch}</td>
        <td class="price-prefix">{data.data[1].lunch}</td>
      </tr>
      <tr>
        <td>Gym membership</td>
        <td class="price-prefix">{data.data[0].gym_membership}</td>
        <td class="price-prefix">{data.data[1].gym_membership}</td>
      </tr>
      <tr>
        <td>Monthly public transport</td>
        <td class="price-prefix">{data.data[0].monthly_public_transport}</td>
        <td class="price-prefix">{data.data[1].monthly_public_transport}</td>
      </tr>
      <tr>
        <td>Small appt</td>
        <td class="price-prefix">{data.data[0].small_appt}</td>
        <td class="price-prefix">{data.data[1].small_appt}</td>
      </tr>
      <tr>
        <td>Medium appt</td>
        <td class="price-prefix">{data.data[0].medium_appt}</td>
        <td class="price-prefix">{data.data[1].medium_appt}</td>
      </tr>
      <tr>
        <td>Large appt</td>
        <td class="price-prefix">{data.data[0].large_appt}</td>
        <td class="price-prefix">{data.data[1].large_appt}</td>
      </tr>
      <tr>
        <td>Rent index</td>
        <td>{data.data[0].rent_index}</td>
        <td>{data.data[1].rent_index}</td>
      </tr>
    </table>
  </Row>
  <div class="is-center">
    <Button dark outline class="text-center compare" on:click={toggleCountries}>
      Compare average costs in the countries
    </Button>
  </div>
  {#if showCountries}
  <Countries {data} />
  {/if}
</div>
