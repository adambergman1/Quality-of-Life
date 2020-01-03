<script>
  import "chota";
  import Selection from "./components/Selection.svelte";
  import Results from "./components/Results.svelte";

  let showResult = false;
  let data;

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
</style>

<main>
  <h1 class="title is-center">Quality of life</h1>
  <div class="container bg-light">
    <Selection on:cityData={cityData} />
    {#if showResult}
      <Results {data} />
    {/if}
  </div>
</main>
