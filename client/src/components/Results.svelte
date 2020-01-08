<script>
  import { Container, Row, Col, Button, Card } from "svelte-chota";
  import Countries from "./Countries.svelte";
  import { showCountriesStore } from '../js/store.js'
  import { fly, fade } from 'svelte/transition'
  import { afterUpdate } from 'svelte'

  export let data
  let details = listDetails()

  afterUpdate(() => {
    details = listDetails()  
  })

  let showCountries = false

  showCountriesStore.subscribe(value => {
    showCountries = value
  })
  
  function toggleCountries () {
    showCountriesStore.update(value => {
      return value = !value
  })
  }

  function pretty ([char, ...chars]) {
    return char.toUpperCase() + chars.join('').replace(/_/g, ' ') 
  }

  function listDetails () {
    compare()
    return Object.keys(data.data[0])
      .filter(category => !['cost_id', 'city_id', 'information'].includes(category))
      .map(category => ({
        label: pretty(category),
        city0: data.data[0][category],
        city1: data.data[1][category]
      }))
  }

  function compare () {
    const categories = Object.keys(data.data[0])

    data.data[0].total=0
    data.data[1].total=0

    categories.forEach(category => {
      const c0 = data.data[0][category]
      const c1 = data.data[1][category]

      if (c0 === null) {
        data.data[0][category] = 'No info'
      }
      
      if (c1 === null) {
        data.data[1][category] = 'No info'
      }

      if (category !== 'city_id' && category !== 'information' && category !== 'total' 
      && category !== 'cost_id' && category !== 'city' 
      && typeof c0 === 'number' && typeof c1 === 'number') {
        if (c0 < c1) {
          data.data[0].total++
        } else if (c1 < c0) {
          data.data[1].total++
        }
      }
    })
  }

</script>

<style>
  .bold {
    font-weight: 700;
  }

  .container {
    padding-bottom: 60px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }
</style>


<div id="city-comparison" class="container">
<div class="cities-information" transition:fly="{{ y: 50, duration: 800 }}">
    <Row>
    <Col class="text-center">
      <p class="bold">{data.data[0].city}</p>
      <p>{data.data[0].information}</p>
    </Col>
    <Col class="text-center">
      <p class="bold">{data.data[1].city}</p>
      <p>{data.data[1].information}</p>
    </Col>
  </Row>
</div>
  <Row>
    <table id="city-results" transition:fade="{{ delay: 600, duration: 800 }}">
      { #each details as { label, city0, city1 } }
        {#if label === 'City'}
          <tr>
            <th style="width:60%">City info</th>
            <th style="width:20%">{city0}</th>
            <th style="width:20%">{city1}</th>
          </tr>
          {:else}
        <tr>
          <td>{label}</td>
          {#if label === 'Total'}
          <td><span style="background-color:{city0 < city1 ? 'transparent' : 'lightgreen'};">{city0}</span></td>
          <td><span style="background-color:{city0 > city1 ? 'transparent' : 'lightgreen'};">{city1}</span></td>
          {:else}
          <td><span style="background-color:{city0 < city1 ? '#d1ecd1' : 'transparent'};">
            {#if label !== 'Rent index' && city0 !== 'No info'}
              $
            {/if}
            {city0}
          </span></td>
          <td><span style="background-color:{city0 > city1 ? '#d1ecd1' : 'transparent'};">
            {#if label !== 'Rent index' && city1 !== 'No info'}
              $
            {/if}
            {city1}
          </span></td>
          {/if}
        </tr>
        {/if}
      {/each}
    </table>
  </Row>
  <div class="is-center">
    <Button dark class="text-center compare" on:click={toggleCountries}>
      Compare average costs in the countries
    </Button>
  </div>
  {#if showCountries}
  <Countries {data} />
  {/if}
</div>