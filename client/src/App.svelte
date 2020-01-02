<script>
  import "chota";
  import Selection from "./Selection.svelte";
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
    <Selection />
  </div>
</main>
