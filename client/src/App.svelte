<script>
  import "chota";
  import Selection from "./components/Selection.svelte";
  import Results from "./components/Results.svelte";
  import { fly, scale } from 'svelte/transition'

  let showResult = false;
  let data;
  let showCountries = false

  function cityData(event) {
    data = event.detail;
    showResult = true;
  }
</script>

<style>
  @import url(chota.css);

  .title {
    font-family: "Lilita One", cursive;
    text-align: center;
    color: orange;
    font-size: 50px;
    text-shadow: 2px 5px black;
  }

  .main-area {
    min-height: 80vh;
  }
</style>

<main>
  <h1 transition:scale="{{ duration: 800 }}" class="title is-center">Quality of life</h1>
  <div class="main-area" id="main-area">
    <div transition:fly="{{ y: 100, duration: 1000 }}" class="container bg-light">
      <Selection on:cityData={cityData} />
      {#if showResult}
        <Results {data} {showCountries} />
      {/if}
    </div>
  </div>
</main>
