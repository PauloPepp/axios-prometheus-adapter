# Axios Prometheus Adapter

## Install 
It requires `prom-client` library to be installed.
```
npm i axios-prometheus-adapter

yarn add axios-prometheus-adapter
```

## Usage
### Set up your code
You can use it with default metrics, or with custom metrics as well.

Here is an example, how to use it with default metrics, and with the global axios instance:
```ts
import axios from 'axios';
import { createAxiosPrometheusMiddleware } from 'axios-prometheus-adapter';
import { collectDefaultMetrics, Registry } from 'prom-client';

const registry = new Registry();
collectDefaultMetrics({ register: registry });
createAxiosPrometheusMiddleware(axios, registry);
```

This library does not depend on any framework like express, of fastify.

Here is an example, how to use it with express:
```ts
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
```

### Output
Calling the `/` endpoint first will trigger two API calls, and return with a status code 200. To collect metrics of api calls
require to have api calls first.
```sh
curl http://0.0.0.0/
```

After this first call we can call the `/metrics` endpoint to get some metics data:
```sh
curl http://0.0.0.0/metrics
```
Output:
```
[[[DEFAULT NODE METRICS]]]
...
# HELP http_client_requests_seconds_count http_client_requests_seconds_count
# TYPE http_client_requests_seconds_count histogram
http_client_requests_seconds_count_bucket{le="0.005",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 0
http_client_requests_seconds_count_bucket{le="0.01",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 0
http_client_requests_seconds_count_bucket{le="0.025",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 0
http_client_requests_seconds_count_bucket{le="0.05",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 0
http_client_requests_seconds_count_bucket{le="0.1",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 0
http_client_requests_seconds_count_bucket{le="0.25",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 0
http_client_requests_seconds_count_bucket{le="0.5",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 1
http_client_requests_seconds_count_bucket{le="1",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 1
http_client_requests_seconds_count_bucket{le="2.5",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 1
http_client_requests_seconds_count_bucket{le="5",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 1
http_client_requests_seconds_count_bucket{le="10",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 1
http_client_requests_seconds_count_bucket{le="+Inf",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 1
http_client_requests_seconds_count_sum{status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 0.257366432
http_client_requests_seconds_count_count{status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/1"} 1
http_client_requests_seconds_count_bucket{le="0.005",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 0
http_client_requests_seconds_count_bucket{le="0.01",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 0
http_client_requests_seconds_count_bucket{le="0.025",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 0
http_client_requests_seconds_count_bucket{le="0.05",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 0
http_client_requests_seconds_count_bucket{le="0.1",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 0
http_client_requests_seconds_count_bucket{le="0.25",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 1
http_client_requests_seconds_count_bucket{le="0.5",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 1
http_client_requests_seconds_count_bucket{le="1",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 1
http_client_requests_seconds_count_bucket{le="2.5",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 1
http_client_requests_seconds_count_bucket{le="5",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 1
http_client_requests_seconds_count_bucket{le="10",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 1
http_client_requests_seconds_count_bucket{le="+Inf",status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 1
http_client_requests_seconds_count_sum{status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 0.107517055
http_client_requests_seconds_count_count{status_code="200",method="GET",protocol="https:",host="jsonplaceholder.typicode.com",path="/posts/2"} 1
```

### Custom config
You can overwrite the name, the help and the labels property of this metrics by providing an optional third argument of the
`createAxiosPrometheusMiddleware` function.
```ts
createAxiosPrometheusMiddleware(axios, registry, {
  name: 'your_custom_metric_name',
  help: 'your costum help description',
  labelNames: ['status_code', 'method']
});
```

Here is the type of the config object:
```ts
export type AxiosPrometheusAdapterConfig = {
  name: string,
  help: string,
  labelNames: string[]
};
```

`labelNames` is an array with predefined values. By default we support the following labels:
`['status_code', 'method', 'protocol', 'host', 'path']`