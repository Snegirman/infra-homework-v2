import express from "express";
import client from "prom-client";

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const histogram = new client.Histogram({
  name: 'api_request',
  help: 'request time',
  buckets: [0.5, 1, 1.5, 2]
})

register.registerMetric(histogram);

async function apiRequest() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
  return response.json();
}

app.get("/", async (req, res) => {
  const timerEnd = histogram.startTimer();
  const data = await apiRequest();
  timerEnd();
  res.send(`Pokemon is ${data.species.name}`);
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

const appMetrics = express();

appMetrics.listen(8000, () => {
  console.log(`Metrics server started on http://localhost:8000`);
});

appMetrics.get("/json", async (req, res) => {
  res.json(await register.getMetricsAsJSON());
});

appMetrics.get("/metrics", async (req, res) => {
  const text = await register.metrics();
  res.set('Content-Type', register.contentType);
  res.send(text);
});
