<script>
  import { Button } from "svelte-chota";
  import { onMount } from "svelte";

  let cities = [];

  onMount(async () => {
    const response = await fetch("http://localhost:4000");
    const json = await response.json();
    cities = json.map(res => res);
  });

  let firstSelected
  let secondSelected
  let errorMessage


  async function compareCities () {
    if (firstSelected && secondSelected) {
      // console.log(firstSelected.city_id, secondSelected.city_id)
      const obj = {
        first: firstSelected.city_id,
        second: secondSelected.city_id
      }

      const response = await fetch('http://localhost:4000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      })

      const json = await response.json()
      console.log(json)

    } else {
      errorMessage = 'Please choose cities to compare'
    }
  }
</script>

<div class="row">
  <div class="col-12">
    <p class="is-center">Choose country to compare</p>
  </div>
  <div class="col">
    <select bind:value={firstSelected} required>
    <option disabled value=''>Choose city</option>
      {#each cities as obj}
        <option value={obj}>{obj.city}</option>
      {/each}
    </select>
  </div>
  <div class="col">
    <select bind:value={secondSelected} required>
    <option disabled value=''>Choose city</option>
      {#each cities as obj}
        <option value={obj}>{obj.city}</option>
      {/each}
    </select>
  </div>
</div>
<p>{errorMessage ? errorMessage : ''}</p>
<div class="is-center">
  <Button on:click={compareCities} class="bg-primary text-white">Compare Cities</Button>
</div>
