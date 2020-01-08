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

        if (category !== 'country') {
          if (c0 !== null) {
            firstCountry[category] = parseFloat(c0)
            c0 = parseFloat(c0)
          }
          if (c1 !== null) {
            secondCountry[category] = parseFloat(c1)
            c1 = parseFloat(c1)
          }
        }

        if (c0 === null) {
          firstCountry[category] = 'No info'
          c0 = 'No info'
        }
        if (c1 === null) {
          secondCountry[category] = 'No info'
          c1 = 'No info'
        }

        if (category !== 'country' && typeof c0 === 'number' && typeof c1 === 'number') {
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
      { #each listDetails() as { label, country0, country1 } }
        {#if label === 'Country'}
            <tr>
              <th style="width:60%">Country Avg.</th>
              <th style="width:20%">{country0}</th>
              <th style="width:20%">{country1}</th>
          </tr>
        {:else}
        <tr>
          <td>{label}</td>
            {#if label === 'Total'}
            <td><span style="background-color:{country0 < country1 ? 'transparent' : 'lightgreen'};">{country0}</span></td>
            <td><span style="background-color:{country0 > country1 ? 'transparent' : 'lightgreen'};">{country1}</span></td>
            {:else}
            <td><span style="background-color:{country0 < country1 ? '#d1ecd1' : 'transparent'};">
            {#if label !== 'Rent index' && country0 !== 'No info'}
              $
            {/if}
            {country0}
            </span></td>
            <td><span style="background-color:{country0 > country1 ? '#d1ecd1' : 'transparent'};">
            {#if label !== 'Rent index' && country1 !== 'No info'}
              $
            {/if}
            {country1}
            </span></td>
            {/if}
        </tr>
        {/if}
      {/each}
    </table>
    {/await}
</div>
