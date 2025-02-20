//openTelemetry tracing
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor, BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';

import { Resource } from '@opentelemetry/resources';
import { propagation } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

propagation.setGlobalPropagator(new W3CTraceContextPropagator());

const OTLP_HOST = import.meta.env.OTLP_HOST || "http://localhost:4319";
const ZIPKIN_HOST = import.meta.env.ZIPKIN_HOST || "http://localhost:9411";
// Create a tracer provider for the browser
const provider = new WebTracerProvider({
    resource: new Resource({
        'service.name': 'frontend-app',
        'service.version': '1.0.0',
        'deployment.environment': import.meta.env.NODE_ENV || 'development'
    }),
});


// Configure the OTLP exporter (or you can use ConsoleSpanExporter for debugging)
const zipkinExporter = new ZipkinExporter({
    serviceName: 'frontend-app',
    url: ZIPKIN_HOST + '/api/v2/spans',
});

const otlpExporter = new OTLPTraceExporter({
    url: OTLP_HOST + '/v1/traces', // Adjust this if needed
});

// Span processor added via TracerConfig
// Add a span processor that sends spans to the exporter
provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));
provider.addSpanProcessor(new BatchSpanProcessor(zipkinExporter));

// Register the provider globally
provider.register();


// Register auto instrumentations
registerInstrumentations({
    instrumentations: [
        // Automatically instruments fetch calls
        new FetchInstrumentation({
            propagateTraceHeaderCorsUrls: [/.*/],
            // Or limit it to your backend URL (adjust the regex as needed):
            // propagateTraceHeaderCorsUrls: [/^http:\/\/localhost:4000/],
        }),
        new DocumentLoadInstrumentation(),
        new XMLHttpRequestInstrumentation(),
        new UserInteractionInstrumentation(),
    ],
});
console.log('OpenTelemetry auto instrumentation initialized in the browser');
