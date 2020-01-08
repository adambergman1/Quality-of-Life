<script>
  import { Button } from "svelte-chota";
  import fetchToServer from "../js/fetch.js";
  import { onDestroy } from 'svelte'
  
  export let data

  let firstCountry
  let secondCountry

  onDestroy(() => {
    window.history.back()
  })

  async function getCountryDetails () {
    const obj = {
      firstCity: data.data[0].city_id,
      secondCity: data.data[1].city_id
    }

    const result = await fetchToServer(obj, "countries")

    firstCountry = result.firstCountry
    secondCountry = result.secondCountry

    setTimeout(() => {
      location.href = "#country-comparison" 
    }, 0)
  }

    const pretty = ([char, ...chars]) => char.toUpperCase() + chars.join('').replace('_', ' ')

    const listDetails = () => {
      compare()
      return Object.keys(firstCountry)
        .filter(category => !['country'].includes(category))
        .map(category => ({
          label: pretty(category),
          country0: firstCountry[category],
          country1: secondCountry[category]
      }))
  }

    const compare = () => {
    const categories = Object.keys(firstCountry)

    categories.forEach(category => {
      let c0 = firstCountry[category]
      let c1 = secondCountry[category]

      // if (category !== 'country') {
      //   c0 = parseFloat(c0)
      //   c1 = parseFloat(c1)
      // }

      // if (category !== 'rent_index' && category !== 'country') {
      //   if (typeof c0 === 'number') firstCountry[category] = '$ ' + c0
      //   if (typeof c1 === 'number') secondCountry[category] = '$ ' + c1
      // }

      if (category !== 'country' && typeof category === 'number') {
        if (c0 < c1) {
          firstCountry.total = (firstCountry.total || 0) + 1 
        } else if (c1 < c0) {
          secondCountry.total = (secondCountry.total || 0) + 1
        }
      }
    })
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
    <table id="country-comparison">
      <tr>
        <th style="width:60%">Country Avg.</th>
        <th style="width:20%">{firstCountry.country}</th>
        <th style="width:20%">{secondCountry.country}</th>
      </tr>
      { #each listDetails() as { label, country0, country1 } }
      <tr>
        <td>{label}</td>
          {#if label === 'Total'}
          <td><span style="background-color:{country0 < country1 ? 'transparent' : 'lightgreen'};">{country0}</span></td>
          <td><span style="background-color:{country0 > country1 ? 'transparent' : 'lightgreen'};">{country1}</span></td>
          {:else}
          <td><span style="background-color:{country0 < country1 ? '#d1ecd1' : 'transparent'};">{country0}</span></td>
          <td><span style="background-color:{country0 > country1 ? '#d1ecd1' : 'transparent'};">{country1}</span></td>
          {/if}
      </tr>
      {/each}
    </table>
    {/await}
</div>
