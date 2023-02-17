import axios from 'axios';
import express from 'express';
import { createAxiosPrometheusMiddleware } from '../lib/AxiosPrometheusAdapter';
import { collectDefaultMetrics, Registry } from 'prom-client';

const registry = new Registry();
collectDefaultMetrics({ register: registry });
createAxiosPrometheusMiddleware(axios, registry);

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  await axios('https://jsonplaceholder.typicode.com/posts/1');
  await axios('https://jsonplaceholder.typicode.com/posts/2');
  res.sendStatus(200);
});

app.get('/metrics', async (req, res) => {
  const metrics = await registry.metrics();
  res.send(metrics);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
