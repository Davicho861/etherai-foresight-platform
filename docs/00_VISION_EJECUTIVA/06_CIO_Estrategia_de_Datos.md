# CIO - Estrategia de Datos

## Fuentes de datos
- Datos públicos (clima, satélite, inventarios, sensores IoT).
- Integraciones privadas (telemetría, ERP, sistemas de control).
- Datos derivados y generados por agentes (metadatos, señales de confianza).

## Gobernanza y ética
- Políticas de acceso y clasificación de datos.
- Data contracts para integraciones con terceros.
- Evaluaciones de sesgo y auditorías de modelos.

## Arquitectura de datos
- Ingesta: pipelines ETL/ELT con validación y enriquecimiento.
- Almacenamiento: data lake + base relacional para metadatos (Prisma/Postgres).
- Embeddings y vector DB para retrieval (Pinecone, Milvus o alternativa open-source).

## Soberanía y cumplimiento
- Cumplimiento regional (GDPR, LGPD, regulaciones locales).
- Opciones de despliegue on-premise o VPC para clientes con requisitos de soberanía.

---

*Documento generado por Praevisio-Atlas-Codify*