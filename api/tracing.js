// backend tracing.js using OpenTelemetry
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis-4';
import { MySQL2Instrumentation } from '@opentelemetry/instrumentation-mysql2';
import { Resource } from '@opentelemetry/resources';
// import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

//Initialize the tracer provider with an explicit resource

const provider = new NodeTracerProvider({
    resource: new Resource({
        'service.name': 'api-service'
    }),
    spanProcessors: [new SimpleSpanProcessor(zipkinExporter)],
});

provider.register();

//Configure the exporter
const zipkinExporter = new ZipkinExporter({
    serviceName: 'api-service', 
    url: 'http://localhost:9411/api/v2/spans', // Zipkin's API endpoint
});


const redisInstrumentation = new RedisInstrumentation({
    // Add Redis-specific configuration
    responseHook: (span) => {
        span.setAttribute('service.name', 'redis-service'); // Set Redis service name
    },
});

// MySQL instrumentation with a custom service name
const mysqlInstrumentation = new MySQL2Instrumentation({
    enhancedDatabaseReporting: true,
    responseHook: (span) => {
        span.setAttribute('service.name', 'mysql-service'); // Set MySQL service name
    },
});

// Register instrumentations after provider is registered
registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation(),     
        new ExpressInstrumentation(),
        redisInstrumentation,
        mysqlInstrumentation,
    ],
});

console.log('Backend tracing initialized.');
