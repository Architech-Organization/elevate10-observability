const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
// import { trace } from '@opentelemetry/api';
// const tracer = trace.getTracer('default');
// import tracer from 'dd-trace';
// tracer.init({
//   service: 'frontend-app',
//   hostname: 'datadog-agent',
//   port: 8126,
//   env: 'dev',
//   logInjection: true,
//   analytics: true,
//   runtimeMetrics: true,
//   enabled: true,
//   profiling: true,
//   appsec: true,
//   tags: {
//     'env': 'dev',
//     'service': 'frontend-app'
//   }
// });

export const getEvents = async () => {
  //const span = tracer.startSpan('getEvents');
  const resp = await fetch(`${baseUrl}/events`);
  const data = await resp.json();
  //span.finish();
  return data;
};

export const createEvent = async (eventData) => {
  const resp = await fetch(`${baseUrl}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventData }),
  });
  const data = await resp.json();
  return data;
};

export const deleteEvent = async (id) => {
  const resp = await fetch(`${baseUrl}/events`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const data = await resp.json();
  return data;
};
