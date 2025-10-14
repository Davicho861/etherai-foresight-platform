import { renderHook, act } from '@testing-library/react';
import { useServiceWorker } from '../../hooks/useServiceWorker';

// Mock navigator.serviceWorker
const mockServiceWorker = {
  register: jest.fn(),
  ready: jest.fn(),
  addEventListener: jest.fn(),
  controller: null,
};

Object.defineProperty(navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true,
});

describe('useServiceWorker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset service worker support
    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useServiceWorker());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.isRegistered).toBe(false);
    expect(result.current.isUpdating).toBe(false);
    expect(result.current.updateAvailable).toBe(false);
  });

  it('should register service worker successfully', async () => {
    const mockRegistration = {
      addEventListener: jest.fn(),
    };

    mockServiceWorker.register.mockResolvedValue(mockRegistration);

    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      // Wait for useEffect to run
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js');
    expect(result.current.isRegistered).toBe(true);
  });

  it('should handle service worker registration failure', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    mockServiceWorker.register.mockRejectedValue(new Error('Registration failed'));

    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[SW] Service worker registration failed:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle update found event', async () => {
    const mockRegistration = {
      addEventListener: jest.fn(),
      installing: {
        addEventListener: jest.fn(),
        state: 'installing',
      },
    };

    mockServiceWorker.register.mockResolvedValue(mockRegistration);

    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Trigger updatefound event
    const updateFoundCallback = mockRegistration.addEventListener.mock.calls.find(
      call => call[0] === 'updatefound'
    )[1];

    act(() => {
      updateFoundCallback();
    });

    expect(result.current.isUpdating).toBe(true);

    // Simulate worker state change to installed
    const stateChangeCallback = mockRegistration.installing.addEventListener.mock.calls.find(
      call => call[0] === 'statechange'
    )[1];

    act(() => {
      stateChangeCallback();
    });

    expect(result.current.updateAvailable).toBe(true);
    expect(result.current.isUpdating).toBe(false);
  });

  it('should handle controller change', async () => {
    const mockRegistration = {
      addEventListener: jest.fn(),
    };

    mockServiceWorker.register.mockResolvedValue(mockRegistration);
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    renderHook(() => useServiceWorker());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Trigger controllerchange event
    const controllerChangeCallback = mockServiceWorker.addEventListener.mock.calls.find(
      call => call[0] === 'controllerchange'
    )[1];

    act(() => {
      controllerChangeCallback();
    });

    expect(mockReload).toHaveBeenCalled();
  });

  it('should handle message events', async () => {
    const mockRegistration = {
      addEventListener: jest.fn(),
    };

    mockServiceWorker.register.mockResolvedValue(mockRegistration);
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    renderHook(() => useServiceWorker());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Trigger message event
    const messageCallback = mockServiceWorker.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )[1];

    const mockEvent = { data: 'test message' };

    act(() => {
      messageCallback(mockEvent);
    });

    expect(consoleLogSpy).toHaveBeenCalledWith('[SW] Message from service worker:', 'test message');

    consoleLogSpy.mockRestore();
  });

  it('should update service worker', async () => {
    const mockRegistration = {
      update: jest.fn().mockResolvedValue(undefined),
    };

    mockServiceWorker.ready.mockResolvedValue(mockRegistration);

    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      await result.current.updateServiceWorker();
    });

    expect(mockServiceWorker.ready).toHaveBeenCalled();
    expect(mockRegistration.update).toHaveBeenCalled();
  });

  it('should skip waiting when update is available', async () => {
    const mockRegistration = {
      waiting: {
        postMessage: jest.fn(),
      },
    };

    mockServiceWorker.ready.mockResolvedValue(mockRegistration);

    const { result } = renderHook(() => useServiceWorker());

    // Manually set update available
    act(() => {
      // Simulate update available state
      result.current.updateAvailable = true;
    });

    await act(async () => {
      await result.current.skipWaiting();
    });

    expect(mockServiceWorker.ready).toHaveBeenCalled();
    expect(mockRegistration.waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
  });

  it('should not skip waiting when no update is available', async () => {
    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      await result.current.skipWaiting();
    });

    expect(mockServiceWorker.ready).not.toHaveBeenCalled();
  });

  it('should handle unsupported service worker', () => {
    // Remove service worker support
    delete (navigator as any).serviceWorker;

    const { result } = renderHook(() => useServiceWorker());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.isRegistered).toBe(false);
  });
});