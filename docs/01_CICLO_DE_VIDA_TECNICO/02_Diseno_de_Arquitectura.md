# Diseño de Arquitectura (C4 / Mermaid)

## Visión general
Este documento describe la arquitectura técnica de Praevisio AI usando el modelo C4 y diagramas en Mermaid para facilitar su inclusión en Markdown.

## Diagrama de contexto (Nivel 1)
```mermaid
C4Context
    title Praevisio AI - Context Diagram
    Person(admin, "Administrador/Operador", "Gestiona agentes y configura integraciones")
    Person(user, "Analista de Riesgos", "Consume alertas y dashboards")
    System(backend, "Backend Praevisio", "Orquesta agentes, APIs, lógica de negocio")
    System_Ext(dataSources, "Fuentes de datos externas", "Clima, satélite, IoT, terceros")
    System_Ext(embeddings, "Vector DB", "Pinecone/Milvus para retrieval")

    Rel(admin, backend, "configura y monitorea")
    Rel(user, backend, "consume alertas y dashboards")
    Rel(backend, dataSources, "ingesta/consulta")
    Rel(backend, embeddings, "almacena embeddings y recupera")
```

## Diagrama de contenedores (Nivel 2)
```mermaid
C4Container
    title Praevisio AI - Containers
    System_Boundary(s1, "Praevisio AI") {
        Container(web, "Frontend (React + Vite)", "JS", "Interfaz de usuario")
        Container(api, "API (Node.js + Express)", "Node.js", "Exposición de endpoints y orquestación")
        Container(agents, "Motor de Agentes (crewAI)", "Node.js/TS", "Lógica de agentes y workflows")
        Container(db, "Postgres + Prisma", "Postgres", "Almacenamiento transaccional")
        Container(vector, "Vector DB", "Pinecone/Milvus", "Búsqueda semántica/embeddings")
    }
    Rel(web, api, "HTTP/HTTPS")
    Rel(api, agents, "gRPC/HTTP internal")
    Rel(agents, db, "Reads/Writes")
    Rel(agents, vector, "Embeddings store")
```

## Diseño de API
- /api/alerts [GET, POST]
- /api/agents [GET, PATCH]
- /api/ingest [POST]

## Esquema de base de datos (resumen)
- tablas: users, agents, alerts, events, embeddings
- relaciones: alerts -> agents, events -> sources

---

*Documento generado por Praevisio-Atlas-Codify*