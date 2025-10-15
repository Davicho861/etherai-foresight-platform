## Architecture Overview

```mermaid
graph LR
  subgraph Frontend
    FE[WebApp / Dashboard / SDLC Dashboard]
  end
  subgraph Backend
    API[API Server]
    AUTH[Auth Service]
    WORKERS[Background Workers]
  end
  subgraph Data
    PG[(PostgreSQL)]
    NEO4J[(Neo4j)]
    REDIS[(Redis)]
  end

  FE -->|REST/GraphQL| API
  API --> PG
  API --> NEO4J
  API --> REDIS
  WORKERS --> PG
  WORKERS --> NEO4J
  AUTH --> API

  external_api[External Services]
  API --> external_api

  classDef infra fill:#f9fafb,stroke:#e5e7eb;
  class API,PG,NEO4J,REDIS infra;
```

Descripción:

- Frontend (WebApp + SDLC Dashboard) se comunica con el API central.
- El API coordina persistencia relacional (Postgres), grafos (Neo4j) y cache (Redis).
- Background workers realizan ingesta y backfilling.
