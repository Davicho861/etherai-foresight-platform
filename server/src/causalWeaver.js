import { getNeo4jDriver } from './database.js';
import { publish } from './eventHub.js';

class CausalWeaver {
  constructor() {
    this.driver = null;
    this.subscriptions = new Map(); // nodeId -> Set of subscriber callbacks
    this.initializeDriver();
    // In native dev mode, maintain a lightweight in-memory graph as a fallback
    if (process.env.NATIVE_DEV_MODE === 'true') {
      this._nativeNodes = new Map(); // id -> properties
      this._nativeEdges = new Map(); // id -> Set of {to, type, props}
    }
  }

  async initializeDriver() {
    try {
      this.driver = await getNeo4jDriver();
    } catch (error) {
      console.error('Failed to initialize Neo4j driver in CausalWeaver:', error);
    }
  }

  async createNode(nodeId, type, properties = {}) {
    if (process.env.NATIVE_DEV_MODE === 'true') {
      const props = { id: nodeId, type, ...properties, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      this._nativeNodes.set(nodeId, props);
      console.log(`[CausalWeaver][native]: Nodo creado/actualizado: ${nodeId}`);
      await this.notifyDependents(nodeId, 'created');
      return props;
    }
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MERGE (n:CausalNode {id: $id})
         SET n += $props, n.type = $type, n.createdAt = datetime(), n.updatedAt = datetime()
         RETURN n`,
        { id: nodeId, type, props: properties }
      );
      console.log(`[CausalWeaver]: Nodo creado/actualizado: ${nodeId}`);
      await this.notifyDependents(nodeId, 'created');
      return result.records[0].get('n').properties;
    } finally {
      await session.close();
    }
  }

  async updateNode(nodeId, properties = {}) {
    if (process.env.NATIVE_DEV_MODE === 'true') {
      const existing = this._nativeNodes.get(nodeId);
      if (!existing) return null;
      const updated = { ...existing, ...properties, updatedAt: new Date().toISOString() };
      this._nativeNodes.set(nodeId, updated);
      console.log(`[CausalWeaver][native]: Nodo actualizado: ${nodeId}`);
      await this.notifyDependents(nodeId, 'updated');
      return updated;
    }
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (n:CausalNode {id: $id})
         SET n += $props, n.updatedAt = datetime()
         RETURN n`,
        { id: nodeId, props: properties }
      );
      if (result.records.length > 0) {
        console.log(`[CausalWeaver]: Nodo actualizado: ${nodeId}`);
        await this.notifyDependents(nodeId, 'updated');
        return result.records[0].get('n').properties;
      }
      return null;
    } finally {
      await session.close();
    }
  }

  async createRelationship(fromId, toId, relationshipType, properties = {}) {
    if (process.env.NATIVE_DEV_MODE === 'true') {
      if (!this._nativeEdges.has(fromId)) this._nativeEdges.set(fromId, new Set());
      this._nativeEdges.get(fromId).add(JSON.stringify({ to: toId, type: relationshipType, props: properties, createdAt: new Date().toISOString() }));
      console.log(`[CausalWeaver][native]: Relación creada: ${fromId} -[${relationshipType}]-> ${toId}`);
      await this.notifyDependents(fromId, 'relationship_created');
      await this.notifyDependents(toId, 'relationship_created');
      return;
    }
    const session = this.driver.session();
    try {
      await session.run(
        `MATCH (a:CausalNode {id: $fromId}), (b:CausalNode {id: $toId})
         MERGE (a)-[r:${relationshipType}]->(b)
         SET r += $props, r.createdAt = datetime()
         RETURN r`,
        { fromId, toId, props: properties }
      );
      console.log(`[CausalWeaver]: Relación creada: ${fromId} -[${relationshipType}]-> ${toId}`);
      await this.notifyDependents(fromId, 'relationship_created');
      await this.notifyDependents(toId, 'relationship_created');
    } finally {
      await session.close();
    }
  }

  async getDependents(nodeId) {
    if (process.env.NATIVE_DEV_MODE === 'true') {
      const ids = [];
      for (const [from, set] of this._nativeEdges.entries()) {
        for (const edgeStr of set) {
          const edge = JSON.parse(edgeStr);
          if (edge.to === nodeId) ids.push(from);
        }
      }
      return ids;
    }
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (n:CausalNode {id: $id})<-[:DEPENDS_ON]-(dependent:CausalNode)
         RETURN dependent.id as id`,
        { id: nodeId }
      );
      return result.records.map(record => record.get('id'));
    } finally {
      await session.close();
    }
  }

  async notifyDependents(nodeId, eventType) {
    const dependents = await this.getDependents(nodeId);
    for (const dependentId of dependents) {
      publish(dependentId, {
        type: 'causal_update',
        sourceNode: nodeId,
        event: eventType,
        timestamp: new Date().toISOString()
      });
    }
  }

  subscribeToNode(nodeId, callback) {
    if (!this.subscriptions.has(nodeId)) {
      this.subscriptions.set(nodeId, new Set());
    }
    this.subscriptions.get(nodeId).add(callback);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(nodeId);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscriptions.delete(nodeId);
        }
      }
    };
  }

  async getCausalChain(nodeId, depth = 3) {
    if (process.env.NATIVE_DEV_MODE === 'true') {
      // Simple local traversal: return arrays of node ids up to depth
      const visited = new Set();
      const paths = [];
      const dfs = (current, d, path) => {
        if (d > depth) return;
        visited.add(current);
        const edges = this._nativeEdges.get(current) || new Set();
        for (const edgeStr of edges) {
          const edge = JSON.parse(edgeStr);
          const newPath = [...path, { from: current, to: edge.to, type: edge.type }];
          paths.push(newPath);
          dfs(edge.to, d + 1, newPath);
        }
      };
      dfs(nodeId, 1, []);
      return paths;
    }
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH path = (start:CausalNode {id: $id})-[*1..${depth}]-(connected:CausalNode)
         RETURN path`,
        { id: nodeId }
      );
      return result.records.map(record => record.get('path'));
    } finally {
      await session.close();
    }
  }

  async getSubgraph(nodeId, depth = 2) {
    if (process.env.NATIVE_DEV_MODE === 'true') {
      // Return a minimal subgraph: nodes and edges reachable within depth
      const nodes = new Set();
      const edges = [];
      const bfs = [[nodeId, 0]];
      while (bfs.length) {
        const [cur, d] = bfs.shift();
        if (d > depth) continue;
        nodes.add(cur);
        const outs = this._nativeEdges.get(cur) || new Set();
        for (const edgeStr of outs) {
          const edge = JSON.parse(edgeStr);
          edges.push(edge);
          if (!nodes.has(edge.to)) bfs.push([edge.to, d + 1]);
        }
      }
      return { nodes: Array.from(nodes), edges };
    }
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (n:CausalNode {id: $id}), p = (n)-[*0..${depth}]-(m)
         RETURN p`,
        { id: nodeId }
      );
      return result.records.map(record => record.get('p'));
    } finally {
      await session.close();
    }
  }
}

const causalWeaver = new CausalWeaver();

export { CausalWeaver, causalWeaver };
export default causalWeaver;