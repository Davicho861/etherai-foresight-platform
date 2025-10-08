import { getNeo4jDriver } from './database.js';
import { publish } from './eventHub.js';

class CausalWeaver {
  constructor() {
    this.driver = null;
    this.subscriptions = new Map(); // nodeId -> Set of subscriber callbacks
    this.initializeDriver();
  }

  async initializeDriver() {
    try {
      this.driver = await getNeo4jDriver();
    } catch (error) {
      console.error('Failed to initialize Neo4j driver in CausalWeaver:', error);
    }
  }

  async createNode(nodeId, type, properties = {}) {
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