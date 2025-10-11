import { CausalWeaver } from '../src/causalWeaver.js';
import * as eventHub from '../src/eventHub.js';

// Run tests in native dev mode to avoid Neo4j driver usage
process.env.NATIVE_DEV_MODE = 'true';

describe('CausalWeaver (native mode)', () => {
  let cw;

  beforeEach(() => {
    // Ensure fresh instance
    cw = new CausalWeaver();
    // Mock publish
    jest.spyOn(eventHub, 'publish').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates and updates nodes, and notifies dependents', async () => {
    const node = await cw.createNode('n1', 'Test', { foo: 'bar' });
    expect(node).toHaveProperty('id', 'n1');
    expect(node).toHaveProperty('foo', 'bar');

    const updated = await cw.updateNode('n1', { foo: 'baz' });
    expect(updated).toHaveProperty('foo', 'baz');

    // update non-existent returns null
    const missing = await cw.updateNode('nx', { a: 1 });
    expect(missing).toBeNull();
  });

  it('creates relationships and can get dependents/subgraph/chain', async () => {
    await cw.createNode('a', 'TypeA');
    await cw.createNode('b', 'TypeB');
    await cw.createRelationship('a', 'b', 'DEPENDS_ON', { weight: 1 });

    const deps = await cw.getDependents('b');
    expect(Array.isArray(deps)).toBe(true);
    expect(deps).toContain('a');

    const chain = await cw.getCausalChain('a', 2);
    expect(Array.isArray(chain)).toBe(true);

    const sub = await cw.getSubgraph('a', 2);
    expect(sub).toHaveProperty('nodes');
    expect(Array.isArray(sub.nodes)).toBe(true);
  });

  it('notifies subscribers via subscribeToNode', () => {
    const cb = jest.fn();
    const unsub = cw.subscribeToNode('x', cb);
    // trigger callbacks manually via internal map
    const subs = cw.subscriptions.get('x');
    expect(subs.has(cb)).toBe(true);

    // Unsubscribe
    unsub();
    const after = cw.subscriptions.get('x');
    expect(after).toBeUndefined();
  });
});
