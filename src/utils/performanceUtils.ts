/**
 * Claude Usage Tracker - Performance Utilities
 *
 * A collection of performance optimization utilities for DOM operations:
 * - DOM Query Caching: Reduces redundant DOM queries
 * - Debouncing: Prevents excessive function calls
 * - Throttling: Limits function execution rate
 * - Batch Updates: Groups DOM mutations to minimize reflows
 * - requestAnimationFrame wrapper: Defers operations to next paint
 */

/**
 * Configuration for the DOM cache
 */
export interface DOMCacheConfig {
  /** Maximum age of cached entries in milliseconds (default: 1000ms) */
  maxAge: number;
  /** Maximum number of entries to cache (default: 100) */
  maxEntries: number;
}

/**
 * A cached query result entry
 */
interface CacheEntry<T> {
  /** The cached result */
  value: T;
  /** Timestamp when the entry was created */
  timestamp: number;
  /** The selector used for this query */
  selector: string;
}

/**
 * Default cache configuration
 */
const DEFAULT_CACHE_CONFIG: DOMCacheConfig = {
  maxAge: 1000, // 1 second default TTL
  maxEntries: 100,
};

/**
 * DOM Query Cache - Caches DOM query results to avoid redundant queries
 *
 * This cache helps reduce the number of expensive DOM queries by storing
 * results and returning cached values when the same query is made within
 * the cache TTL period.
 */
export class DOMQueryCache {
  private cache: Map<string, CacheEntry<Element[]>> = new Map();
  private config: DOMCacheConfig;
  private isInvalidated: boolean = false;

  constructor(config: Partial<DOMCacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
  }

  /**
   * Generate a cache key for a query
   */
  private generateKey(selector: string, context: Element | Document = document): string {
    const contextId = context === document
      ? 'document'
      : (context as Element).id || (context as Element).className || 'element';
    return `${contextId}:${selector}`;
  }

  /**
   * Check if a cache entry is still valid
   */
  private isEntryValid(entry: CacheEntry<Element[]>): boolean {
    if (this.isInvalidated) return false;
    const age = Date.now() - entry.timestamp;
    return age < this.config.maxAge;
  }

  /**
   * Prune old entries from the cache
   */
  private pruneCache(): void {
    if (this.cache.size <= this.config.maxEntries) return;

    // Remove oldest entries when cache exceeds max size
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = entries.slice(0, entries.length - this.config.maxEntries);
    toRemove.forEach(([key]) => this.cache.delete(key));
  }

  /**
   * Query all elements matching a selector, using cache if available
   */
  querySelectorAll<T extends Element = Element>(
    selector: string,
    context: Element | Document = document
  ): T[] {
    const key = this.generateKey(selector, context);
    const cached = this.cache.get(key);

    if (cached && this.isEntryValid(cached)) {
      // Verify cached elements are still in DOM
      const stillValid = cached.value.every(el => el.isConnected);
      if (stillValid) {
        return cached.value as T[];
      }
    }

    // Perform fresh query
    const result = Array.from(context.querySelectorAll<T>(selector));

    // Cache the result
    this.cache.set(key, {
      value: result,
      timestamp: Date.now(),
      selector,
    });

    this.pruneCache();
    return result;
  }

