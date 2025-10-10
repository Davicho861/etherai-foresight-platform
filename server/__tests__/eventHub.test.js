import { jest } from '@jest/globals';
import { subscribe, subscribeAll, publish } from '../src/eventHub.js';

describe('eventHub', () => {
  let mockCallback;

  beforeEach(() => {
    mockCallback = jest.fn();
  });

  afterEach(() => {
    // Clear all subscribers after each test
    // Since the module uses global state, we need to be careful
  });

  describe('subscribe and publish', () => {
    it('should call subscriber for specific mission', () => {
      const unsubscribe = subscribe('mission1', mockCallback);
      publish('mission1', { type: 'start' });
      expect(mockCallback).toHaveBeenCalledWith({ type: 'start' });
      unsubscribe();
    });

    it('should not call subscriber for different mission', () => {
      const unsubscribe = subscribe('mission1', mockCallback);
      publish('mission2', { type: 'start' });
      expect(mockCallback).not.toHaveBeenCalled();
      unsubscribe();
    });

    it('should allow multiple subscribers for same mission', () => {
      const mockCallback2 = jest.fn();
      const unsubscribe1 = subscribe('mission1', mockCallback);
      const unsubscribe2 = subscribe('mission1', mockCallback2);
      publish('mission1', { type: 'start' });
      expect(mockCallback).toHaveBeenCalledWith({ type: 'start' });
      expect(mockCallback2).toHaveBeenCalledWith({ type: 'start' });
      unsubscribe1();
      unsubscribe2();
    });

    it('should remove subscriber when unsubscribed', () => {
      const unsubscribe = subscribe('mission1', mockCallback);
      unsubscribe();
      publish('mission1', { type: 'start' });
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('subscribeAll and publish', () => {
    it('should call global subscriber for any mission', () => {
      const unsubscribe = subscribeAll(mockCallback);
      publish('mission1', { type: 'start' });
      expect(mockCallback).toHaveBeenCalledWith({ missionId: 'mission1', type: 'start' });
      unsubscribe();
    });

    it('should call global subscriber with missionId prefixed', () => {
      const unsubscribe = subscribeAll(mockCallback);
      publish('mission2', { type: 'end', data: 'test' });
      expect(mockCallback).toHaveBeenCalledWith({ missionId: 'mission2', type: 'end', data: 'test' });
      unsubscribe();
    });

    it('should allow multiple global subscribers', () => {
      const mockCallback2 = jest.fn();
      const unsubscribe1 = subscribeAll(mockCallback);
      const unsubscribe2 = subscribeAll(mockCallback2);
      publish('mission1', { type: 'start' });
      expect(mockCallback).toHaveBeenCalledWith({ missionId: 'mission1', type: 'start' });
      expect(mockCallback2).toHaveBeenCalledWith({ missionId: 'mission1', type: 'start' });
      unsubscribe1();
      unsubscribe2();
    });
  });

  describe('error handling', () => {
    it('should continue calling other subscribers if one throws', () => {
      const errorCallback = jest.fn(() => { throw new Error('test error'); });
      const goodCallback = jest.fn();
      const unsubscribe1 = subscribe('mission1', errorCallback);
      const unsubscribe2 = subscribe('mission1', goodCallback);
      publish('mission1', { type: 'start' });
      expect(errorCallback).toHaveBeenCalled();
      expect(goodCallback).toHaveBeenCalled();
      unsubscribe1();
      unsubscribe2();
    });

    it('should continue calling global subscribers if one throws', () => {
      const errorCallback = jest.fn(() => { throw new Error('test error'); });
      const goodCallback = jest.fn();
      const unsubscribe1 = subscribeAll(errorCallback);
      const unsubscribe2 = subscribeAll(goodCallback);
      publish('mission1', { type: 'start' });
      expect(errorCallback).toHaveBeenCalled();
      expect(goodCallback).toHaveBeenCalled();
      unsubscribe1();
      unsubscribe2();
    });
  });

  describe('cleanup', () => {
    it('should clean up mission subscribers when all unsubscribe', () => {
      const unsubscribe1 = subscribe('mission1', mockCallback);
      const unsubscribe2 = subscribe('mission1', jest.fn());
      unsubscribe1();
      unsubscribe2();
      // Should clean up the mission entry
      publish('mission1', { type: 'start' });
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
});