<script>
  import { Container, Row, Col, Button } from "svelte-chota";
  import Countries from "./Countries.svelte";

  export let data;
</script>

<style>
  :global(table) {
    max-width: 800px;
    margin: 0 auto;
  }

  :global(table tr th:last-child, table tr td:last-child) {
    text-align: right;
  }

  :global(table tr th:nth-child(2n), table tr td:nth-child(2n)) {
    text-align: right;
  }

  :global(table tr) {
    border-bottom: 1px solid #ddd;
  }

  .bold {
    font-weight: 700;
  }
</style>

<Container>
  <Row>
    <Col class="text-center">
      <p class="bold">{data.firstCity}</p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas sunt
        tempora hic quaerat provident sit velit aliquid doloribus incidunt
        numquam repudiandae earum consequatur facilis dolore maxime reiciendis
        ullam, esse sed?
      </p>
    </Col>
    <Col class="text-center">
      <p class="bold">{data.secondCity}</p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi
        doloremque inventore eum repudiandae totam sint enim provident cum
        aliquid. Ea exercitationem cumque consequatur ipsa, maxime impedit
        laudantium minima tenetur et.
      </p>
    </Col>
  </Row>
  <table>
    <tr>
      <th style="width:60%">City info</th>
      <th style="width:20%">{data.firstCity}</th>
      <th style="width:20%">{data.secondCity}</th>
    </tr>
    <tr>
      <td>Beer</td>
      <td>{data.data[0].beer}</td>
      <td>{data.data[1].beer}</td>
    </tr>
    <tr>
      <td>Taxi</td>
      <td>{data.data[0].taxi}</td>
      <td>{data.data[1].taxi}</td>
    </tr>
    <tr>
      <td>Cappuchino</td>
      <td>{data.data[0].cappuchino}</td>
      <td>{data.data[1].cappuchino}</td>
    </tr>
    <tr>
      <td>lunch</td>
      <td>{data.data[0].lunch}</td>
      <td>{data.data[1].lunch}</td>
    </tr>
    <tr>
      <td>Gym membership</td>
      <td>{data.data[0].gym_membership}</td>
      <td>{data.data[1].gym_membership}</td>
    </tr>
    <tr>
      <td>Monthly public transport</td>
      <td>{data.data[0].monthly_public_transport}</td>
      <td>{data.data[1].monthly_public_transport}</td>
    </tr>
    <tr>
      <td>Large appt</td>
      <td>{data.data[0].large_appt}</td>
      <td>{data.data[1].large_appt}</td>
    </tr>
    <tr>
      <td>Medium appt</td>
      <td>{data.data[0].medium_appt}</td>
      <td>{data.data[1].medium_appt}</td>
    </tr>
    <tr>
      <td>Small appt</td>
      <td>{data.data[0].small_appt}</td>
      <td>{data.data[1].small_appt}</td>
    </tr>
    <tr>
      <td>Rent index</td>
      <td>{data.data[0].rent_index}</td>
      <td>{data.data[1].rent_index}</td>
    </tr>
  </table>
  <Countries {data} />
</Container>