  /**
   * Query a single element matching a selector, using cache if available
   */
  querySelector<T extends Element = Element>(
    selector: string,
    context: Element | Document = document
  ): T | null {
    const results = this.querySelectorAll<T>(selector, context);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Invalidate all cached entries
   * Call this when you know the DOM has changed significantly
   */
  invalidate(): void {
    this.isInvalidated = true;
    this.cache.clear();
    this.isInvalidated = false;
  }

  /**
   * Invalidate entries matching a specific selector pattern
   */
  invalidateSelector(selectorPattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(selectorPattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics for debugging
   */
  getStats(): { size: number; maxEntries: number; maxAge: number } {
    return {
      size: this.cache.size,
      maxEntries: this.config.maxEntries,
      maxAge: this.config.maxAge,
    };
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
  }
}

/**
 * Creates a debounced version of a function that delays execution
 * until after the specified wait time has passed since the last call.
 *
 * @param func The function to debounce
 * @param wait The debounce delay in milliseconds
 * @param options Configuration options
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean; maxWait?: number } = {}
): T & { cancel: () => void; flush: () => void; pending: () => boolean } {
  const { leading = false, trailing = true, maxWait } = options;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | undefined;
  let lastInvokeTime: number = 0;
  let lastArgs: Parameters<T> | null = null;
  let result: ReturnType<T> | undefined;

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs;
    lastArgs = null;
    lastInvokeTime = time;
    if (args) {
      result = func.apply(null, args) as ReturnType<T>;
    }
    return result;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = lastCallTime === undefined ? 0 : time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function trailingEdge(time: number): ReturnType<T> | undefined {
    timeoutId = null;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null;
    return result;
  }

  function timerExpired(): void {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge(time);
      return;
    }
    // Restart timer
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    const remainingWait =
      maxWait !== undefined
        ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;

    timeoutId = setTimeout(timerExpired, remainingWait);
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait);

    if (leading) {
      return invokeFunc(time);
    }
    return result;
  }

  function debounced(...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(time);
      }
      if (maxWait !== undefined) {
        timeoutId = setTimeout(timerExpired, wait);
        return invokeFunc(time);
      }
    }
    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = function (): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastCallTime = undefined;
    timeoutId = null;
  };

  debounced.flush = function (): ReturnType<T> | undefined {
    if (timeoutId === null) {
      return result;
    }
    return trailingEdge(Date.now());
  };

  debounced.pending = function (): boolean {
    return timeoutId !== null;
  };

  return debounced as T & { cancel: () => void; flush: () => void; pending: () => boolean };
}

/**
 * Creates a throttled version of a function that only executes
 * at most once per specified time period.
 *
 * @param func The function to throttle
 * @param wait The minimum time between executions in milliseconds
 * @param options Configuration options
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T & { cancel: () => void } {
  const { leading = true, trailing = true } = options;

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  }) as T & { cancel: () => void };
}

/**
 * Batch DOM Updates - Collects DOM operations and executes them
 * in a single requestAnimationFrame callback to minimize reflows.
 */
export class BatchedDOMUpdater {
  private pendingOperations: Array<() => void> = [];
  private rafId: number | null = null;
  private isProcessing: boolean = false;

  /**
   * Schedule a DOM operation to be batched
   */
  schedule(operation: () => void): void {
    this.pendingOperations.push(operation);

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => this.flush());
    }
  }

  /**
   * Execute all pending operations immediately
   */
  flush(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.rafId = null;

    const operations = this.pendingOperations;
    this.pendingOperations = [];

    // Execute all operations in a single frame
    for (const operation of operations) {
      try {
        operation();
      } catch (e) {
        console.error('[ClaudeUsageTracker] Batched operation failed:', e);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Cancel all pending operations
   */
  cancel(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingOperations = [];
  }

  /**
   * Check if there are pending operations
   */
  hasPending(): boolean {
    return this.pendingOperations.length > 0;
  }
}

/**
 * Defer a function to the next animation frame
 * Useful for avoiding layout thrashing
 */
export function deferToNextFrame(callback: () => void): number {
  return requestAnimationFrame(callback);
}

/**
 * Execute a function after the browser has had a chance to paint
 * Uses double-rAF pattern for reliable post-paint execution
 */
export function afterPaint(callback: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}

/**
 * Read-then-write pattern helper to avoid layout thrashing
 * Collects all reads first, then performs all writes
 */
export class ReadWriteBatcher {
  private reads: Array<() => unknown> = [];
  private writes: Array<() => void> = [];
  private rafId: number | null = null;

  /**
   * Schedule a read operation (e.g., getBoundingClientRect)
   */
  read<T>(operation: () => T): Promise<T> {
    return new Promise((resolve) => {
      this.reads.push(() => resolve(operation()));
      this.scheduleFlush();
    });
  }

  /**
   * Schedule a write operation (e.g., style changes)
   */
  write(operation: () => void): void {
    this.writes.push(operation);
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => this.flush());
    }
  }

  private flush(): void {
    this.rafId = null;

    // Execute all reads first
    const reads = this.reads;
    this.reads = [];
    for (const read of reads) {
      try {
        read();
      } catch (e) {
        console.error('[ClaudeUsageTracker] Read operation failed:', e);
      }
    }

    // Then execute all writes
    const writes = this.writes;
    this.writes = [];
    for (const write of writes) {
      try {
        write();
      } catch (e) {
        console.error('[ClaudeUsageTracker] Write operation failed:', e);
      }
    }
  }

  /**
   * Cancel all pending operations
   */
  cancel(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.reads = [];
    this.writes = [];
  }
}

/**
 * MutationObserver wrapper with built-in debouncing and targeted observation
 */
export interface DebouncedMutationObserverOptions {
  /** Debounce delay in milliseconds (default: 100ms) */
  debounceMs?: number;
  /** Maximum wait time before forcing execution (default: 500ms) */
  maxWait?: number;
  /** Filter function to determine if mutations are relevant */
  filter?: (mutations: MutationRecord[]) => MutationRecord[];
}

export class DebouncedMutationObserver {
  private observer: MutationObserver;
  private debouncedCallback: ReturnType<typeof debounce>;
  private isObserving: boolean = false;
  private observedTargets: Set<Node> = new Set();

  constructor(
    callback: (mutations: MutationRecord[]) => void,
    options: DebouncedMutationObserverOptions = {}
  ) {
    const { debounceMs = 100, maxWait = 500, filter } = options;

    const wrappedCallback = (mutations: MutationRecord[]) => {
      const filteredMutations = filter ? filter(mutations) : mutations;
      if (filteredMutations.length > 0) {
        callback(filteredMutations);
      }
    };

    this.debouncedCallback = debounce(
      wrappedCallback as (...args: unknown[]) => unknown,
      debounceMs,
      { maxWait, trailing: true }
    );

    let pendingMutations: MutationRecord[] = [];

    this.observer = new MutationObserver((mutations) => {
      pendingMutations = pendingMutations.concat(mutations);
      this.debouncedCallback(pendingMutations);

      // Clear pending after debounce triggers
      if (!this.debouncedCallback.pending()) {
        pendingMutations = [];
      }
    });
  }

  /**
   * Start observing a target node
   */
  observe(target: Node, options?: MutationObserverInit): void {
    this.observer.observe(target, options);
    this.observedTargets.add(target);
    this.isObserving = true;
  }

  /**
   * Stop observing all targets
   */
  disconnect(): void {
    this.observer.disconnect();
    this.debouncedCallback.cancel();
    this.observedTargets.clear();
    this.isObserving = false;
  }

  /**
   * Get pending mutations without clearing them
   */
  takeRecords(): MutationRecord[] {
    return this.observer.takeRecords();
  }

  /**
   * Check if observer is currently active
   */
  isActive(): boolean {
    return this.isObserving;
  }

  /**
   * Flush any pending debounced callbacks
   */
  flush(): void {
    this.debouncedCallback.flush();
  }
}

// Create singleton instances for common use
let globalDOMCache: DOMQueryCache | null = null;
let globalBatchUpdater: BatchedDOMUpdater | null = null;
let globalReadWriteBatcher: ReadWriteBatcher | null = null;

/**
 * Get the global DOM query cache instance
 */
export function getDOMCache(config?: Partial<DOMCacheConfig>): DOMQueryCache {
  if (!globalDOMCache) {
    globalDOMCache = new DOMQueryCache(config);
  }
  return globalDOMCache;
}

/**
 * Get the global batch updater instance
 */
export function getBatchUpdater(): BatchedDOMUpdater {
  if (!globalBatchUpdater) {
    globalBatchUpdater = new BatchedDOMUpdater();
  }
  return globalBatchUpdater;
}

/**
 * Get the global read-write batcher instance
 */
export function getReadWriteBatcher(): ReadWriteBatcher {
  if (!globalReadWriteBatcher) {
    globalReadWriteBatcher = new ReadWriteBatcher();
  }
  return globalReadWriteBatcher;
}

/**
 * Reset all global performance utilities
 * Useful for cleanup during extension unload
 */
export function resetPerformanceUtils(): void {
  if (globalDOMCache) {
    globalDOMCache.clear();
    globalDOMCache = null;
  }
  if (globalBatchUpdater) {
    globalBatchUpdater.cancel();
    globalBatchUpdater = null;
  }
  if (globalReadWriteBatcher) {
    globalReadWriteBatcher.cancel();
    globalReadWriteBatcher = null;
  }
}

// Default exports
export default {
  DOMQueryCache,
  BatchedDOMUpdater,
  ReadWriteBatcher,
  DebouncedMutationObserver,
  debounce,
  throttle,
  deferToNextFrame,
  afterPaint,
  getDOMCache,
  getBatchUpdater,
  getReadWriteBatcher,
  resetPerformanceUtils,
};
