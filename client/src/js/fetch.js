
export default async function sendToServer(obj, path) {
  const response = await fetch(`http://localhost:4000/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
  });

  const json = await response.json()

  return json
}