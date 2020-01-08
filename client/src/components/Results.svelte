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

  const toggleCountries = () => {
    showCountriesStore.update(value => {
      return value = !value
    })
  }

  const pretty = ([char, ...chars]) => char.toUpperCase() + chars.join('').replace('_', ' ') 

  const listDetails = () => {
    return Object.keys(data.data[0])
      .filter(category => !['cost_id', 'city', 'city_id', 'information'].includes(category))
      .map(category => ({
        label: pretty(category),
        city0: data.data[0][category],
        city1: data.data[1][category]
      }))
  }

  const compare = () => {
    const categories = Object.keys(data.data[0])

    categories.forEach(category => {
      const c0 = data.data[0][category]
      const c1 = data.data[1][category]

      if (category !== 'rent_index' && category !== 'city_id') {
        if (typeof c0 === 'number') data.data[0][category] = '$ ' + c0
        if (typeof c1 === 'number') data.data[1][category] = '$ ' + c1
      }

      if (category !== 'city_id' && category !== 'information' 
      && category !== 'cost_id' && category !== 'city' 
      && typeof c0 === 'number' && typeof c1 === 'number') {
        if (c0 < c1) {
          data.data[0].total = (data.data[0].total || 0) + 1 
        } else if (c1 < c0) {
          data.data[1].total = (data.data[1].total || 0) + 1
        }
      }
    })
  }
  
  compare()
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
      <p class="bold">{data.firstCity}</p>
      <p>{data.firstCity === data.data[0].city ? data.data[0].information : data.data[1].information}</p>
    </Col>
    <Col class="text-center">
      <p class="bold">{data.secondCity}</p>
      <p>{data.secondCity === data.data[1].city ? data.data[1].information : data.data[0].information}</p>
    </Col>
  </Row>
</div>
  <Row>
    <table id="city-results" transition:fade="{{ delay: 600, duration: 800 }}">
      <tr>
        <th style="width:60%">City info</th>
        <th style="width:20%">{data.firstCity}</th>
        <th style="width:20%">{data.secondCity}</th>
      </tr>
      { #each listDetails() as { label, city0, city1 } }
        <tr>
          <td>{label}</td>
          {#if label === 'Total'}
          <td><span style="background-color:{city0 < city1 ? 'transparent' : 'lightgreen'};">{city0}</span></td>
          <td><span style="background-color:{city0 > city1 ? 'transparent' : 'lightgreen'};">{city1}</span></td>
          {:else}
          <td><span style="background-color:{city0 < city1 ? '#d1ecd1' : 'transparent'};">{city0}</span></td>
          <td><span style="background-color:{city0 > city1 ? '#d1ecd1' : 'transparent'};">{city1}</span></td>
          {/if}
        </tr>
      {/each}
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
