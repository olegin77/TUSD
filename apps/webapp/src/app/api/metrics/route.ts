import { NextResponse } from "next/server";

// Simple in-memory metrics storage
let requestCount = 0;
const startTime = Date.now();

// Increment request counter on each call
export async function GET() {
  requestCount++;

  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage();

  // Prometheus text format
  const metrics = `# HELP tusd_webapp_requests_total Total number of requests to webapp
# TYPE tusd_webapp_requests_total counter
tusd_webapp_requests_total ${requestCount}

# HELP tusd_webapp_uptime_seconds Webapp uptime in seconds
# TYPE tusd_webapp_uptime_seconds gauge
tusd_webapp_uptime_seconds ${uptimeSeconds}

# HELP tusd_webapp_memory_heap_bytes Heap memory used by webapp
# TYPE tusd_webapp_memory_heap_bytes gauge
tusd_webapp_memory_heap_bytes ${memoryUsage.heapUsed}

# HELP tusd_webapp_memory_heap_total_bytes Total heap memory available
# TYPE tusd_webapp_memory_heap_total_bytes gauge
tusd_webapp_memory_heap_total_bytes ${memoryUsage.heapTotal}

# HELP tusd_webapp_memory_rss_bytes Resident set size memory
# TYPE tusd_webapp_memory_rss_bytes gauge
tusd_webapp_memory_rss_bytes ${memoryUsage.rss}

# HELP tusd_webapp_info Webapp information
# TYPE tusd_webapp_info gauge
tusd_webapp_info{version="1.0.0",framework="nextjs"} 1
`;

  return new NextResponse(metrics, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
