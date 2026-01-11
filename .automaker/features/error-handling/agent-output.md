
🔧 Tool: Task
Input: {
  "description": "Explore codebase structure",
  "prompt": "Explore this codebase to understand its structure. I need to implement comprehensive error handling for edge cases including:\n- Page not fully loaded\n- Missing DOM elements\n- Invalid time formats\n- Unexpected page structure changes\n- Logging errors and degrading gracefully\n\nPlease find:\n1. The main source files and their purposes\n2. Any existing error handling patterns\n3. Where DOM interactions happen\n4. Any time parsing/formatting code\n5. The overall architecture of the project\n\nBe thorough - look at package.json, main source files, and any configuration files.",
  "subagent_type": "Explore"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/package.json"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/README.md"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/*.ts",
  "path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/*.tsx",
  "path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/*.js",
  "path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension"
}

🔧 Tool: Glob
Input: {
  "pattern": "src/**/*.ts",
  "path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension"
}

🔧 Tool: Glob
Input: {
  "pattern": "src/**/*.tsx",
  "path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/shaal/code/utilities/claude-usage-rate-chrome-extension/src -type f \\( -name \"*.ts\" -o -name \"*.tsx\" -o -name \"*.js\" \\) 2>/dev/null | head -20",
  "description": "Find source files in src directory"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /home/shaal/code/utilities/claude-usage-rate-chrome-extension/",
  "description": "List main directory contents"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/index.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/index.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/vite.config.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/usageDataExtractor.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/timeStringParser.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/components/CircularIndicator.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/components/WeeklyTracker.ts",
  "limit": 100
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/sessionTimeCalculator.ts",
  "limit": 100
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/public/manifest.json"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/shaal/code/utilities/claude-usage-rate-chrome-extension/tests -type f -name \"*.ts\" 2>/dev/null | head -10",
  "description": "Find test files in tests directory"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/weeklyTimeCalculator.ts",
  "limit": 150
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/efficiencyDeltaCalculator.ts",
  "limit": 100
}
Now I have a comprehensive understanding of the codebase. Let me read the key files to understand the existing patterns better before implementing the error handling improvements.

🔧 Tool: Read
Input: {
  "file_path": "/Users/mhanley/code/projects/claude-usage-extension/src/content/sessionTracker.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/mhanley/code/projects/claude-usage-extension/src/utils/domDetector.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/mhanley/code/projects/claude-usage-extension/src/utils/usageDataExtractor.ts"
}
Let me find the correct path to the codebase:

🔧 Tool: Bash
Input: {
  "command": "find /Users -type d -name \"claude-usage-extension\" 2>/dev/null | head -5",
  "description": "Find claude-usage-extension directory"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/package.json"
}
Found it. Let me read the main source files:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/package.json"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/src/**/*.ts",
  "path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Read and understand existing source files",
      "status": "in_progress",
      "activeForm": "Reading source files"
    },
    {
      "content": "Create error handling utility module",
      "status": "pending",
      "activeForm": "Creating error handling utility"
    },
    {
      "content": "Add error handling to domDetector.ts",
      "status": "pending",
      "activeForm": "Adding error handling to DOM detector"
    },
    {
      "content": "Add error handling to usageDataExtractor.ts",
      "status": "pending",
      "activeForm": "Adding error handling to data extractor"
    },
    {
      "content": "Add error handling to timeStringParser.ts",
      "status": "pending",
      "activeForm": "Adding error handling to time parser"
    },
    {
      "content": "Add error handling to sessionTracker.ts",
      "status": "pending",
      "activeForm": "Adding error handling to session tracker"
    },
    {
      "content": "Add error handling to content/index.ts",
      "status": "pending",
      "activeForm": "Adding error handling to content script"
    },
    {
      "content": "Create and run Playwright verification test",
      "status": "pending",
      "activeForm": "Verifying with Playwright test"
    }
  ]
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/usageDataExtractor.ts"
}
Now let me read the remaining key files:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/timeStringParser.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/index.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/index.ts"
}
Now let me check the remaining utility files and the component files to complete my understanding:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/components/CircularIndicator.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/sessionTimeCalculator.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/weeklyTimeCalculator.ts"
}
Now I have a comprehensive understanding of the codebase. Let me update my todo list and start implementing the error handling system.

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Read and understand existing source files",
      "status": "completed",
      "activeForm": "Reading source files"
    },
    {
      "content": "Create error handling utility module",
      "status": "in_progress",
      "activeForm": "Creating error handling utility"
    },
    {
      "content": "Add error handling to domDetector.ts",
      "status": "pending",
      "activeForm": "Adding error handling to DOM detector"
    },
    {
      "content": "Add error handling to usageDataExtractor.ts",
      "status": "pending",
      "activeForm": "Adding error handling to data extractor"
    },
    {
      "content": "Add error handling to timeStringParser.ts",
      "status": "pending",
      "activeForm": "Adding error handling to time parser"
    },
    {
      "content": "Add error handling to sessionTracker.ts",
      "status": "pending",
      "activeForm": "Adding error handling to session tracker"
    },
    {
      "content": "Add error handling to content/index.ts",
      "status": "pending",
      "activeForm": "Adding error handling to content script"
    },
    {
      "content": "Create and run Playwright verification test",
      "status": "pending",
      "activeForm": "Verifying with Playwright test"
    }
  ]
}
Now let me create the comprehensive error handling utility module:

🔧 Tool: Write
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/errorHandler.ts",
  "content": "/**\n * Error Handler - Comprehensive error handling utilities for Claude Usage Tracker\n *\n * This module provides:\n * - Custom error types for different error categories\n * - Error logging with severity levels\n * - Graceful degradation helpers\n * - Page state validation\n * - Safe DOM operation wrappers\n */\n\n/**\n * Error severity levels\n */\nexport type ErrorSeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical';\n\n/**\n * Error categories for different types of failures\n */\nexport type ErrorCategory =\n  | 'page-load'\n  | 'dom-element'\n  | 'time-format'\n  | 'page-structure'\n  | 'parsing'\n  | 'calculation'\n  | 'rendering'\n  | 'network'\n  | 'unknown';\n\n/**\n * Structured error information\n */\nexport interface TrackerError {\n  /** Unique error code for identification */\n  code: string;\n  /** Human-readable error message */\n  message: string;\n  /** Error category */\n  category: ErrorCategory;\n  /** Error severity level */\n  severity: ErrorSeverity;\n  /** Additional context data */\n  context?: Record<string, unknown>;\n  /** Original error if wrapping another error */\n  originalError?: Error;\n  /** Timestamp when error occurred */\n  timestamp: Date;\n  /** Whether this error was recovered from */\n  recovered: boolean;\n  /** Recovery action taken (if any) */\n  recoveryAction?: string;\n}\n\n/**\n * Error codes for common error scenarios\n */\nexport const ErrorCodes = {\n  // Page Load Errors (1xx)\n  PAGE_NOT_READY: 'E101',\n  PAGE_LOAD_TIMEOUT: 'E102',\n  WRONG_PAGE: 'E103',\n  DOCUMENT_NOT_AVAILABLE: 'E104',\n\n  // DOM Element Errors (2xx)\n  ELEMENT_NOT_FOUND: 'E201',\n  ELEMENT_REMOVED: 'E202',\n  CONTAINER_NOT_FOUND: 'E203',\n  MULTIPLE_ELEMENTS_FOUND: 'E204',\n  ELEMENT_ATTRIBUTE_MISSING: 'E205',\n\n  // Time Format Errors (3xx)\n  INVALID_TIME_FORMAT: 'E301',\n  INVALID_RELATIVE_TIME: 'E302',\n  INVALID_ABSOLUTE_TIME: 'E303',\n  TIME_OUT_OF_RANGE: 'E304',\n  INVALID_DAY_OF_WEEK: 'E305',\n\n  // Page Structure Errors (4xx)\n  STRUCTURE_CHANGED: 'E401',\n  MISSING_PERCENTAGE: 'E402',\n  MISSING_TIMER: 'E403',\n  UNEXPECTED_CONTENT: 'E404',\n\n  // Parsing Errors (5xx)\n  PERCENTAGE_PARSE_FAILED: 'E501',\n  TIMER_PARSE_FAILED: 'E502',\n  RESET_TIME_PARSE_FAILED: 'E503',\n  TEXT_EXTRACTION_FAILED: 'E504',\n\n  // Calculation Errors (6xx)\n  INVALID_SESSION_DATA: 'E601',\n  INVALID_WEEKLY_DATA: 'E602',\n  CALCULATION_OVERFLOW: 'E603',\n\n  // Rendering Errors (7xx)\n  INDICATOR_CREATE_FAILED: 'E701',\n  INDICATOR_UPDATE_FAILED: 'E702',\n  STYLE_INJECT_FAILED: 'E703',\n  DOM_INSERT_FAILED: 'E704',\n\n  // Unknown/General Errors (9xx)\n  UNKNOWN_ERROR: 'E999',\n} as const;\n\n/**\n * Logger configuration\n */\nexport interface LoggerConfig {\n  /** Whether to enable logging */\n  enabled: boolean;\n  /** Minimum severity level to log */\n  minSeverity: ErrorSeverity;\n  /** Whether to include timestamps */\n  includeTimestamp: boolean;\n  /** Whether to log to console */\n  logToConsole: boolean;\n  /** Custom log prefix */\n  prefix: string;\n  /** Maximum errors to store in memory */\n  maxStoredErrors: number;\n}\n\n/**\n * Default logger configuration\n */\nconst DEFAULT_LOGGER_CONFIG: LoggerConfig = {\n  enabled: true,\n  minSeverity: 'warning',\n  includeTimestamp: true,\n  logToConsole: true,\n  prefix: '[Claude Usage Tracker]',\n  maxStoredErrors: 100,\n};\n\n/**\n * Severity level numeric values for comparison\n */\nconst SEVERITY_LEVELS: Record<ErrorSeverity, number> = {\n  debug: 0,\n  info: 1,\n  warning: 2,\n  error: 3,\n  critical: 4,\n};\n\n/**\n * Error Handler class for managing errors throughout the extension\n */\nexport class ErrorHandler {\n  private config: LoggerConfig;\n  private errors: TrackerError[] = [];\n  private errorCallbacks: ((error: TrackerError) => void)[] = [];\n\n  constructor(config: Partial<LoggerConfig> = {}) {\n    this.config = { ...DEFAULT_LOGGER_CONFIG, ...config };\n  }\n\n  /**\n   * Create a new TrackerError\n   */\n  createError(\n    code: string,\n    message: string,\n    category: ErrorCategory,\n    severity: ErrorSeverity,\n    context?: Record<string, unknown>,\n    originalError?: Error\n  ): TrackerError {\n    return {\n      code,\n      message,\n      category,\n      severity,\n      context,\n      originalError,\n      timestamp: new Date(),\n      recovered: false,\n    };\n  }\n\n  /**\n   * Log an error\n   */\n  logError(error: TrackerError): void {\n    // Check if logging is enabled and severity meets threshold\n    if (!this.config.enabled) return;\n    if (SEVERITY_LEVELS[error.severity] < SEVERITY_LEVELS[this.config.minSeverity]) return;\n\n    // Store error\n    this.errors.push(error);\n    if (this.errors.length > this.config.maxStoredErrors) {\n      this.errors.shift();\n    }\n\n    // Log to console if enabled\n    if (this.config.logToConsole) {\n      this.logToConsole(error);\n    }\n\n    // Notify callbacks\n    this.errorCallbacks.forEach(callback => {\n      try {\n        callback(error);\n      } catch (e) {\n        // Prevent callback errors from breaking the system\n        console.error(`${this.config.prefix} Error callback failed:`, e);\n      }\n    });\n  }\n\n  /**\n   * Log error to console with appropriate formatting\n   */\n  private logToConsole(error: TrackerError): void {\n    const timestamp = this.config.includeTimestamp\n      ? `[${error.timestamp.toISOString()}]`\n      : '';\n    const prefix = `${this.config.prefix} ${timestamp} [${error.code}]`;\n\n    const consoleMethod = this.getConsoleMethod(error.severity);\n    const args: unknown[] = [`${prefix} ${error.message}`];\n\n    if (error.context) {\n      args.push('\\nContext:', error.context);\n    }\n\n    if (error.originalError) {\n      args.push('\\nOriginal Error:', error.originalError);\n    }\n\n    consoleMethod(...args);\n  }\n\n  /**\n   * Get the appropriate console method for the severity level\n   */\n  private getConsoleMethod(severity: ErrorSeverity): (...args: unknown[]) => void {\n    switch (severity) {\n      case 'debug':\n        return console.debug.bind(console);\n      case 'info':\n        return console.info.bind(console);\n      case 'warning':\n        return console.warn.bind(console);\n      case 'error':\n      case 'critical':\n        return console.error.bind(console);\n      default:\n        return console.log.bind(console);\n    }\n  }\n\n  /**\n   * Log a quick error message without creating a full TrackerError\n   */\n  log(\n    severity: ErrorSeverity,\n    message: string,\n    context?: Record<string, unknown>\n  ): void {\n    const error = this.createError(\n      ErrorCodes.UNKNOWN_ERROR,\n      message,\n      'unknown',\n      severity,\n      context\n    );\n    this.logError(error);\n  }\n\n  /**\n   * Convenience methods for different severity levels\n   */\n  debug(message: string, context?: Record<string, unknown>): void {\n    this.log('debug', message, context);\n  }\n\n  info(message: string, context?: Record<string, unknown>): void {\n    this.log('info', message, context);\n  }\n\n  warn(message: string, context?: Record<string, unknown>): void {\n    this.log('warning', message, context);\n  }\n\n  error(message: string, context?: Record<string, unknown>): void {\n    this.log('error', message, context);\n  }\n\n  critical(message: string, context?: Record<string, unknown>): void {\n    this.log('critical', message, context);\n  }\n\n  /**\n   * Mark an error as recovered\n   */\n  markRecovered(error: TrackerError, recoveryAction: string): void {\n    error.recovered = true;\n    error.recoveryAction = recoveryAction;\n    this.debug(`Error recovered: ${error.code} via ${recoveryAction}`, { error });\n  }\n\n  /**\n   * Register an error callback\n   */\n  onError(callback: (error: TrackerError) => void): () => void {\n    this.errorCallbacks.push(callback);\n    return () => {\n      this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);\n    };\n  }\n\n  /**\n   * Get all stored errors\n   */\n  getErrors(): readonly TrackerError[] {\n    return [...this.errors];\n  }\n\n  /**\n   * Get errors by category\n   */\n  getErrorsByCategory(category: ErrorCategory): TrackerError[] {\n    return this.errors.filter(e => e.category === category);\n  }\n\n  /**\n   * Get errors by severity\n   */\n  getErrorsBySeverity(severity: ErrorSeverity): TrackerError[] {\n    return this.errors.filter(e => e.severity === severity);\n  }\n\n  /**\n   * Get unrecovered errors\n   */\n  getUnrecoveredErrors(): TrackerError[] {\n    return this.errors.filter(e => !e.recovered);\n  }\n\n  /**\n   * Clear stored errors\n   */\n  clearErrors(): void {\n    this.errors = [];\n  }\n\n  /**\n   * Update configuration\n   */\n  updateConfig(config: Partial<LoggerConfig>): void {\n    this.config = { ...this.config, ...config };\n  }\n\n  /**\n   * Get current configuration\n   */\n  getConfig(): Readonly<LoggerConfig> {\n    return { ...this.config };\n  }\n}\n\n// Global error handler instance\nlet globalErrorHandler: ErrorHandler | null = null;\n\n/**\n * Get or create the global error handler instance\n */\nexport function getErrorHandler(config?: Partial<LoggerConfig>): ErrorHandler {\n  if (!globalErrorHandler) {\n    globalErrorHandler = new ErrorHandler(config);\n  }\n  return globalErrorHandler;\n}\n\n/**\n * Reset the global error handler\n */\nexport function resetErrorHandler(): void {\n  globalErrorHandler = null;\n}\n\n/**\n * Page State Validation Utilities\n */\n\n/**\n * Result of page state validation\n */\nexport interface PageStateResult {\n  isReady: boolean;\n  isUsagePage: boolean;\n  documentState: DocumentReadyState;\n  hasBody: boolean;\n  hasHead: boolean;\n  errors: TrackerError[];\n}\n\n/**\n * Validate the current page state\n */\nexport function validatePageState(): PageStateResult {\n  const handler = getErrorHandler();\n  const errors: TrackerError[] = [];\n\n  let documentState: DocumentReadyState = 'loading';\n  let hasBody = false;\n  let hasHead = false;\n  let isUsagePage = false;\n\n  try {\n    documentState = document.readyState;\n  } catch (e) {\n    errors.push(handler.createError(\n      ErrorCodes.DOCUMENT_NOT_AVAILABLE,\n      'Document object not available',\n      'page-load',\n      'critical',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    ));\n  }\n\n  try {\n    hasBody = !!document.body;\n  } catch (e) {\n    // Already handled above\n  }\n\n  try {\n    hasHead = !!document.head;\n  } catch (e) {\n    // Already handled above\n  }\n\n  try {\n    isUsagePage = window.location.href.includes('claude.ai/settings/usage');\n  } catch (e) {\n    errors.push(handler.createError(\n      ErrorCodes.WRONG_PAGE,\n      'Unable to determine current page URL',\n      'page-load',\n      'warning',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    ));\n  }\n\n  const isReady = documentState === 'complete' || documentState === 'interactive';\n\n  if (!isReady) {\n    errors.push(handler.createError(\n      ErrorCodes.PAGE_NOT_READY,\n      `Page not ready. Current state: ${documentState}`,\n      'page-load',\n      'warning',\n      { documentState }\n    ));\n  }\n\n  if (!hasBody) {\n    errors.push(handler.createError(\n      ErrorCodes.PAGE_NOT_READY,\n      'Document body not available',\n      'page-load',\n      'error'\n    ));\n  }\n\n  // Log errors\n  errors.forEach(error => handler.logError(error));\n\n  return {\n    isReady,\n    isUsagePage,\n    documentState,\n    hasBody,\n    hasHead,\n    errors,\n  };\n}\n\n/**\n * Wait for page to be ready with timeout\n */\nexport async function waitForPageReady(\n  timeoutMs: number = 10000\n): Promise<PageStateResult> {\n  const handler = getErrorHandler();\n  const startTime = Date.now();\n\n  return new Promise((resolve) => {\n    const checkState = () => {\n      const state = validatePageState();\n\n      if (state.isReady) {\n        resolve(state);\n        return;\n      }\n\n      if (Date.now() - startTime >= timeoutMs) {\n        const error = handler.createError(\n          ErrorCodes.PAGE_LOAD_TIMEOUT,\n          `Page load timeout after ${timeoutMs}ms`,\n          'page-load',\n          'error',\n          { elapsed: Date.now() - startTime }\n        );\n        handler.logError(error);\n        state.errors.push(error);\n        resolve(state);\n        return;\n      }\n\n      setTimeout(checkState, 100);\n    };\n\n    checkState();\n  });\n}\n\n/**\n * Safe DOM Operation Wrappers\n */\n\n/**\n * Result of a safe DOM operation\n */\nexport interface SafeOperationResult<T> {\n  success: boolean;\n  value: T | null;\n  error: TrackerError | null;\n}\n\n/**\n * Safely query for a single element\n */\nexport function safeQuerySelector<T extends Element = HTMLElement>(\n  selector: string,\n  parent: Element | Document = document\n): SafeOperationResult<T> {\n  const handler = getErrorHandler();\n\n  try {\n    const element = parent.querySelector<T>(selector);\n\n    if (!element) {\n      return {\n        success: false,\n        value: null,\n        error: handler.createError(\n          ErrorCodes.ELEMENT_NOT_FOUND,\n          `Element not found for selector: ${selector}`,\n          'dom-element',\n          'debug',\n          { selector }\n        ),\n      };\n    }\n\n    return {\n      success: true,\n      value: element,\n      error: null,\n    };\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.ELEMENT_NOT_FOUND,\n      `Error querying selector: ${selector}`,\n      'dom-element',\n      'error',\n      { selector },\n      e instanceof Error ? e : new Error(String(e))\n    );\n    handler.logError(error);\n\n    return {\n      success: false,\n      value: null,\n      error,\n    };\n  }\n}\n\n/**\n * Safely query for multiple elements\n */\nexport function safeQuerySelectorAll<T extends Element = HTMLElement>(\n  selector: string,\n  parent: Element | Document = document\n): SafeOperationResult<NodeListOf<T>> {\n  const handler = getErrorHandler();\n\n  try {\n    const elements = parent.querySelectorAll<T>(selector);\n\n    return {\n      success: true,\n      value: elements,\n      error: null,\n    };\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.ELEMENT_NOT_FOUND,\n      `Error querying selector: ${selector}`,\n      'dom-element',\n      'error',\n      { selector },\n      e instanceof Error ? e : new Error(String(e))\n    );\n    handler.logError(error);\n\n    return {\n      success: false,\n      value: null,\n      error,\n    };\n  }\n}\n\n/**\n * Safely get text content from an element\n */\nexport function safeGetTextContent(element: Element | null): SafeOperationResult<string> {\n  const handler = getErrorHandler();\n\n  if (!element) {\n    return {\n      success: false,\n      value: null,\n      error: handler.createError(\n        ErrorCodes.ELEMENT_NOT_FOUND,\n        'Cannot get text content from null element',\n        'dom-element',\n        'debug'\n      ),\n    };\n  }\n\n  try {\n    const text = element.textContent?.trim() ?? '';\n    return {\n      success: true,\n      value: text,\n      error: null,\n    };\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.TEXT_EXTRACTION_FAILED,\n      'Error extracting text content',\n      'dom-element',\n      'warning',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    );\n    handler.logError(error);\n\n    return {\n      success: false,\n      value: null,\n      error,\n    };\n  }\n}\n\n/**\n * Safely set an attribute on an element\n */\nexport function safeSetAttribute(\n  element: Element | null,\n  name: string,\n  value: string\n): SafeOperationResult<void> {\n  const handler = getErrorHandler();\n\n  if (!element) {\n    return {\n      success: false,\n      value: null,\n      error: handler.createError(\n        ErrorCodes.ELEMENT_NOT_FOUND,\n        'Cannot set attribute on null element',\n        'dom-element',\n        'debug',\n        { attribute: name }\n      ),\n    };\n  }\n\n  try {\n    element.setAttribute(name, value);\n    return {\n      success: true,\n      value: undefined,\n      error: null,\n    };\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.DOM_INSERT_FAILED,\n      `Error setting attribute ${name}`,\n      'dom-element',\n      'warning',\n      { attribute: name, value },\n      e instanceof Error ? e : new Error(String(e))\n    );\n    handler.logError(error);\n\n    return {\n      success: false,\n      value: null,\n      error,\n    };\n  }\n}\n\n/**\n * Safely append a child element\n */\nexport function safeAppendChild(\n  parent: Element | null,\n  child: Element | null\n): SafeOperationResult<void> {\n  const handler = getErrorHandler();\n\n  if (!parent) {\n    return {\n      success: false,\n      value: null,\n      error: handler.createError(\n        ErrorCodes.CONTAINER_NOT_FOUND,\n        'Cannot append to null parent',\n        'dom-element',\n        'warning'\n      ),\n    };\n  }\n\n  if (!child) {\n    return {\n      success: false,\n      value: null,\n      error: handler.createError(\n        ErrorCodes.ELEMENT_NOT_FOUND,\n        'Cannot append null child',\n        'dom-element',\n        'warning'\n      ),\n    };\n  }\n\n  try {\n    parent.appendChild(child);\n    return {\n      success: true,\n      value: undefined,\n      error: null,\n    };\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.DOM_INSERT_FAILED,\n      'Error appending child element',\n      'rendering',\n      'error',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    );\n    handler.logError(error);\n\n    return {\n      success: false,\n      value: null,\n      error,\n    };\n  }\n}\n\n/**\n * Safely remove an element\n */\nexport function safeRemoveElement(element: Element | null): SafeOperationResult<void> {\n  const handler = getErrorHandler();\n\n  if (!element) {\n    // Not an error - element doesn't exist, nothing to remove\n    return {\n      success: true,\n      value: undefined,\n      error: null,\n    };\n  }\n\n  try {\n    element.remove();\n    return {\n      success: true,\n      value: undefined,\n      error: null,\n    };\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.DOM_INSERT_FAILED,\n      'Error removing element',\n      'rendering',\n      'warning',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    );\n    handler.logError(error);\n\n    return {\n      success: false,\n      value: null,\n      error,\n    };\n  }\n}\n\n/**\n * Check if an element is still in the DOM\n */\nexport function isElementInDOM(element: Element | null): boolean {\n  if (!element) return false;\n\n  try {\n    return document.body.contains(element);\n  } catch {\n    return false;\n  }\n}\n\n/**\n * Time Format Validation Utilities\n */\n\n/**\n * Validate a relative time string format\n */\nexport function validateRelativeTimeFormat(timeStr: string): SafeOperationResult<boolean> {\n  const handler = getErrorHandler();\n\n  if (!timeStr || typeof timeStr !== 'string') {\n    return {\n      success: false,\n      value: false,\n      error: handler.createError(\n        ErrorCodes.INVALID_TIME_FORMAT,\n        'Invalid time string: empty or not a string',\n        'time-format',\n        'debug',\n        { input: timeStr }\n      ),\n    };\n  }\n\n  const trimmed = timeStr.trim().toLowerCase();\n\n  // Check for relative time patterns\n  const hasHours = /\\d+\\s*(?:hr|hours?)/i.test(trimmed);\n  const hasMinutes = /\\d+\\s*(?:min|minutes?)/i.test(trimmed);\n\n  if (!hasHours && !hasMinutes) {\n    return {\n      success: false,\n      value: false,\n      error: handler.createError(\n        ErrorCodes.INVALID_RELATIVE_TIME,\n        `Invalid relative time format: ${timeStr}`,\n        'time-format',\n        'debug',\n        { input: timeStr }\n      ),\n    };\n  }\n\n  return {\n    success: true,\n    value: true,\n    error: null,\n  };\n}\n\n/**\n * Validate an absolute time string format\n */\nexport function validateAbsoluteTimeFormat(timeStr: string): SafeOperationResult<boolean> {\n  const handler = getErrorHandler();\n\n  if (!timeStr || typeof timeStr !== 'string') {\n    return {\n      success: false,\n      value: false,\n      error: handler.createError(\n        ErrorCodes.INVALID_TIME_FORMAT,\n        'Invalid time string: empty or not a string',\n        'time-format',\n        'debug',\n        { input: timeStr }\n      ),\n    };\n  }\n\n  const trimmed = timeStr.trim();\n\n  // 12-hour format with optional day\n  const time12Pattern = /^(?:(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\\s+)?(\\d{1,2}):(\\d{2})\\s*(AM|PM)$/i;\n  // 24-hour format with optional day\n  const time24Pattern = /^(?:(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\\s+)?(\\d{1,2}):(\\d{2})$/i;\n\n  if (!time12Pattern.test(trimmed) && !time24Pattern.test(trimmed)) {\n    return {\n      success: false,\n      value: false,\n      error: handler.createError(\n        ErrorCodes.INVALID_ABSOLUTE_TIME,\n        `Invalid absolute time format: ${timeStr}`,\n        'time-format',\n        'debug',\n        { input: timeStr }\n      ),\n    };\n  }\n\n  return {\n    success: true,\n    value: true,\n    error: null,\n  };\n}\n\n/**\n * Validate a percentage value\n */\nexport function validatePercentage(value: number): SafeOperationResult<number> {\n  const handler = getErrorHandler();\n\n  if (typeof value !== 'number' || isNaN(value)) {\n    return {\n      success: false,\n      value: null,\n      error: handler.createError(\n        ErrorCodes.PERCENTAGE_PARSE_FAILED,\n        'Invalid percentage: not a number',\n        'parsing',\n        'warning',\n        { input: value }\n      ),\n    };\n  }\n\n  // Clamp to valid range\n  const clamped = Math.max(0, Math.min(100, value));\n\n  if (value < 0 || value > 100) {\n    const error = handler.createError(\n      ErrorCodes.TIME_OUT_OF_RANGE,\n      `Percentage out of range: ${value}, clamped to ${clamped}`,\n      'parsing',\n      'debug',\n      { input: value, clamped }\n    );\n    handler.logError(error);\n\n    return {\n      success: true,\n      value: clamped,\n      error,\n    };\n  }\n\n  return {\n    success: true,\n    value: value,\n    error: null,\n  };\n}\n\n/**\n * Graceful Degradation Helper\n */\n\n/**\n * Configuration for graceful degradation\n */\nexport interface DegradationConfig {\n  /** Whether to continue with partial data */\n  allowPartialData: boolean;\n  /** Whether to show fallback UI */\n  showFallbackUI: boolean;\n  /** Whether to retry failed operations */\n  retryOnFailure: boolean;\n  /** Maximum retry attempts */\n  maxRetries: number;\n  /** Retry delay in milliseconds */\n  retryDelayMs: number;\n}\n\nconst DEFAULT_DEGRADATION_CONFIG: DegradationConfig = {\n  allowPartialData: true,\n  showFallbackUI: true,\n  retryOnFailure: true,\n  maxRetries: 3,\n  retryDelayMs: 1000,\n};\n\n/**\n * Execute an operation with graceful degradation\n */\nexport async function withGracefulDegradation<T>(\n  operation: () => T | Promise<T>,\n  fallbackValue: T,\n  options: Partial<DegradationConfig> = {}\n): Promise<{ value: T; degraded: boolean; errors: TrackerError[] }> {\n  const config = { ...DEFAULT_DEGRADATION_CONFIG, ...options };\n  const handler = getErrorHandler();\n  const errors: TrackerError[] = [];\n  let attempts = 0;\n\n  while (attempts < config.maxRetries) {\n    try {\n      const result = await operation();\n      return {\n        value: result,\n        degraded: false,\n        errors,\n      };\n    } catch (e) {\n      attempts++;\n      const error = handler.createError(\n        ErrorCodes.UNKNOWN_ERROR,\n        `Operation failed (attempt ${attempts}/${config.maxRetries})`,\n        'unknown',\n        attempts >= config.maxRetries ? 'error' : 'warning',\n        { attempt: attempts },\n        e instanceof Error ? e : new Error(String(e))\n      );\n      handler.logError(error);\n      errors.push(error);\n\n      if (!config.retryOnFailure || attempts >= config.maxRetries) {\n        break;\n      }\n\n      // Wait before retrying\n      await new Promise(resolve => setTimeout(resolve, config.retryDelayMs));\n    }\n  }\n\n  handler.warn(`Degrading gracefully with fallback value after ${attempts} attempts`);\n\n  return {\n    value: fallbackValue,\n    degraded: true,\n    errors,\n  };\n}\n\n/**\n * Execute multiple operations and collect results\n */\nexport async function executeWithPartialResults<T>(\n  operations: (() => T | Promise<T>)[],\n  config: Partial<DegradationConfig> = {}\n): Promise<{\n  results: (T | null)[];\n  successCount: number;\n  errors: TrackerError[];\n}> {\n  const results: (T | null)[] = [];\n  const allErrors: TrackerError[] = [];\n  let successCount = 0;\n\n  for (const operation of operations) {\n    const { value, errors, degraded } = await withGracefulDegradation(\n      operation,\n      null as T | null,\n      config\n    );\n\n    results.push(value);\n    allErrors.push(...errors);\n\n    if (!degraded && value !== null) {\n      successCount++;\n    }\n  }\n\n  return {\n    results,\n    successCount,\n    errors: allErrors,\n  };\n}\n\n// Export default handler for convenience\nexport default getErrorHandler;\n"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Read and understand existing source files",
      "status": "completed",
      "activeForm": "Reading source files"
    },
    {
      "content": "Create error handling utility module",
      "status": "completed",
      "activeForm": "Creating error handling utility"
    },
    {
      "content": "Add error handling to domDetector.ts",
      "status": "in_progress",
      "activeForm": "Adding error handling to DOM detector"
    },
    {
      "content": "Add error handling to usageDataExtractor.ts",
      "status": "pending",
      "activeForm": "Adding error handling to data extractor"
    },
    {
      "content": "Add error handling to timeStringParser.ts",
      "status": "pending",
      "activeForm": "Adding error handling to time parser"
    },
    {
      "content": "Add error handling to sessionTracker.ts",
      "status": "pending",
      "activeForm": "Adding error handling to session tracker"
    },
    {
      "content": "Add error handling to content/index.ts",
      "status": "pending",
      "activeForm": "Adding error handling to content script"
    },
    {
      "content": "Update utils/index.ts with new exports",
      "status": "pending",
      "activeForm": "Updating utility exports"
    },
    {
      "content": "Create and run Playwright verification test",
      "status": "pending",
      "activeForm": "Verifying with Playwright test"
    }
  ]
}
Now let me update the domDetector.ts with comprehensive error handling:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * DOM Element Detector - Identifies and locates usage statistics sections\n *\n * This module provides robust selectors to find session and weekly usage\n * containers, timer elements, and percentage displays on the Claude.ai\n * usage settings page.\n *\n * Updated to match Claude.ai's actual page structure (January 2026):\n * - Session: \"Current session\" with \"Resets in X hr Y min\" and \"XX% used\"\n * - Weekly: \"All models\" with \"Resets Thu 8:00 AM\" and \"XX% used\"\n */",
  "new_string": "/**\n * DOM Element Detector - Identifies and locates usage statistics sections\n *\n * This module provides robust selectors to find session and weekly usage\n * containers, timer elements, and percentage displays on the Claude.ai\n * usage settings page.\n *\n * Updated to match Claude.ai's actual page structure (January 2026):\n * - Session: \"Current session\" with \"Resets in X hr Y min\" and \"XX% used\"\n * - Weekly: \"All models\" with \"Resets Thu 8:00 AM\" and \"XX% used\"\n *\n * Includes comprehensive error handling for:\n * - Page not fully loaded\n * - Missing DOM elements\n * - Unexpected page structure changes\n */\n\nimport {\n  getErrorHandler,\n  ErrorCodes,\n  safeQuerySelectorAll,\n  safeGetTextContent,\n  safeSetAttribute,\n  isElementInDOM,\n  validatePageState,\n  type TrackerError,\n} from './errorHandler';"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts"
}

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * DOM Element Detector - Identifies and locates usage statistics sections\n *\n * This module provides robust selectors to find session and weekly usage\n * containers, timer elements, and percentage displays on the Claude.ai\n * usage settings page.\n *\n * Updated to match Claude.ai's actual page structure (January 2026):\n * - Session: \"Current session\" with \"Resets in X hr Y min\" and \"XX% used\"\n * - Weekly: \"All models\" with \"Resets Thu 8:00 AM\" and \"XX% used\"\n */",
  "new_string": "/**\n * DOM Element Detector - Identifies and locates usage statistics sections\n *\n * This module provides robust selectors to find session and weekly usage\n * containers, timer elements, and percentage displays on the Claude.ai\n * usage settings page.\n *\n * Updated to match Claude.ai's actual page structure (January 2026):\n * - Session: \"Current session\" with \"Resets in X hr Y min\" and \"XX% used\"\n * - Weekly: \"All models\" with \"Resets Thu 8:00 AM\" and \"XX% used\"\n *\n * Includes comprehensive error handling for:\n * - Page not fully loaded\n * - Missing DOM elements\n * - Unexpected page structure changes\n */\n\nimport {\n  getErrorHandler,\n  ErrorCodes,\n  safeSetAttribute,\n  isElementInDOM,\n  validatePageState,\n  type TrackerError,\n} from './errorHandler';"
}
Now let me update the DOMDetectionResult interface and add error tracking:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Result of DOM element detection\n */\nexport interface DOMDetectionResult {\n  /** Container element for session usage section */\n  sessionContainer: HTMLElement | null;\n  /** Container element for weekly usage section */\n  weeklyContainer: HTMLElement | null;\n  /** Element displaying session usage percentage */\n  sessionPercentage: HTMLElement | null;\n  /** Element displaying session timer/countdown */\n  sessionTimer: HTMLElement | null;\n  /** Element displaying weekly usage percentage */\n  weeklyPercentage: HTMLElement | null;\n  /** Element displaying weekly timer/reset time */\n  weeklyTimer: HTMLElement | null;\n  /** Flag indicating if detection was successful */\n  isValid: boolean;\n}",
  "new_string": "/**\n * Result of DOM element detection\n */\nexport interface DOMDetectionResult {\n  /** Container element for session usage section */\n  sessionContainer: HTMLElement | null;\n  /** Container element for weekly usage section */\n  weeklyContainer: HTMLElement | null;\n  /** Element displaying session usage percentage */\n  sessionPercentage: HTMLElement | null;\n  /** Element displaying session timer/countdown */\n  sessionTimer: HTMLElement | null;\n  /** Element displaying weekly usage percentage */\n  weeklyPercentage: HTMLElement | null;\n  /** Element displaying weekly timer/reset time */\n  weeklyTimer: HTMLElement | null;\n  /** Flag indicating if detection was successful */\n  isValid: boolean;\n  /** Any errors encountered during detection */\n  errors: TrackerError[];\n  /** Whether detection was degraded (partial results) */\n  degraded: boolean;\n}"
}
Now let me update the debug/warn log functions to use the error handler:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Logs a debug message with the extension prefix\n */\nfunction debugLog(message: string, ...args: unknown[]): void {\n  console.log(`[Claude Usage Tracker] ${message}`, ...args);\n}\n\n/**\n * Logs a warning message with the extension prefix\n */\nfunction warnLog(message: string, ...args: unknown[]): void {\n  console.warn(`[Claude Usage Tracker] ${message}`, ...args);\n}",
  "new_string": "/**\n * Logs a debug message with the extension prefix\n */\nfunction debugLog(message: string, ...args: unknown[]): void {\n  const handler = getErrorHandler();\n  handler.debug(message, args.length > 0 ? { details: args } : undefined);\n}\n\n/**\n * Logs a warning message with the extension prefix\n */\nfunction warnLog(message: string, ...args: unknown[]): void {\n  const handler = getErrorHandler();\n  handler.warn(message, args.length > 0 ? { details: args } : undefined);\n}\n\n/**\n * Logs an error message with the extension prefix\n */\nfunction errorLog(message: string, context?: Record<string, unknown>): void {\n  const handler = getErrorHandler();\n  handler.error(message, context);\n}"
}
Now let me update the findUsageRowByText function to add error handling:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Find the row container element that contains both timer and percentage\n * Claude.ai uses flex-row containers with class pattern: \"w-full flex flex-row\"\n */\nfunction findUsageRowByText(labelPattern: RegExp): HTMLElement | null {\n  // Look for all divs that might be row containers\n  const allDivs = document.querySelectorAll<HTMLElement>('div');\n\n  for (const div of allDivs) {\n    const text = div.textContent || '';\n    const classList = div.className || '';\n\n    // Check if this div matches our label pattern AND contains percentage data\n    if (labelPattern.test(text) && /\\d+%/.test(text)) {\n      // Prefer flex-row containers (Claude.ai's actual structure)\n      if (classList.includes('flex') && classList.includes('flex-row')) {\n        debugLog(`Found usage row via flex-row pattern: \"${text.slice(0, 60)}...\"`);\n        return div;\n      }\n    }\n  }\n\n  // Fallback: find any container with the pattern\n  for (const div of allDivs) {\n    const text = div.textContent || '';\n    if (labelPattern.test(text) && /\\d+%/.test(text) && text.length < 200) {\n      debugLog(`Found usage row via fallback: \"${text.slice(0, 60)}...\"`);\n      return div;\n    }\n  }\n\n  return null;\n}",
  "new_string": "/**\n * Find the row container element that contains both timer and percentage\n * Claude.ai uses flex-row containers with class pattern: \"w-full flex flex-row\"\n */\nfunction findUsageRowByText(labelPattern: RegExp, errors: TrackerError[]): HTMLElement | null {\n  const handler = getErrorHandler();\n\n  // Check if document is available\n  if (typeof document === 'undefined' || !document.body) {\n    const error = handler.createError(\n      ErrorCodes.DOCUMENT_NOT_AVAILABLE,\n      'Document or body not available for DOM queries',\n      'page-load',\n      'error'\n    );\n    errors.push(error);\n    handler.logError(error);\n    return null;\n  }\n\n  try {\n    // Look for all divs that might be row containers\n    const allDivs = document.querySelectorAll<HTMLElement>('div');\n\n    if (allDivs.length === 0) {\n      const error = handler.createError(\n        ErrorCodes.ELEMENT_NOT_FOUND,\n        'No div elements found on page - page may not be fully loaded',\n        'page-structure',\n        'warning',\n        { pattern: labelPattern.toString() }\n      );\n      errors.push(error);\n      handler.logError(error);\n      return null;\n    }\n\n    for (const div of allDivs) {\n      const text = div.textContent || '';\n      const classList = div.className || '';\n\n      // Check if this div matches our label pattern AND contains percentage data\n      if (labelPattern.test(text) && /\\d+%/.test(text)) {\n        // Prefer flex-row containers (Claude.ai's actual structure)\n        if (classList.includes('flex') && classList.includes('flex-row')) {\n          debugLog(`Found usage row via flex-row pattern: \"${text.slice(0, 60)}...\"`);\n          return div;\n        }\n      }\n    }\n\n    // Fallback: find any container with the pattern\n    for (const div of allDivs) {\n      const text = div.textContent || '';\n      if (labelPattern.test(text) && /\\d+%/.test(text) && text.length < 200) {\n        debugLog(`Found usage row via fallback: \"${text.slice(0, 60)}...\"`);\n        return div;\n      }\n    }\n\n    // Element not found - this may indicate page structure change\n    debugLog(`No usage row found for pattern: ${labelPattern.toString()}`);\n    return null;\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.ELEMENT_NOT_FOUND,\n      `Error searching for usage row: ${e instanceof Error ? e.message : String(e)}`,\n      'dom-element',\n      'error',\n      { pattern: labelPattern.toString() },\n      e instanceof Error ? e : new Error(String(e))\n    );\n    errors.push(error);\n    handler.logError(error);\n    return null;\n  }\n}"
}
Now let me update the findPercentageElement and findTimerElement functions:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Find the percentage element within a container\n * Looks for elements with text like \"44% used\" or just \"44%\"\n */\nfunction findPercentageElement(container: HTMLElement): HTMLElement | null {\n  // Look for P elements with percentage text (Claude.ai uses P tags)\n  const paragraphs = container.querySelectorAll<HTMLElement>('p, span, div');\n\n  for (const el of paragraphs) {\n    const text = el.textContent?.trim() || '';\n\n    // Match \"XX% used\" pattern (Claude.ai's format)\n    if (/^\\d+%\\s*used$/i.test(text)) {\n      debugLog(`Found percentage element: \"${text}\"`);\n      return el;\n    }\n  }\n\n  // Fallback: look for any element with just percentage\n  for (const el of paragraphs) {\n    const text = el.textContent?.trim() || '';\n    if (/^\\d+(\\.\\d+)?%$/.test(text)) {\n      debugLog(`Found percentage element (fallback): \"${text}\"`);\n      return el;\n    }\n  }\n\n  return null;\n}",
  "new_string": "/**\n * Find the percentage element within a container\n * Looks for elements with text like \"44% used\" or just \"44%\"\n */\nfunction findPercentageElement(container: HTMLElement, errors: TrackerError[]): HTMLElement | null {\n  const handler = getErrorHandler();\n\n  if (!container || !isElementInDOM(container)) {\n    const error = handler.createError(\n      ErrorCodes.ELEMENT_REMOVED,\n      'Container element is null or has been removed from DOM',\n      'dom-element',\n      'warning'\n    );\n    errors.push(error);\n    handler.logError(error);\n    return null;\n  }\n\n  try {\n    // Look for P elements with percentage text (Claude.ai uses P tags)\n    const paragraphs = container.querySelectorAll<HTMLElement>('p, span, div');\n\n    for (const el of paragraphs) {\n      const text = el.textContent?.trim() || '';\n\n      // Match \"XX% used\" pattern (Claude.ai's format)\n      if (/^\\d+%\\s*used$/i.test(text)) {\n        debugLog(`Found percentage element: \"${text}\"`);\n        return el;\n      }\n    }\n\n    // Fallback: look for any element with just percentage\n    for (const el of paragraphs) {\n      const text = el.textContent?.trim() || '';\n      if (/^\\d+(\\.\\d+)?%$/.test(text)) {\n        debugLog(`Found percentage element (fallback): \"${text}\"`);\n        return el;\n      }\n    }\n\n    // Not found - log but don't add to errors (expected in some cases)\n    debugLog('No percentage element found in container');\n    return null;\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.MISSING_PERCENTAGE,\n      `Error finding percentage element: ${e instanceof Error ? e.message : String(e)}`,\n      'dom-element',\n      'warning',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    );\n    errors.push(error);\n    handler.logError(error);\n    return null;\n  }\n}"
}

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Find the timer element within a container\n * Looks for elements with text like \"Resets in 1 hr 44 min\" or \"Resets Thu 8:00 AM\"\n */\nfunction findTimerElement(container: HTMLElement): HTMLElement | null {\n  const paragraphs = container.querySelectorAll<HTMLElement>('p, span, div');\n\n  for (const el of paragraphs) {\n    const text = el.textContent?.trim() || '';\n\n    // Match \"Resets in X hr Y min\" pattern (session timer)\n    if (/^resets?\\s+in\\s+\\d+/i.test(text)) {\n      debugLog(`Found timer element (relative): \"${text}\"`);\n      return el;\n    }\n\n    // Match \"Resets Thu 8:00 AM\" pattern (weekly reset)\n    if (/^resets?\\s+(mon|tue|wed|thu|fri|sat|sun)/i.test(text)) {\n      debugLog(`Found timer element (absolute): \"${text}\"`);\n      return el;\n    }\n  }\n\n  return null;\n}",
  "new_string": "/**\n * Find the timer element within a container\n * Looks for elements with text like \"Resets in 1 hr 44 min\" or \"Resets Thu 8:00 AM\"\n */\nfunction findTimerElement(container: HTMLElement, errors: TrackerError[]): HTMLElement | null {\n  const handler = getErrorHandler();\n\n  if (!container || !isElementInDOM(container)) {\n    const error = handler.createError(\n      ErrorCodes.ELEMENT_REMOVED,\n      'Container element is null or has been removed from DOM',\n      'dom-element',\n      'warning'\n    );\n    errors.push(error);\n    handler.logError(error);\n    return null;\n  }\n\n  try {\n    const paragraphs = container.querySelectorAll<HTMLElement>('p, span, div');\n\n    for (const el of paragraphs) {\n      const text = el.textContent?.trim() || '';\n\n      // Match \"Resets in X hr Y min\" pattern (session timer)\n      if (/^resets?\\s+in\\s+\\d+/i.test(text)) {\n        debugLog(`Found timer element (relative): \"${text}\"`);\n        return el;\n      }\n\n      // Match \"Resets Thu 8:00 AM\" pattern (weekly reset)\n      if (/^resets?\\s+(mon|tue|wed|thu|fri|sat|sun)/i.test(text)) {\n        debugLog(`Found timer element (absolute): \"${text}\"`);\n        return el;\n      }\n    }\n\n    // Not found - log but don't add to errors (expected in some cases)\n    debugLog('No timer element found in container');\n    return null;\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.MISSING_TIMER,\n      `Error finding timer element: ${e instanceof Error ? e.message : String(e)}`,\n      'dom-element',\n      'warning',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    );\n    errors.push(error);\n    handler.logError(error);\n    return null;\n  }\n}"
}
Now let me update the detectUsageSections function:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Detect usage section containers using the actual Claude.ai page structure\n */\nfunction detectUsageSections(): {\n  sessionContainer: HTMLElement | null;\n  weeklyContainer: HTMLElement | null;\n} {\n  let sessionContainer: HTMLElement | null = null;\n  let weeklyContainer: HTMLElement | null = null;\n\n  // Strategy 1: Find session row by \"Current session\" + \"Resets in\" pattern\n  sessionContainer = findUsageRowByText(/current\\s*session/i);\n\n  // Strategy 2: Find weekly row by \"All models\" + \"Resets [day]\" pattern\n  weeklyContainer = findUsageRowByText(/all\\s*models/i);\n\n  // Fallback: Try finding by \"Resets in\" (session) vs \"Resets [day]\" (weekly)\n  if (!sessionContainer) {\n    // Look for container with relative time (session uses \"Resets in X hr Y min\")\n    const allDivs = document.querySelectorAll<HTMLElement>('div');\n    for (const div of allDivs) {\n      const text = div.textContent || '';\n      if (/resets?\\s+in\\s+\\d+\\s*(hr|min)/i.test(text) && /\\d+%/.test(text)) {\n        if (div.className.includes('flex-row') || text.length < 200) {\n          sessionContainer = div;\n          debugLog('Found session container via \"Resets in\" pattern');\n          break;\n        }\n      }\n    }\n  }\n\n  if (!weeklyContainer) {\n    // Look for container with absolute time (weekly uses \"Resets Thu 8:00 AM\")\n    const allDivs = document.querySelectorAll<HTMLElement>('div');\n    for (const div of allDivs) {\n      const text = div.textContent || '';\n      // Match day of week pattern for weekly reset\n      if (/resets?\\s+(mon|tue|wed|thu|fri|sat|sun)/i.test(text) && /\\d+%/.test(text)) {\n        if (div.className.includes('flex-row') || text.length < 200) {\n          weeklyContainer = div;\n          debugLog('Found weekly container via \"Resets [day]\" pattern');\n          break;\n        }\n      }\n    }\n  }\n\n  return { sessionContainer, weeklyContainer };\n}",
  "new_string": "/**\n * Detect usage section containers using the actual Claude.ai page structure\n */\nfunction detectUsageSections(errors: TrackerError[]): {\n  sessionContainer: HTMLElement | null;\n  weeklyContainer: HTMLElement | null;\n} {\n  const handler = getErrorHandler();\n  let sessionContainer: HTMLElement | null = null;\n  let weeklyContainer: HTMLElement | null = null;\n\n  // Check page state first\n  const pageState = validatePageState();\n  if (!pageState.isReady) {\n    const error = handler.createError(\n      ErrorCodes.PAGE_NOT_READY,\n      `Page not fully loaded. State: ${pageState.documentState}`,\n      'page-load',\n      'warning',\n      { documentState: pageState.documentState }\n    );\n    errors.push(error);\n    handler.logError(error);\n    // Continue anyway - might still find elements\n  }\n\n  if (!pageState.isUsagePage) {\n    const error = handler.createError(\n      ErrorCodes.WRONG_PAGE,\n      'Not on the Claude.ai usage settings page',\n      'page-load',\n      'info'\n    );\n    errors.push(error);\n    // Don't log as error - this is expected behavior\n  }\n\n  try {\n    // Strategy 1: Find session row by \"Current session\" + \"Resets in\" pattern\n    sessionContainer = findUsageRowByText(/current\\s*session/i, errors);\n\n    // Strategy 2: Find weekly row by \"All models\" + \"Resets [day]\" pattern\n    weeklyContainer = findUsageRowByText(/all\\s*models/i, errors);\n\n    // Fallback: Try finding by \"Resets in\" (session) vs \"Resets [day]\" (weekly)\n    if (!sessionContainer) {\n      // Look for container with relative time (session uses \"Resets in X hr Y min\")\n      const allDivs = document.querySelectorAll<HTMLElement>('div');\n      for (const div of allDivs) {\n        const text = div.textContent || '';\n        if (/resets?\\s+in\\s+\\d+\\s*(hr|min)/i.test(text) && /\\d+%/.test(text)) {\n          if (div.className.includes('flex-row') || text.length < 200) {\n            sessionContainer = div;\n            debugLog('Found session container via \"Resets in\" pattern');\n            break;\n          }\n        }\n      }\n    }\n\n    if (!weeklyContainer) {\n      // Look for container with absolute time (weekly uses \"Resets Thu 8:00 AM\")\n      const allDivs = document.querySelectorAll<HTMLElement>('div');\n      for (const div of allDivs) {\n        const text = div.textContent || '';\n        // Match day of week pattern for weekly reset\n        if (/resets?\\s+(mon|tue|wed|thu|fri|sat|sun)/i.test(text) && /\\d+%/.test(text)) {\n          if (div.className.includes('flex-row') || text.length < 200) {\n            weeklyContainer = div;\n            debugLog('Found weekly container via \"Resets [day]\" pattern');\n            break;\n          }\n        }\n      }\n    }\n\n    // Log if both containers are missing - may indicate page structure change\n    if (!sessionContainer && !weeklyContainer) {\n      const error = handler.createError(\n        ErrorCodes.STRUCTURE_CHANGED,\n        'Neither session nor weekly usage containers found - page structure may have changed',\n        'page-structure',\n        'warning'\n      );\n      errors.push(error);\n      handler.logError(error);\n    }\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.STRUCTURE_CHANGED,\n      `Error detecting usage sections: ${e instanceof Error ? e.message : String(e)}`,\n      'page-structure',\n      'error',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    );\n    errors.push(error);\n    handler.logError(error);\n  }\n\n  return { sessionContainer, weeklyContainer };\n}"
}
Now let me update the main detectUsageElements function:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Main detection function - identifies and locates all usage statistics elements\n *\n * @param config Optional custom selector configuration\n * @returns DOMDetectionResult containing all detected elements\n */\nexport function detectUsageElements(_config?: Partial<SelectorConfig>): DOMDetectionResult {\n  const result: DOMDetectionResult = {\n    sessionContainer: null,\n    weeklyContainer: null,\n    sessionPercentage: null,\n    sessionTimer: null,\n    weeklyPercentage: null,\n    weeklyTimer: null,\n    isValid: false,\n  };\n\n  debugLog('Starting DOM element detection...');\n\n  // Detect main usage sections using new strategy\n  const { sessionContainer, weeklyContainer } = detectUsageSections();\n  result.sessionContainer = sessionContainer;\n  result.weeklyContainer = weeklyContainer;\n\n  // Find percentage and timer elements within session container\n  if (sessionContainer) {\n    debugLog('Session container found, searching for child elements...');\n    result.sessionPercentage = findPercentageElement(sessionContainer);\n    result.sessionTimer = findTimerElement(sessionContainer);\n  } else {\n    debugLog('No session container found');\n  }\n\n  // Find percentage and timer elements within weekly container\n  if (weeklyContainer) {\n    debugLog('Weekly container found, searching for child elements...');\n    result.weeklyPercentage = findPercentageElement(weeklyContainer);\n    result.weeklyTimer = findTimerElement(weeklyContainer);\n  } else {\n    debugLog('No weekly container found');\n  }\n\n  // Determine if detection was successful - require at least one percentage element\n  result.isValid = !!(\n    result.sessionPercentage ||\n    result.weeklyPercentage\n  );\n\n  if (result.isValid) {\n    debugLog('DOM detection completed successfully');\n    debugLog('Detection results:', {\n      sessionContainer: !!result.sessionContainer,\n      weeklyContainer: !!result.weeklyContainer,\n      sessionPercentage: result.sessionPercentage?.textContent?.trim(),\n      sessionTimer: result.sessionTimer?.textContent?.trim(),\n      weeklyPercentage: result.weeklyPercentage?.textContent?.trim(),\n      weeklyTimer: result.weeklyTimer?.textContent?.trim(),\n    });\n  } else {\n    warnLog('DOM detection failed - no usage elements found');\n  }\n\n  return result;\n}",
  "new_string": "/**\n * Main detection function - identifies and locates all usage statistics elements\n *\n * @param config Optional custom selector configuration\n * @returns DOMDetectionResult containing all detected elements\n */\nexport function detectUsageElements(_config?: Partial<SelectorConfig>): DOMDetectionResult {\n  const errors: TrackerError[] = [];\n  const handler = getErrorHandler();\n\n  const result: DOMDetectionResult = {\n    sessionContainer: null,\n    weeklyContainer: null,\n    sessionPercentage: null,\n    sessionTimer: null,\n    weeklyPercentage: null,\n    weeklyTimer: null,\n    isValid: false,\n    errors: [],\n    degraded: false,\n  };\n\n  debugLog('Starting DOM element detection...');\n\n  try {\n    // Detect main usage sections using new strategy\n    const { sessionContainer, weeklyContainer } = detectUsageSections(errors);\n    result.sessionContainer = sessionContainer;\n    result.weeklyContainer = weeklyContainer;\n\n    // Find percentage and timer elements within session container\n    if (sessionContainer) {\n      debugLog('Session container found, searching for child elements...');\n      result.sessionPercentage = findPercentageElement(sessionContainer, errors);\n      result.sessionTimer = findTimerElement(sessionContainer, errors);\n    } else {\n      debugLog('No session container found');\n    }\n\n    // Find percentage and timer elements within weekly container\n    if (weeklyContainer) {\n      debugLog('Weekly container found, searching for child elements...');\n      result.weeklyPercentage = findPercentageElement(weeklyContainer, errors);\n      result.weeklyTimer = findTimerElement(weeklyContainer, errors);\n    } else {\n      debugLog('No weekly container found');\n    }\n\n    // Determine if detection was successful - require at least one percentage element\n    result.isValid = !!(\n      result.sessionPercentage ||\n      result.weeklyPercentage\n    );\n\n    // Determine if results are degraded (partial success)\n    const hasSession = !!(result.sessionPercentage && result.sessionTimer);\n    const hasWeekly = !!(result.weeklyPercentage && result.weeklyTimer);\n    result.degraded = result.isValid && (!hasSession || !hasWeekly);\n\n    if (result.isValid) {\n      debugLog('DOM detection completed successfully');\n      debugLog('Detection results:', {\n        sessionContainer: !!result.sessionContainer,\n        weeklyContainer: !!result.weeklyContainer,\n        sessionPercentage: result.sessionPercentage?.textContent?.trim(),\n        sessionTimer: result.sessionTimer?.textContent?.trim(),\n        weeklyPercentage: result.weeklyPercentage?.textContent?.trim(),\n        weeklyTimer: result.weeklyTimer?.textContent?.trim(),\n        degraded: result.degraded,\n        errorCount: errors.length,\n      });\n    } else {\n      warnLog('DOM detection failed - no usage elements found');\n    }\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.STRUCTURE_CHANGED,\n      `Unexpected error during DOM detection: ${e instanceof Error ? e.message : String(e)}`,\n      'dom-element',\n      'error',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    );\n    errors.push(error);\n    handler.logError(error);\n  }\n\n  // Attach collected errors to result\n  result.errors = errors;\n\n  return result;\n}"
}
Now let me update the waitForUsageElements function and the remaining functions:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Wait for usage elements to appear in the DOM\n * Useful for dynamically loaded content\n *\n * @param timeout Maximum time to wait in milliseconds\n * @param pollInterval How often to check for elements\n * @returns Promise resolving to DOMDetectionResult\n */\nexport async function waitForUsageElements(\n  timeout: number = 10000,\n  pollInterval: number = 500\n): Promise<DOMDetectionResult> {\n  const startTime = Date.now();\n\n  return new Promise((resolve) => {\n    const checkElements = () => {\n      const result = detectUsageElements();\n\n      if (result.isValid) {\n        debugLog('Found usage elements after waiting');\n        resolve(result);\n        return;\n      }\n\n      if (Date.now() - startTime >= timeout) {\n        warnLog(`Timeout waiting for usage elements after ${timeout}ms`);\n        resolve(result);\n        return;\n      }\n\n      setTimeout(checkElements, pollInterval);\n    };\n\n    checkElements();\n  });\n}",
  "new_string": "/**\n * Wait for usage elements to appear in the DOM\n * Useful for dynamically loaded content\n *\n * @param timeout Maximum time to wait in milliseconds\n * @param pollInterval How often to check for elements\n * @returns Promise resolving to DOMDetectionResult\n */\nexport async function waitForUsageElements(\n  timeout: number = 10000,\n  pollInterval: number = 500\n): Promise<DOMDetectionResult> {\n  const handler = getErrorHandler();\n  const startTime = Date.now();\n\n  return new Promise((resolve) => {\n    const checkElements = () => {\n      try {\n        const result = detectUsageElements();\n\n        if (result.isValid) {\n          debugLog('Found usage elements after waiting');\n          resolve(result);\n          return;\n        }\n\n        const elapsed = Date.now() - startTime;\n        if (elapsed >= timeout) {\n          const error = handler.createError(\n            ErrorCodes.PAGE_LOAD_TIMEOUT,\n            `Timeout waiting for usage elements after ${timeout}ms`,\n            'page-load',\n            'warning',\n            { elapsed, timeout }\n          );\n          handler.logError(error);\n          result.errors.push(error);\n          resolve(result);\n          return;\n        }\n\n        setTimeout(checkElements, pollInterval);\n      } catch (e) {\n        // In case of unexpected error, return empty result with error\n        const error = handler.createError(\n          ErrorCodes.STRUCTURE_CHANGED,\n          `Unexpected error while waiting for elements: ${e instanceof Error ? e.message : String(e)}`,\n          'dom-element',\n          'error',\n          undefined,\n          e instanceof Error ? e : new Error(String(e))\n        );\n        handler.logError(error);\n\n        resolve({\n          sessionContainer: null,\n          weeklyContainer: null,\n          sessionPercentage: null,\n          sessionTimer: null,\n          weeklyPercentage: null,\n          weeklyTimer: null,\n          isValid: false,\n          errors: [error],\n          degraded: false,\n        });\n      }\n    };\n\n    checkElements();\n  });\n}"
}
Now let me update the extractTextFromElements function:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Extract text content from detected elements\n */\nexport interface ExtractedUsageData {\n  sessionPercentageText: string | null;\n  sessionTimerText: string | null;\n  weeklyPercentageText: string | null;\n  weeklyTimerText: string | null;\n}\n\n/**\n * Extract and normalize text content from all detected elements\n *\n * @param detection The detection result to extract from\n * @returns Extracted text content\n */\nexport function extractTextFromElements(detection: DOMDetectionResult): ExtractedUsageData {\n  // Helper to extract just the percentage number from \"XX% used\" format\n  const extractPercentage = (text: string | null): string | null => {\n    if (!text) return null;\n    const match = text.match(/(\\d+(?:\\.\\d+)?)\\s*%/);\n    return match ? `${match[1]}%` : text.trim();\n  };\n\n  // Helper to extract timer text, removing \"Resets \" prefix if present\n  const extractTimer = (text: string | null): string | null => {\n    if (!text) return null;\n    // Keep the full text for parsing - the parser handles \"Resets in X hr Y min\"\n    return text.trim();\n  };\n\n  return {\n    sessionPercentageText: extractPercentage(detection.sessionPercentage?.textContent ?? null),\n    sessionTimerText: extractTimer(detection.sessionTimer?.textContent ?? null),\n    weeklyPercentageText: extractPercentage(detection.weeklyPercentage?.textContent ?? null),\n    weeklyTimerText: extractTimer(detection.weeklyTimer?.textContent ?? null),\n  };\n}",
  "new_string": "/**\n * Extract text content from detected elements\n */\nexport interface ExtractedUsageData {\n  sessionPercentageText: string | null;\n  sessionTimerText: string | null;\n  weeklyPercentageText: string | null;\n  weeklyTimerText: string | null;\n  /** Any errors encountered during text extraction */\n  extractionErrors: TrackerError[];\n}\n\n/**\n * Extract and normalize text content from all detected elements\n *\n * @param detection The detection result to extract from\n * @returns Extracted text content\n */\nexport function extractTextFromElements(detection: DOMDetectionResult): ExtractedUsageData {\n  const handler = getErrorHandler();\n  const extractionErrors: TrackerError[] = [];\n\n  // Helper to safely extract text from an element\n  const safeGetText = (element: HTMLElement | null, fieldName: string): string | null => {\n    if (!element) return null;\n\n    try {\n      // Check if element is still in DOM\n      if (!isElementInDOM(element)) {\n        const error = handler.createError(\n          ErrorCodes.ELEMENT_REMOVED,\n          `Element for ${fieldName} was removed from DOM`,\n          'dom-element',\n          'warning',\n          { field: fieldName }\n        );\n        extractionErrors.push(error);\n        handler.logError(error);\n        return null;\n      }\n\n      return element.textContent ?? null;\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.TEXT_EXTRACTION_FAILED,\n        `Failed to extract text for ${fieldName}: ${e instanceof Error ? e.message : String(e)}`,\n        'dom-element',\n        'warning',\n        { field: fieldName },\n        e instanceof Error ? e : new Error(String(e))\n      );\n      extractionErrors.push(error);\n      handler.logError(error);\n      return null;\n    }\n  };\n\n  // Helper to extract just the percentage number from \"XX% used\" format\n  const extractPercentage = (text: string | null, fieldName: string): string | null => {\n    if (!text) return null;\n    try {\n      const match = text.match(/(\\d+(?:\\.\\d+)?)\\s*%/);\n      if (!match) {\n        const error = handler.createError(\n          ErrorCodes.PERCENTAGE_PARSE_FAILED,\n          `No percentage found in text for ${fieldName}: \"${text}\"`,\n          'parsing',\n          'debug',\n          { field: fieldName, text }\n        );\n        extractionErrors.push(error);\n        // Don't log debug-level errors\n        return text.trim();\n      }\n      return `${match[1]}%`;\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.PERCENTAGE_PARSE_FAILED,\n        `Error parsing percentage for ${fieldName}`,\n        'parsing',\n        'warning',\n        { field: fieldName, text },\n        e instanceof Error ? e : new Error(String(e))\n      );\n      extractionErrors.push(error);\n      handler.logError(error);\n      return null;\n    }\n  };\n\n  // Helper to extract timer text, removing \"Resets \" prefix if present\n  const extractTimer = (text: string | null): string | null => {\n    if (!text) return null;\n    // Keep the full text for parsing - the parser handles \"Resets in X hr Y min\"\n    return text.trim();\n  };\n\n  return {\n    sessionPercentageText: extractPercentage(\n      safeGetText(detection.sessionPercentage, 'sessionPercentage'),\n      'sessionPercentage'\n    ),\n    sessionTimerText: extractTimer(\n      safeGetText(detection.sessionTimer, 'sessionTimer')\n    ),\n    weeklyPercentageText: extractPercentage(\n      safeGetText(detection.weeklyPercentage, 'weeklyPercentage'),\n      'weeklyPercentage'\n    ),\n    weeklyTimerText: extractTimer(\n      safeGetText(detection.weeklyTimer, 'weeklyTimer')\n    ),\n    extractionErrors,\n  };\n}"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts"
}
The linter removed the `safeSetAttribute` import since it wasn't being used. Let me now update the extractTextFromElements function with improved error handling:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Extract text content from detected elements\n */\nexport interface ExtractedUsageData {\n  sessionPercentageText: string | null;\n  sessionTimerText: string | null;\n  weeklyPercentageText: string | null;\n  weeklyTimerText: string | null;\n}\n\n/**\n * Extract and normalize text content from all detected elements\n *\n * @param detection The detection result to extract from\n * @returns Extracted text content\n */\nexport function extractTextFromElements(detection: DOMDetectionResult): ExtractedUsageData {\n  // Helper to extract just the percentage number from \"XX% used\" format\n  const extractPercentage = (text: string | null): string | null => {\n    if (!text) return null;\n    const match = text.match(/(\\d+(?:\\.\\d+)?)\\s*%/);\n    return match ? `${match[1]}%` : text.trim();\n  };\n\n  // Helper to extract timer text, removing \"Resets \" prefix if present\n  const extractTimer = (text: string | null): string | null => {\n    if (!text) return null;\n    // Keep the full text for parsing - the parser handles \"Resets in X hr Y min\"\n    return text.trim();\n  };\n\n  return {\n    sessionPercentageText: extractPercentage(detection.sessionPercentage?.textContent ?? null),\n    sessionTimerText: extractTimer(detection.sessionTimer?.textContent ?? null),\n    weeklyPercentageText: extractPercentage(detection.weeklyPercentage?.textContent ?? null),\n    weeklyTimerText: extractTimer(detection.weeklyTimer?.textContent ?? null),\n  };\n}",
  "new_string": "/**\n * Extract text content from detected elements\n */\nexport interface ExtractedUsageData {\n  sessionPercentageText: string | null;\n  sessionTimerText: string | null;\n  weeklyPercentageText: string | null;\n  weeklyTimerText: string | null;\n  /** Any errors encountered during text extraction */\n  extractionErrors: TrackerError[];\n}\n\n/**\n * Extract and normalize text content from all detected elements\n *\n * @param detection The detection result to extract from\n * @returns Extracted text content\n */\nexport function extractTextFromElements(detection: DOMDetectionResult): ExtractedUsageData {\n  const handler = getErrorHandler();\n  const extractionErrors: TrackerError[] = [];\n\n  // Helper to safely extract text from an element\n  const safeGetText = (element: HTMLElement | null, fieldName: string): string | null => {\n    if (!element) return null;\n\n    try {\n      // Check if element is still in DOM\n      if (!isElementInDOM(element)) {\n        const error = handler.createError(\n          ErrorCodes.ELEMENT_REMOVED,\n          `Element for ${fieldName} was removed from DOM`,\n          'dom-element',\n          'warning',\n          { field: fieldName }\n        );\n        extractionErrors.push(error);\n        handler.logError(error);\n        return null;\n      }\n\n      return element.textContent ?? null;\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.TEXT_EXTRACTION_FAILED,\n        `Failed to extract text for ${fieldName}: ${e instanceof Error ? e.message : String(e)}`,\n        'dom-element',\n        'warning',\n        { field: fieldName },\n        e instanceof Error ? e : new Error(String(e))\n      );\n      extractionErrors.push(error);\n      handler.logError(error);\n      return null;\n    }\n  };\n\n  // Helper to extract just the percentage number from \"XX% used\" format\n  const extractPercentage = (text: string | null, fieldName: string): string | null => {\n    if (!text) return null;\n    try {\n      const match = text.match(/(\\d+(?:\\.\\d+)?)\\s*%/);\n      if (!match) {\n        // Just log at debug level - may be expected in some cases\n        debugLog(`No percentage found in text for ${fieldName}: \"${text}\"`);\n        return text.trim();\n      }\n      return `${match[1]}%`;\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.PERCENTAGE_PARSE_FAILED,\n        `Error parsing percentage for ${fieldName}`,\n        'parsing',\n        'warning',\n        { field: fieldName, text },\n        e instanceof Error ? e : new Error(String(e))\n      );\n      extractionErrors.push(error);\n      handler.logError(error);\n      return null;\n    }\n  };\n\n  // Helper to extract timer text, removing \"Resets \" prefix if present\n  const extractTimer = (text: string | null): string | null => {\n    if (!text) return null;\n    // Keep the full text for parsing - the parser handles \"Resets in X hr Y min\"\n    return text.trim();\n  };\n\n  return {\n    sessionPercentageText: extractPercentage(\n      safeGetText(detection.sessionPercentage, 'sessionPercentage'),\n      'sessionPercentage'\n    ),\n    sessionTimerText: extractTimer(\n      safeGetText(detection.sessionTimer, 'sessionTimer')\n    ),\n    weeklyPercentageText: extractPercentage(\n      safeGetText(detection.weeklyPercentage, 'weeklyPercentage'),\n      'weeklyPercentage'\n    ),\n    weeklyTimerText: extractTimer(\n      safeGetText(detection.weeklyTimer, 'weeklyTimer')\n    ),\n    extractionErrors,\n  };\n}"
}
Now let me update the markDetectedElements function and isUsagePage with error handling:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/domDetector.ts",
  "old_string": "/**\n * Check if the current page is the Claude.ai usage settings page\n */\nexport function isUsagePage(): boolean {\n  return window.location.href.includes('claude.ai/settings/usage');\n}\n\n/**\n * Mark detected elements with data attributes for easier identification\n * Useful for styling and debugging\n *\n * @param detection The detection result to mark\n */\nexport function markDetectedElements(detection: DOMDetectionResult): void {\n  if (detection.sessionContainer) {\n    detection.sessionContainer.setAttribute('data-claude-usage-section', 'session');\n  }\n  if (detection.weeklyContainer) {\n    detection.weeklyContainer.setAttribute('data-claude-usage-section', 'weekly');\n  }\n  if (detection.sessionPercentage) {\n    detection.sessionPercentage.setAttribute('data-claude-usage-type', 'session-percentage');\n  }\n  if (detection.sessionTimer) {\n    detection.sessionTimer.setAttribute('data-claude-usage-type', 'session-timer');\n  }\n  if (detection.weeklyPercentage) {\n    detection.weeklyPercentage.setAttribute('data-claude-usage-type', 'weekly-percentage');\n  }\n  if (detection.weeklyTimer) {\n    detection.weeklyTimer.setAttribute('data-claude-usage-type', 'weekly-timer');\n  }\n\n  debugLog('Marked detected elements with data attributes');\n}",
  "new_string": "/**\n * Check if the current page is the Claude.ai usage settings page\n */\nexport function isUsagePage(): boolean {\n  try {\n    return window.location.href.includes('claude.ai/settings/usage');\n  } catch {\n    // Window or location may not be available\n    return false;\n  }\n}\n\n/**\n * Mark detected elements with data attributes for easier identification\n * Useful for styling and debugging\n *\n * @param detection The detection result to mark\n */\nexport function markDetectedElements(detection: DOMDetectionResult): void {\n  const handler = getErrorHandler();\n\n  const safeSetAttr = (element: HTMLElement | null, attr: string, value: string): void => {\n    if (!element) return;\n\n    try {\n      if (isElementInDOM(element)) {\n        element.setAttribute(attr, value);\n      }\n    } catch (e) {\n      handler.warn(`Failed to set attribute ${attr} on element`, {\n        error: e instanceof Error ? e.message : String(e),\n      });\n    }\n  };\n\n  safeSetAttr(detection.sessionContainer, 'data-claude-usage-section', 'session');\n  safeSetAttr(detection.weeklyContainer, 'data-claude-usage-section', 'weekly');\n  safeSetAttr(detection.sessionPercentage, 'data-claude-usage-type', 'session-percentage');\n  safeSetAttr(detection.sessionTimer, 'data-claude-usage-type', 'session-timer');\n  safeSetAttr(detection.weeklyPercentage, 'data-claude-usage-type', 'weekly-percentage');\n  safeSetAttr(detection.weeklyTimer, 'data-claude-usage-type', 'weekly-timer');\n\n  debugLog('Marked detected elements with data attributes');\n}"
}
Now let me update the utils/index.ts to export the new error handler module and update the todo list:

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Read and understand existing source files",
      "status": "completed",
      "activeForm": "Reading source files"
    },
    {
      "content": "Create error handling utility module",
      "status": "completed",
      "activeForm": "Creating error handling utility"
    },
    {
      "content": "Add error handling to domDetector.ts",
      "status": "completed",
      "activeForm": "Adding error handling to DOM detector"
    },
    {
      "content": "Add error handling to usageDataExtractor.ts",
      "status": "in_progress",
      "activeForm": "Adding error handling to data extractor"
    },
    {
      "content": "Add error handling to timeStringParser.ts",
      "status": "pending",
      "activeForm": "Adding error handling to time parser"
    },
    {
      "content": "Add error handling to sessionTracker.ts",
      "status": "pending",
      "activeForm": "Adding error handling to session tracker"
    },
    {
      "content": "Add error handling to content/index.ts",
      "status": "pending",
      "activeForm": "Adding error handling to content script"
    },
    {
      "content": "Update utils/index.ts with new exports",
      "status": "pending",
      "activeForm": "Updating utility exports"
    },
    {
      "content": "Create and run Playwright verification test",
      "status": "pending",
      "activeForm": "Verifying with Playwright test"
    }
  ]
}
Now let me update the usageDataExtractor.ts with error handling:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/usageDataExtractor.ts"
}
Now let me update the usageDataExtractor.ts with improved error handling:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/usageDataExtractor.ts",
  "old_string": "/**\n * Usage Data Extractor - Extracts and parses usage data from Claude.ai usage page\n *\n * This module takes raw text content from DOM elements and converts them into\n * structured, usable data including:\n * - Usage percentages (session and weekly)\n * - Remaining time values\n * - Reset information\n *\n * It serves as the bridge between DOM detection and calculation modules.\n */\n\nimport {\n  parseRelativeTime,\n  parseAbsoluteTime,\n  type RelativeTimeResult,\n  type AbsoluteTimeResult,\n  type ParsedTimeResult,\n} from './timeStringParser';\n\nimport {\n  analyzeSession,\n  type SessionAnalysisResult,\n} from './sessionTimeCalculator';\n\nimport {\n  parseResetTimeString,\n  calculateWeeklyTime,\n  calculateUsageEfficiency,\n  type WeeklyResetConfig,\n  type WeeklyTimeResult,\n  type UsageEfficiencyResult,\n} from './weeklyTimeCalculator';\n\nimport {\n  type ExtractedUsageData,\n} from './domDetector';",
  "new_string": "/**\n * Usage Data Extractor - Extracts and parses usage data from Claude.ai usage page\n *\n * This module takes raw text content from DOM elements and converts them into\n * structured, usable data including:\n * - Usage percentages (session and weekly)\n * - Remaining time values\n * - Reset information\n *\n * It serves as the bridge between DOM detection and calculation modules.\n *\n * Includes comprehensive error handling for:\n * - Invalid time formats\n * - Out-of-range percentages\n * - Parsing failures with graceful degradation\n */\n\nimport {\n  parseRelativeTime,\n  parseAbsoluteTime,\n  type RelativeTimeResult,\n  type AbsoluteTimeResult,\n  type ParsedTimeResult,\n} from './timeStringParser';\n\nimport {\n  analyzeSession,\n  type SessionAnalysisResult,\n} from './sessionTimeCalculator';\n\nimport {\n  parseResetTimeString,\n  calculateWeeklyTime,\n  calculateUsageEfficiency,\n  type WeeklyResetConfig,\n  type WeeklyTimeResult,\n  type UsageEfficiencyResult,\n} from './weeklyTimeCalculator';\n\nimport {\n  type ExtractedUsageData,\n} from './domDetector';\n\nimport {\n  getErrorHandler,\n  ErrorCodes,\n  type TrackerError,\n} from './errorHandler';"
}
Now let me update the parsePercentage function with better error handling:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/usageDataExtractor.ts",
  "old_string": "/**\n * Parse a percentage string into a numeric value\n *\n * Supports formats:\n * - \"75%\"\n * - \"75.5%\"\n * - \"75 %\" (with space)\n * - Just numeric values like \"75\"\n *\n * @param percentageStr - The percentage string to parse\n * @returns ParsedPercentage with the numeric value\n */\nexport function parsePercentage(percentageStr: string | null): ParsedPercentage | null {\n  if (!percentageStr || typeof percentageStr !== 'string') {\n    return null;\n  }\n\n  const trimmed = percentageStr.trim();\n\n  // Pattern to match percentages: \"75%\", \"75.5%\", \"75 %\"\n  const percentPattern = /^(\\d+(?:\\.\\d+)?)\\s*%?$/;\n  const match = trimmed.match(percentPattern);\n\n  if (!match) {\n    return {\n      value: 0,\n      originalString: percentageStr,\n      isValid: false,\n    };\n  }\n\n  const value = parseFloat(match[1]);\n\n  // Validate the value is within reasonable range\n  if (isNaN(value) || value < 0 || value > 100) {\n    return {\n      value: Math.max(0, Math.min(100, value || 0)),\n      originalString: percentageStr,\n      isValid: false,\n    };\n  }\n\n  return {\n    value,\n    originalString: percentageStr,\n    isValid: true,\n  };\n}",
  "new_string": "/**\n * Parse a percentage string into a numeric value\n *\n * Supports formats:\n * - \"75%\"\n * - \"75.5%\"\n * - \"75 %\" (with space)\n * - Just numeric values like \"75\"\n *\n * @param percentageStr - The percentage string to parse\n * @param errors - Optional array to collect errors\n * @returns ParsedPercentage with the numeric value\n */\nexport function parsePercentage(\n  percentageStr: string | null,\n  errors?: TrackerError[]\n): ParsedPercentage | null {\n  const handler = getErrorHandler();\n\n  if (!percentageStr || typeof percentageStr !== 'string') {\n    return null;\n  }\n\n  try {\n    const trimmed = percentageStr.trim();\n\n    // Pattern to match percentages: \"75%\", \"75.5%\", \"75 %\"\n    const percentPattern = /^(\\d+(?:\\.\\d+)?)\\s*%?$/;\n    const match = trimmed.match(percentPattern);\n\n    if (!match) {\n      const error = handler.createError(\n        ErrorCodes.PERCENTAGE_PARSE_FAILED,\n        `Failed to parse percentage: \"${percentageStr}\" - invalid format`,\n        'parsing',\n        'debug',\n        { input: percentageStr }\n      );\n      errors?.push(error);\n\n      return {\n        value: 0,\n        originalString: percentageStr,\n        isValid: false,\n      };\n    }\n\n    const value = parseFloat(match[1]);\n\n    // Validate the value is within reasonable range\n    if (isNaN(value)) {\n      const error = handler.createError(\n        ErrorCodes.PERCENTAGE_PARSE_FAILED,\n        `Failed to parse percentage: \"${percentageStr}\" - NaN value`,\n        'parsing',\n        'warning',\n        { input: percentageStr }\n      );\n      errors?.push(error);\n      handler.logError(error);\n\n      return {\n        value: 0,\n        originalString: percentageStr,\n        isValid: false,\n      };\n    }\n\n    if (value < 0 || value > 100) {\n      const clampedValue = Math.max(0, Math.min(100, value));\n      const error = handler.createError(\n        ErrorCodes.TIME_OUT_OF_RANGE,\n        `Percentage out of range: ${value}%, clamped to ${clampedValue}%`,\n        'parsing',\n        'debug',\n        { input: percentageStr, original: value, clamped: clampedValue }\n      );\n      errors?.push(error);\n\n      return {\n        value: clampedValue,\n        originalString: percentageStr,\n        isValid: true, // Still valid, just clamped\n      };\n    }\n\n    return {\n      value,\n      originalString: percentageStr,\n      isValid: true,\n    };\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.PERCENTAGE_PARSE_FAILED,\n      `Unexpected error parsing percentage: ${e instanceof Error ? e.message : String(e)}`,\n      'parsing',\n      'error',\n      { input: percentageStr },\n      e instanceof Error ? e : new Error(String(e))\n    );\n    errors?.push(error);\n    handler.logError(error);\n\n    return {\n      value: 0,\n      originalString: percentageStr,\n      isValid: false,\n    };\n  }\n}"
}
Now let me update the parseSessionTimer function:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/usageDataExtractor.ts",
  "old_string": "/**\n * Parse a session timer string (relative time like \"2 hr 48 min\" or \"Resets in 1 hr 44 min\")\n *\n * @param timerStr - The timer string to parse\n * @returns ParsedSessionTimer with the time data\n */\nexport function parseSessionTimer(timerStr: string | null): ParsedSessionTimer | null {\n  if (!timerStr || typeof timerStr !== 'string') {\n    return null;\n  }\n\n  let trimmed = timerStr.trim();\n\n  // Strip \"Resets in \" prefix if present (Claude.ai format)\n  trimmed = trimmed.replace(/^resets?\\s+in\\s+/i, '');\n\n  const timeResult = parseRelativeTime(trimmed);\n\n  if (!timeResult) {\n    return {\n      timeResult: null,\n      remainingMinutes: 0,\n      originalString: timerStr,\n      isValid: false,\n    };\n  }\n\n  return {\n    timeResult,\n    remainingMinutes: timeResult.totalMinutes,\n    originalString: timerStr,\n    isValid: true,\n  };\n}",
  "new_string": "/**\n * Parse a session timer string (relative time like \"2 hr 48 min\" or \"Resets in 1 hr 44 min\")\n *\n * @param timerStr - The timer string to parse\n * @param errors - Optional array to collect errors\n * @returns ParsedSessionTimer with the time data\n */\nexport function parseSessionTimer(\n  timerStr: string | null,\n  errors?: TrackerError[]\n): ParsedSessionTimer | null {\n  const handler = getErrorHandler();\n\n  if (!timerStr || typeof timerStr !== 'string') {\n    return null;\n  }\n\n  try {\n    let trimmed = timerStr.trim();\n\n    // Strip \"Resets in \" prefix if present (Claude.ai format)\n    trimmed = trimmed.replace(/^resets?\\s+in\\s+/i, '');\n\n    const timeResult = parseRelativeTime(trimmed);\n\n    if (!timeResult) {\n      const error = handler.createError(\n        ErrorCodes.TIMER_PARSE_FAILED,\n        `Failed to parse session timer: \"${timerStr}\" - invalid relative time format`,\n        'time-format',\n        'debug',\n        { input: timerStr, processed: trimmed }\n      );\n      errors?.push(error);\n\n      return {\n        timeResult: null,\n        remainingMinutes: 0,\n        originalString: timerStr,\n        isValid: false,\n      };\n    }\n\n    // Validate the parsed time makes sense (0-300 minutes for a 5-hour session)\n    if (timeResult.totalMinutes > 300) {\n      const error = handler.createError(\n        ErrorCodes.TIME_OUT_OF_RANGE,\n        `Session timer exceeds 5-hour session: ${timeResult.totalMinutes} minutes`,\n        'parsing',\n        'warning',\n        { input: timerStr, minutes: timeResult.totalMinutes }\n      );\n      errors?.push(error);\n      handler.logError(error);\n      // Still valid, just unexpected\n    }\n\n    return {\n      timeResult,\n      remainingMinutes: timeResult.totalMinutes,\n      originalString: timerStr,\n      isValid: true,\n    };\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.TIMER_PARSE_FAILED,\n      `Unexpected error parsing session timer: ${e instanceof Error ? e.message : String(e)}`,\n      'time-format',\n      'error',\n      { input: timerStr },\n      e instanceof Error ? e : new Error(String(e))\n    );\n    errors?.push(error);\n    handler.logError(error);\n\n    return {\n      timeResult: null,\n      remainingMinutes: 0,\n      originalString: timerStr,\n      isValid: false,\n    };\n  }\n}"
}
Now let me update the parseWeeklyResetTime function:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/usageDataExtractor.ts",
  "old_string": "/**\n * Parse a weekly reset time string (absolute time like \"Thu 7:59 AM\" or \"Resets Thu 8:00 AM\")\n *\n * @param resetStr - The reset time string to parse\n * @returns ParsedWeeklyReset with the reset data\n */\nexport function parseWeeklyResetTime(resetStr: string | null): ParsedWeeklyReset | null {\n  if (!resetStr || typeof resetStr !== 'string') {\n    return null;\n  }\n\n  let trimmed = resetStr.trim();\n\n  // Strip \"Resets \" prefix if present (Claude.ai format)\n  trimmed = trimmed.replace(/^resets?\\s+/i, '');\n\n  // Try parsing as absolute time first\n  const absoluteResult = parseAbsoluteTime(trimmed);\n\n  // Also try the reset config parser for more structured data\n  const resetConfig = parseResetTimeString(trimmed);\n\n  if (!absoluteResult && !resetConfig) {\n    return {\n      timeResult: null,\n      resetConfig: null,\n      resetDay: null,\n      resetHour: null,\n      resetMinute: null,\n      originalString: resetStr,\n      isValid: false,\n    };\n  }\n\n  return {\n    timeResult: absoluteResult,\n    resetConfig,\n    resetDay: absoluteResult?.dayOfWeek || resetConfig?.resetDay || null,\n    resetHour: absoluteResult?.hours ?? resetConfig?.resetHour ?? null,\n    resetMinute: absoluteResult?.minutes ?? resetConfig?.resetMinute ?? null,\n    originalString: resetStr,\n    isValid: true,\n  };\n}",
  "new_string": "/**\n * Parse a weekly reset time string (absolute time like \"Thu 7:59 AM\" or \"Resets Thu 8:00 AM\")\n *\n * @param resetStr - The reset time string to parse\n * @param errors - Optional array to collect errors\n * @returns ParsedWeeklyReset with the reset data\n */\nexport function parseWeeklyResetTime(\n  resetStr: string | null,\n  errors?: TrackerError[]\n): ParsedWeeklyReset | null {\n  const handler = getErrorHandler();\n\n  if (!resetStr || typeof resetStr !== 'string') {\n    return null;\n  }\n\n  try {\n    let trimmed = resetStr.trim();\n\n    // Strip \"Resets \" prefix if present (Claude.ai format)\n    trimmed = trimmed.replace(/^resets?\\s+/i, '');\n\n    // Try parsing as absolute time first\n    const absoluteResult = parseAbsoluteTime(trimmed);\n\n    // Also try the reset config parser for more structured data\n    const resetConfig = parseResetTimeString(trimmed);\n\n    if (!absoluteResult && !resetConfig) {\n      const error = handler.createError(\n        ErrorCodes.RESET_TIME_PARSE_FAILED,\n        `Failed to parse weekly reset time: \"${resetStr}\" - invalid format`,\n        'time-format',\n        'debug',\n        { input: resetStr, processed: trimmed }\n      );\n      errors?.push(error);\n\n      return {\n        timeResult: null,\n        resetConfig: null,\n        resetDay: null,\n        resetHour: null,\n        resetMinute: null,\n        originalString: resetStr,\n        isValid: false,\n      };\n    }\n\n    // Validate day of week if present\n    const dayOfWeek = absoluteResult?.dayOfWeek || resetConfig?.resetDay || null;\n    if (dayOfWeek) {\n      const validDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',\n        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];\n      if (!validDays.some(d => d.toLowerCase() === String(dayOfWeek).toLowerCase())) {\n        const error = handler.createError(\n          ErrorCodes.INVALID_DAY_OF_WEEK,\n          `Invalid day of week in reset time: \"${dayOfWeek}\"`,\n          'time-format',\n          'warning',\n          { input: resetStr, dayOfWeek }\n        );\n        errors?.push(error);\n        handler.logError(error);\n      }\n    }\n\n    return {\n      timeResult: absoluteResult,\n      resetConfig,\n      resetDay: dayOfWeek,\n      resetHour: absoluteResult?.hours ?? resetConfig?.resetHour ?? null,\n      resetMinute: absoluteResult?.minutes ?? resetConfig?.resetMinute ?? null,\n      originalString: resetStr,\n      isValid: true,\n    };\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.RESET_TIME_PARSE_FAILED,\n      `Unexpected error parsing weekly reset time: ${e instanceof Error ? e.message : String(e)}`,\n      'time-format',\n      'error',\n      { input: resetStr },\n      e instanceof Error ? e : new Error(String(e))\n    );\n    errors?.push(error);\n    handler.logError(error);\n\n    return {\n      timeResult: null,\n      resetConfig: null,\n      resetDay: null,\n      resetHour: null,\n      resetMinute: null,\n      originalString: resetStr,\n      isValid: false,\n    };\n  }\n}"
}
Now let me update the extractUsageData function and analyzeUsageData function:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/usageDataExtractor.ts",
  "old_string": "/**\n * Extract and parse all usage data from raw DOM text content\n *\n * @param rawData - The raw extracted text data from DOM elements\n * @returns ExtractedUsageResult with all parsed values\n */\nexport function extractUsageData(rawData: ExtractedUsageData): ExtractedUsageResult {\n  const errors: string[] = [];\n\n  // Parse session percentage\n  const sessionPercentage = parsePercentage(rawData.sessionPercentageText);\n  if (rawData.sessionPercentageText && (!sessionPercentage || !sessionPercentage.isValid)) {\n    errors.push(`Failed to parse session percentage: \"${rawData.sessionPercentageText}\"`);\n  }\n\n  // Parse session timer\n  const sessionTimer = parseSessionTimer(rawData.sessionTimerText);\n  if (rawData.sessionTimerText && (!sessionTimer || !sessionTimer.isValid)) {\n    errors.push(`Failed to parse session timer: \"${rawData.sessionTimerText}\"`);\n  }\n\n  // Parse weekly percentage\n  const weeklyPercentage = parsePercentage(rawData.weeklyPercentageText);\n  if (rawData.weeklyPercentageText && (!weeklyPercentage || !weeklyPercentage.isValid)) {\n    errors.push(`Failed to parse weekly percentage: \"${rawData.weeklyPercentageText}\"`);\n  }\n\n  // Parse weekly reset\n  const weeklyReset = parseWeeklyResetTime(rawData.weeklyTimerText);\n  if (rawData.weeklyTimerText && (!weeklyReset || !weeklyReset.isValid)) {\n    errors.push(`Failed to parse weekly reset time: \"${rawData.weeklyTimerText}\"`);\n  }\n\n  // Determine data availability\n  const hasSessionData = !!(\n    (sessionPercentage?.isValid) ||\n    (sessionTimer?.isValid)\n  );\n\n  const hasWeeklyData = !!(\n    (weeklyPercentage?.isValid) ||\n    (weeklyReset?.isValid)\n  );\n\n  const isValid = hasSessionData || hasWeeklyData;\n\n  return {\n    sessionPercentage,\n    sessionTimer,\n    weeklyPercentage,\n    weeklyReset,\n    hasSessionData,\n    hasWeeklyData,\n    isValid,\n    errors,\n  };\n}",
  "new_string": "/**\n * Extract and parse all usage data from raw DOM text content\n *\n * @param rawData - The raw extracted text data from DOM elements\n * @returns ExtractedUsageResult with all parsed values\n */\nexport function extractUsageData(rawData: ExtractedUsageData): ExtractedUsageResult {\n  const handler = getErrorHandler();\n  const errors: string[] = [];\n  const trackerErrors: TrackerError[] = [];\n\n  // Include any extraction errors from the raw data\n  if (rawData.extractionErrors && rawData.extractionErrors.length > 0) {\n    rawData.extractionErrors.forEach(err => {\n      trackerErrors.push(err);\n      errors.push(err.message);\n    });\n  }\n\n  try {\n    // Parse session percentage\n    const sessionPercentage = parsePercentage(rawData.sessionPercentageText, trackerErrors);\n    if (rawData.sessionPercentageText && (!sessionPercentage || !sessionPercentage.isValid)) {\n      errors.push(`Failed to parse session percentage: \"${rawData.sessionPercentageText}\"`);\n    }\n\n    // Parse session timer\n    const sessionTimer = parseSessionTimer(rawData.sessionTimerText, trackerErrors);\n    if (rawData.sessionTimerText && (!sessionTimer || !sessionTimer.isValid)) {\n      errors.push(`Failed to parse session timer: \"${rawData.sessionTimerText}\"`);\n    }\n\n    // Parse weekly percentage\n    const weeklyPercentage = parsePercentage(rawData.weeklyPercentageText, trackerErrors);\n    if (rawData.weeklyPercentageText && (!weeklyPercentage || !weeklyPercentage.isValid)) {\n      errors.push(`Failed to parse weekly percentage: \"${rawData.weeklyPercentageText}\"`);\n    }\n\n    // Parse weekly reset\n    const weeklyReset = parseWeeklyResetTime(rawData.weeklyTimerText, trackerErrors);\n    if (rawData.weeklyTimerText && (!weeklyReset || !weeklyReset.isValid)) {\n      errors.push(`Failed to parse weekly reset time: \"${rawData.weeklyTimerText}\"`);\n    }\n\n    // Determine data availability\n    const hasSessionData = !!(\n      (sessionPercentage?.isValid) ||\n      (sessionTimer?.isValid)\n    );\n\n    const hasWeeklyData = !!(\n      (weeklyPercentage?.isValid) ||\n      (weeklyReset?.isValid)\n    );\n\n    const isValid = hasSessionData || hasWeeklyData;\n\n    // Log summary if we had errors but still got valid data (graceful degradation)\n    if (errors.length > 0 && isValid) {\n      handler.info(`Extracted usage data with ${errors.length} warnings (degraded mode)`, {\n        hasSessionData,\n        hasWeeklyData,\n        errorCount: errors.length,\n      });\n    }\n\n    return {\n      sessionPercentage,\n      sessionTimer,\n      weeklyPercentage,\n      weeklyReset,\n      hasSessionData,\n      hasWeeklyData,\n      isValid,\n      errors,\n    };\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.TEXT_EXTRACTION_FAILED,\n      `Unexpected error extracting usage data: ${e instanceof Error ? e.message : String(e)}`,\n      'parsing',\n      'error',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    );\n    handler.logError(error);\n    errors.push(error.message);\n\n    // Return empty result with error\n    return {\n      sessionPercentage: null,\n      sessionTimer: null,\n      weeklyPercentage: null,\n      weeklyReset: null,\n      hasSessionData: false,\n      hasWeeklyData: false,\n      isValid: false,\n      errors,\n    };\n  }\n}"
}
Now let me update the analyzeUsageData function with better error handling:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/usageDataExtractor.ts",
  "old_string": "/**\n * Perform complete usage analysis from extracted data\n *\n * @param extracted - The extracted usage data\n * @param referenceDate - Optional reference date for calculations (defaults to now)\n * @returns UsageAnalysisResult with full analysis\n */\nexport function analyzeUsageData(\n  extracted: ExtractedUsageResult,\n  referenceDate: Date = new Date()\n): UsageAnalysisResult {\n  let sessionAnalysis: SessionAnalysisResult | null = null;\n  let weeklyTime: WeeklyTimeResult | null = null;\n  let weeklyEfficiency: UsageEfficiencyResult | null = null;\n\n  // Analyze session data\n  if (extracted.sessionTimer?.isValid) {\n    const actualUsagePercentage = extracted.sessionPercentage?.isValid\n      ? extracted.sessionPercentage.value\n      : null;\n\n    sessionAnalysis = analyzeSession(\n      extracted.sessionTimer.remainingMinutes,\n      actualUsagePercentage\n    );\n  }\n\n  // Analyze weekly data\n  if (extracted.weeklyReset?.isValid && extracted.weeklyReset.resetConfig) {\n    try {\n      weeklyTime = calculateWeeklyTime(extracted.weeklyReset.resetConfig, referenceDate);\n\n      if (extracted.weeklyPercentage?.isValid) {\n        weeklyEfficiency = calculateUsageEfficiency(\n          extracted.weeklyPercentage.value,\n          extracted.weeklyReset.resetConfig,\n          referenceDate\n        );\n      }\n    } catch (e) {\n      // Invalid config, skip weekly analysis\n      console.warn('[Claude Usage Tracker] Failed to calculate weekly time:', e);\n    }\n  }\n\n  // Generate summary\n  const sessionStatus = sessionAnalysis\n    ? sessionAnalysis.statusMessage\n    : 'Session data not available';\n\n  const weeklyStatus = weeklyEfficiency\n    ? `Weekly usage ${weeklyEfficiency.status === 'on-track' ? 'is on track' : `is ${weeklyEfficiency.status} expected rate`}. ${weeklyTime?.remainingFormatted || ''} until reset.`\n    : weeklyTime\n      ? `${weeklyTime.remainingFormatted} until weekly reset.`\n      : 'Weekly data not available';\n\n  const overallStatus = determineOverallStatus(sessionAnalysis, weeklyEfficiency);\n  const recommendations = generateRecommendations(sessionAnalysis, weeklyEfficiency);\n\n  const summary: UsageSummary = {\n    sessionStatus,\n    weeklyStatus,\n    overallStatus,\n    recommendations,\n  };\n\n  return {\n    extracted,\n    sessionAnalysis,\n    weeklyTime,\n    weeklyEfficiency,\n    summary,\n  };\n}",
  "new_string": "/**\n * Perform complete usage analysis from extracted data\n *\n * @param extracted - The extracted usage data\n * @param referenceDate - Optional reference date for calculations (defaults to now)\n * @returns UsageAnalysisResult with full analysis\n */\nexport function analyzeUsageData(\n  extracted: ExtractedUsageResult,\n  referenceDate: Date = new Date()\n): UsageAnalysisResult {\n  const handler = getErrorHandler();\n  let sessionAnalysis: SessionAnalysisResult | null = null;\n  let weeklyTime: WeeklyTimeResult | null = null;\n  let weeklyEfficiency: UsageEfficiencyResult | null = null;\n\n  // Analyze session data\n  if (extracted.sessionTimer?.isValid) {\n    try {\n      const actualUsagePercentage = extracted.sessionPercentage?.isValid\n        ? extracted.sessionPercentage.value\n        : null;\n\n      sessionAnalysis = analyzeSession(\n        extracted.sessionTimer.remainingMinutes,\n        actualUsagePercentage\n      );\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.INVALID_SESSION_DATA,\n        `Failed to analyze session data: ${e instanceof Error ? e.message : String(e)}`,\n        'calculation',\n        'warning',\n        { remainingMinutes: extracted.sessionTimer?.remainingMinutes },\n        e instanceof Error ? e : new Error(String(e))\n      );\n      handler.logError(error);\n      extracted.errors.push(error.message);\n    }\n  }\n\n  // Analyze weekly data\n  if (extracted.weeklyReset?.isValid && extracted.weeklyReset.resetConfig) {\n    try {\n      weeklyTime = calculateWeeklyTime(extracted.weeklyReset.resetConfig, referenceDate);\n\n      if (extracted.weeklyPercentage?.isValid) {\n        weeklyEfficiency = calculateUsageEfficiency(\n          extracted.weeklyPercentage.value,\n          extracted.weeklyReset.resetConfig,\n          referenceDate\n        );\n      }\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.INVALID_WEEKLY_DATA,\n        `Failed to calculate weekly time: ${e instanceof Error ? e.message : String(e)}`,\n        'calculation',\n        'warning',\n        { resetConfig: extracted.weeklyReset?.resetConfig },\n        e instanceof Error ? e : new Error(String(e))\n      );\n      handler.logError(error);\n      extracted.errors.push(error.message);\n    }\n  }\n\n  // Generate summary with error handling\n  let sessionStatus: string;\n  let weeklyStatus: string;\n  let overallStatus: 'good' | 'warning' | 'critical' | 'unknown';\n  let recommendations: string[];\n\n  try {\n    sessionStatus = sessionAnalysis\n      ? sessionAnalysis.statusMessage\n      : 'Session data not available';\n\n    weeklyStatus = weeklyEfficiency\n      ? `Weekly usage ${weeklyEfficiency.status === 'on-track' ? 'is on track' : `is ${weeklyEfficiency.status} expected rate`}. ${weeklyTime?.remainingFormatted || ''} until reset.`\n      : weeklyTime\n        ? `${weeklyTime.remainingFormatted} until weekly reset.`\n        : 'Weekly data not available';\n\n    overallStatus = determineOverallStatus(sessionAnalysis, weeklyEfficiency);\n    recommendations = generateRecommendations(sessionAnalysis, weeklyEfficiency);\n  } catch (e) {\n    handler.warn(`Error generating usage summary: ${e instanceof Error ? e.message : String(e)}`);\n    sessionStatus = 'Unable to determine session status';\n    weeklyStatus = 'Unable to determine weekly status';\n    overallStatus = 'unknown';\n    recommendations = ['Unable to generate recommendations due to an error.'];\n  }\n\n  const summary: UsageSummary = {\n    sessionStatus,\n    weeklyStatus,\n    overallStatus,\n    recommendations,\n  };\n\n  return {\n    extracted,\n    sessionAnalysis,\n    weeklyTime,\n    weeklyEfficiency,\n    summary,\n  };\n}"
}
Now let me update the utils/index.ts to export the new error handler:

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Read and understand existing source files",
      "status": "completed",
      "activeForm": "Reading source files"
    },
    {
      "content": "Create error handling utility module",
      "status": "completed",
      "activeForm": "Creating error handling utility"
    },
    {
      "content": "Add error handling to domDetector.ts",
      "status": "completed",
      "activeForm": "Adding error handling to DOM detector"
    },
    {
      "content": "Add error handling to usageDataExtractor.ts",
      "status": "completed",
      "activeForm": "Adding error handling to data extractor"
    },
    {
      "content": "Add error handling to timeStringParser.ts",
      "status": "completed",
      "activeForm": "Adding error handling to time parser"
    },
    {
      "content": "Add error handling to sessionTracker.ts",
      "status": "in_progress",
      "activeForm": "Adding error handling to session tracker"
    },
    {
      "content": "Add error handling to content/index.ts",
      "status": "pending",
      "activeForm": "Adding error handling to content script"
    },
    {
      "content": "Update utils/index.ts with new exports",
      "status": "pending",
      "activeForm": "Updating utility exports"
    },
    {
      "content": "Create and run Playwright verification test",
      "status": "pending",
      "activeForm": "Verifying with Playwright test"
    }
  ]
}

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/index.ts"
}

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/utils/index.ts",
  "old_string": "/**\n * Utility modules for Claude Usage Tracker\n */\n\n// Efficiency Delta Calculator\nexport {",
  "new_string": "/**\n * Utility modules for Claude Usage Tracker\n */\n\n// Error Handler\nexport {\n  ErrorHandler,\n  getErrorHandler,\n  resetErrorHandler,\n  ErrorCodes,\n  validatePageState,\n  waitForPageReady,\n  safeQuerySelector,\n  safeQuerySelectorAll,\n  safeGetTextContent,\n  safeSetAttribute,\n  safeAppendChild,\n  safeRemoveElement,\n  isElementInDOM,\n  validateRelativeTimeFormat,\n  validateAbsoluteTimeFormat,\n  validatePercentage,\n  withGracefulDegradation,\n  executeWithPartialResults,\n  type ErrorSeverity,\n  type ErrorCategory,\n  type TrackerError,\n  type LoggerConfig,\n  type PageStateResult,\n  type SafeOperationResult,\n  type DegradationConfig,\n} from './errorHandler';\n\n// Efficiency Delta Calculator\nexport {"
}
Now let me update the sessionTracker.ts with error handling:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "limit": 100
}

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "old_string": "/**\n * Session Tracker - Main integration module for Claude Usage Tracker\n *\n * This module combines session time calculations, usage data extraction,\n * and indicator display to create the complete session usage tracking feature.\n * It wires up the data flow from DOM extraction to visual display.\n */\n\nimport {\n  detectUsageElements,\n  waitForUsageElements,\n  extractTextFromElements,\n  markDetectedElements,\n  isUsagePage,\n  type DOMDetectionResult,\n  type ExtractedUsageData,\n} from '../utils/domDetector';\n\nimport {\n  extractAndAnalyzeUsage,\n  type UsageAnalysisResult,\n} from '../utils/usageDataExtractor';\n\nimport {\n  createAutoColorIndicator,\n  updateCircularIndicator,\n  formatPercentage,\n} from '../components/CircularIndicator';",
  "new_string": "/**\n * Session Tracker - Main integration module for Claude Usage Tracker\n *\n * This module combines session time calculations, usage data extraction,\n * and indicator display to create the complete session usage tracking feature.\n * It wires up the data flow from DOM extraction to visual display.\n *\n * Includes comprehensive error handling for:\n * - Page not fully loaded\n * - Missing DOM elements\n * - Unexpected page structure changes\n * - Indicator rendering failures\n */\n\nimport {\n  detectUsageElements,\n  waitForUsageElements,\n  extractTextFromElements,\n  markDetectedElements,\n  isUsagePage,\n  type DOMDetectionResult,\n  type ExtractedUsageData,\n} from '../utils/domDetector';\n\nimport {\n  extractAndAnalyzeUsage,\n  type UsageAnalysisResult,\n} from '../utils/usageDataExtractor';\n\nimport {\n  createAutoColorIndicator,\n  updateCircularIndicator,\n  formatPercentage,\n} from '../components/CircularIndicator';\n\nimport {\n  getErrorHandler,\n  ErrorCodes,\n  isElementInDOM,\n  type TrackerError,\n} from '../utils/errorHandler';"
}
Now let me read more of the sessionTracker.ts to update the logging methods and key functionality:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "offset": 160,
  "limit": 100
}
Let me update the log/warn methods in sessionTracker.ts to use the error handler:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "old_string": "  /**\n   * Log a debug message\n   */\n  private log(message: string, ...args: unknown[]): void {\n    if (this.config.debug) {\n      console.log(`[Claude Usage Tracker] ${message}`, ...args);\n    }\n  }\n\n  /**\n   * Log a warning message\n   */\n  private warn(message: string, ...args: unknown[]): void {\n    console.warn(`[Claude Usage Tracker] ${message}`, ...args);\n  }\n\n  /**\n   * Inject CSS styles into the page\n   */\n  private injectStyles(): void {\n    if (!this.config.injectStyles || this.styleElement) {\n      return;\n    }\n\n    this.styleElement = document.createElement('style');\n    this.styleElement.id = 'claude-usage-tracker-styles';\n    this.styleElement.textContent = TRACKER_STYLES;\n    document.head.appendChild(this.styleElement);\n    this.log('Injected tracker styles');\n  }",
  "new_string": "  /**\n   * Log a debug message\n   */\n  private log(message: string, ...args: unknown[]): void {\n    if (this.config.debug) {\n      const handler = getErrorHandler();\n      handler.debug(message, args.length > 0 ? { details: args } : undefined);\n    }\n  }\n\n  /**\n   * Log a warning message\n   */\n  private warn(message: string, ...args: unknown[]): void {\n    const handler = getErrorHandler();\n    handler.warn(message, args.length > 0 ? { details: args } : undefined);\n  }\n\n  /**\n   * Log an error and add to state errors\n   */\n  private logError(error: TrackerError): void {\n    const handler = getErrorHandler();\n    handler.logError(error);\n    this.state.errors.push(error.message);\n  }\n\n  /**\n   * Inject CSS styles into the page\n   */\n  private injectStyles(): void {\n    const handler = getErrorHandler();\n\n    if (!this.config.injectStyles || this.styleElement) {\n      return;\n    }\n\n    try {\n      if (!document.head) {\n        const error = handler.createError(\n          ErrorCodes.STYLE_INJECT_FAILED,\n          'Cannot inject styles: document.head is not available',\n          'rendering',\n          'warning'\n        );\n        this.logError(error);\n        return;\n      }\n\n      this.styleElement = document.createElement('style');\n      this.styleElement.id = 'claude-usage-tracker-styles';\n      this.styleElement.textContent = TRACKER_STYLES;\n      document.head.appendChild(this.styleElement);\n      this.log('Injected tracker styles');\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.STYLE_INJECT_FAILED,\n        `Failed to inject styles: ${e instanceof Error ? e.message : String(e)}`,\n        'rendering',\n        'error',\n        undefined,\n        e instanceof Error ? e : new Error(String(e))\n      );\n      this.logError(error);\n    }\n  }"
}
Now let me update the createSessionIndicator and createWeeklyIndicator methods to handle errors:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "offset": 260,
  "limit": 100
}

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "old_string": "  /**\n   * Create the session efficiency indicator\n   */\n  private createSessionIndicator(): HTMLDivElement | null {\n    const { analysis } = this.state;\n    if (!analysis?.sessionAnalysis) {\n      return null;\n    }\n\n    const { expectedUsage } = analysis.sessionAnalysis;\n    const delta = expectedUsage.usageDelta ?? 0;\n\n    // Generate tooltip text\n    const tooltipLines = [\n      'Session Usage Efficiency',\n      `Actual: ${Math.round(expectedUsage.actualUsagePercentage ?? 0)}%`,\n      `Expected: ${Math.round(expectedUsage.expectedUsagePercentage)}%`,\n      `Delta: ${formatPercentage(delta)}`,\n      '',\n      analysis.summary.sessionStatus,\n    ];\n\n    const indicator = createAutoColorIndicator(delta, {\n      size: this.config.indicatorSize,\n      tooltipText: tooltipLines.join('\\n'),\n      className: 'claude-usage-session-indicator claude-usage-circular-indicator--animated',\n    });\n\n    indicator.setAttribute('data-tracker-type', 'session');\n    return indicator;\n  }\n\n  /**\n   * Create the weekly efficiency indicator\n   */\n  private createWeeklyIndicator(): HTMLDivElement | null {\n    const { analysis } = this.state;\n    if (!analysis?.weeklyEfficiency) {\n      return null;\n    }\n\n    const { weeklyEfficiency, weeklyTime } = analysis;\n    const delta = weeklyEfficiency.efficiencyDelta;\n\n    // Generate tooltip text\n    const tooltipLines = [\n      'Weekly Usage Efficiency',\n      `Actual: ${Math.round(weeklyEfficiency.actualUsagePercentage)}%`,\n      `Expected: ${Math.round(weeklyEfficiency.expectedUsagePercentage)}%`,\n      `Delta: ${formatPercentage(delta)}`,\n      '',\n      weeklyTime ? `Time until reset: ${weeklyTime.remainingFormatted}` : '',\n      analysis.summary.weeklyStatus,\n    ].filter(Boolean);\n\n    const indicator = createAutoColorIndicator(delta, {\n      size: this.config.indicatorSize,\n      tooltipText: tooltipLines.join('\\n'),\n      className: 'claude-usage-weekly-indicator claude-usage-circular-indicator--animated',\n    });\n\n    indicator.setAttribute('data-tracker-type', 'weekly');\n    return indicator;\n  }",
  "new_string": "  /**\n   * Create the session efficiency indicator\n   */\n  private createSessionIndicator(): HTMLDivElement | null {\n    const handler = getErrorHandler();\n    const { analysis } = this.state;\n\n    if (!analysis?.sessionAnalysis) {\n      return null;\n    }\n\n    try {\n      const { expectedUsage } = analysis.sessionAnalysis;\n      const delta = expectedUsage.usageDelta ?? 0;\n\n      // Generate tooltip text\n      const tooltipLines = [\n        'Session Usage Efficiency',\n        `Actual: ${Math.round(expectedUsage.actualUsagePercentage ?? 0)}%`,\n        `Expected: ${Math.round(expectedUsage.expectedUsagePercentage)}%`,\n        `Delta: ${formatPercentage(delta)}`,\n        '',\n        analysis.summary.sessionStatus,\n      ];\n\n      const indicator = createAutoColorIndicator(delta, {\n        size: this.config.indicatorSize,\n        tooltipText: tooltipLines.join('\\n'),\n        className: 'claude-usage-session-indicator claude-usage-circular-indicator--animated',\n      });\n\n      indicator.setAttribute('data-tracker-type', 'session');\n      return indicator;\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.INDICATOR_CREATE_FAILED,\n        `Failed to create session indicator: ${e instanceof Error ? e.message : String(e)}`,\n        'rendering',\n        'error',\n        undefined,\n        e instanceof Error ? e : new Error(String(e))\n      );\n      this.logError(error);\n      return null;\n    }\n  }\n\n  /**\n   * Create the weekly efficiency indicator\n   */\n  private createWeeklyIndicator(): HTMLDivElement | null {\n    const handler = getErrorHandler();\n    const { analysis } = this.state;\n\n    if (!analysis?.weeklyEfficiency) {\n      return null;\n    }\n\n    try {\n      const { weeklyEfficiency, weeklyTime } = analysis;\n      const delta = weeklyEfficiency.efficiencyDelta;\n\n      // Generate tooltip text\n      const tooltipLines = [\n        'Weekly Usage Efficiency',\n        `Actual: ${Math.round(weeklyEfficiency.actualUsagePercentage)}%`,\n        `Expected: ${Math.round(weeklyEfficiency.expectedUsagePercentage)}%`,\n        `Delta: ${formatPercentage(delta)}`,\n        '',\n        weeklyTime ? `Time until reset: ${weeklyTime.remainingFormatted}` : '',\n        analysis.summary.weeklyStatus,\n      ].filter(Boolean);\n\n      const indicator = createAutoColorIndicator(delta, {\n        size: this.config.indicatorSize,\n        tooltipText: tooltipLines.join('\\n'),\n        className: 'claude-usage-weekly-indicator claude-usage-circular-indicator--animated',\n      });\n\n      indicator.setAttribute('data-tracker-type', 'weekly');\n      return indicator;\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.INDICATOR_CREATE_FAILED,\n        `Failed to create weekly indicator: ${e instanceof Error ? e.message : String(e)}`,\n        'rendering',\n        'error',\n        undefined,\n        e instanceof Error ? e : new Error(String(e))\n      );\n      this.logError(error);\n      return null;\n    }\n  }"
}
Now let me update the updateIndicators method:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "offset": 430,
  "limit": 100
}
Let me read the updateIndicators method:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "offset": 530,
  "limit": 100
}
Let me update the updateIndicators method with error handling:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "old_string": "  /**\n   * Update existing indicators with new data\n   */\n  private updateIndicators(): void {\n    const { analysis, sessionIndicator, weeklyIndicator } = this.state;\n\n    if (sessionIndicator && analysis?.sessionAnalysis) {\n      const delta = analysis.sessionAnalysis.expectedUsage.usageDelta ?? 0;\n      updateCircularIndicator(sessionIndicator, {\n        percentage: delta,\n      });\n      sessionIndicator.classList.add('claude-usage-indicator-updating');\n      setTimeout(() => sessionIndicator.classList.remove('claude-usage-indicator-updating'), 300);\n    }\n\n    if (weeklyIndicator && analysis?.weeklyEfficiency) {\n      const delta = analysis.weeklyEfficiency.efficiencyDelta;\n      updateCircularIndicator(weeklyIndicator, {\n        percentage: delta,\n      });\n      weeklyIndicator.classList.add('claude-usage-indicator-updating');\n      setTimeout(() => weeklyIndicator.classList.remove('claude-usage-indicator-updating'), 300);\n    }\n  }",
  "new_string": "  /**\n   * Update existing indicators with new data\n   */\n  private updateIndicators(): void {\n    const handler = getErrorHandler();\n    const { analysis, sessionIndicator, weeklyIndicator } = this.state;\n\n    // Update session indicator if it exists and is still in DOM\n    if (sessionIndicator && analysis?.sessionAnalysis) {\n      try {\n        // Check if indicator is still in DOM\n        if (!isElementInDOM(sessionIndicator)) {\n          this.log('Session indicator removed from DOM, clearing reference');\n          this.state.sessionIndicator = null;\n        } else {\n          const delta = analysis.sessionAnalysis.expectedUsage.usageDelta ?? 0;\n          updateCircularIndicator(sessionIndicator, {\n            percentage: delta,\n          });\n          sessionIndicator.classList.add('claude-usage-indicator-updating');\n          setTimeout(() => sessionIndicator.classList.remove('claude-usage-indicator-updating'), 300);\n        }\n      } catch (e) {\n        const error = handler.createError(\n          ErrorCodes.INDICATOR_UPDATE_FAILED,\n          `Failed to update session indicator: ${e instanceof Error ? e.message : String(e)}`,\n          'rendering',\n          'warning',\n          undefined,\n          e instanceof Error ? e : new Error(String(e))\n        );\n        this.logError(error);\n        // Clear the reference so we can try to recreate it\n        this.state.sessionIndicator = null;\n      }\n    }\n\n    // Update weekly indicator if it exists and is still in DOM\n    if (weeklyIndicator && analysis?.weeklyEfficiency) {\n      try {\n        // Check if indicator is still in DOM\n        if (!isElementInDOM(weeklyIndicator)) {\n          this.log('Weekly indicator removed from DOM, clearing reference');\n          this.state.weeklyIndicator = null;\n        } else {\n          const delta = analysis.weeklyEfficiency.efficiencyDelta;\n          updateCircularIndicator(weeklyIndicator, {\n            percentage: delta,\n          });\n          weeklyIndicator.classList.add('claude-usage-indicator-updating');\n          setTimeout(() => weeklyIndicator.classList.remove('claude-usage-indicator-updating'), 300);\n        }\n      } catch (e) {\n        const error = handler.createError(\n          ErrorCodes.INDICATOR_UPDATE_FAILED,\n          `Failed to update weekly indicator: ${e instanceof Error ? e.message : String(e)}`,\n          'rendering',\n          'warning',\n          undefined,\n          e instanceof Error ? e : new Error(String(e))\n        );\n        this.logError(error);\n        // Clear the reference so we can try to recreate it\n        this.state.weeklyIndicator = null;\n      }\n    }\n  }"
}
Now let me update the refresh method with error handling:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "old_string": "  /**\n   * Refresh detection and analysis from DOM\n   */\n  public async refresh(): Promise<void> {\n    this.log('Refreshing usage data...');\n\n    // Detect DOM elements\n    const detection = detectUsageElements();\n    this.state.detection = detection;\n\n    if (!detection.isValid) {\n      this.warn('Failed to detect usage elements');\n      return;\n    }\n\n    // Mark elements for debugging\n    markDetectedElements(detection);\n\n    // Extract text from elements\n    const extractedData = extractTextFromElements(detection);\n    this.state.extractedData = extractedData;\n    this.log('Extracted data:', extractedData);\n\n    // Analyze the extracted data\n    const analysis = extractAndAnalyzeUsage(extractedData);\n    this.state.analysis = analysis;\n    this.state.lastUpdate = new Date();\n\n    this.log('Analysis complete:', analysis.summary);\n\n    // Update or insert indicators\n    if (this.state.sessionIndicator || this.state.weeklyIndicator) {\n      this.updateIndicators();\n    } else {\n      this.insertIndicators();\n    }\n  }",
  "new_string": "  /**\n   * Refresh detection and analysis from DOM\n   */\n  public async refresh(): Promise<void> {\n    const handler = getErrorHandler();\n    this.log('Refreshing usage data...');\n\n    try {\n      // Detect DOM elements\n      const detection = detectUsageElements();\n      this.state.detection = detection;\n\n      // Add any detection errors to state\n      if (detection.errors && detection.errors.length > 0) {\n        detection.errors.forEach(err => {\n          this.state.errors.push(err.message);\n        });\n      }\n\n      if (!detection.isValid) {\n        this.warn('Failed to detect usage elements');\n        return;\n      }\n\n      // Log if running in degraded mode\n      if (detection.degraded) {\n        this.log('Running in degraded mode - partial data available');\n      }\n\n      // Mark elements for debugging\n      try {\n        markDetectedElements(detection);\n      } catch (e) {\n        this.warn(`Failed to mark detected elements: ${e instanceof Error ? e.message : String(e)}`);\n      }\n\n      // Extract text from elements\n      const extractedData = extractTextFromElements(detection);\n      this.state.extractedData = extractedData;\n      this.log('Extracted data:', extractedData);\n\n      // Analyze the extracted data\n      const analysis = extractAndAnalyzeUsage(extractedData);\n      this.state.analysis = analysis;\n      this.state.lastUpdate = new Date();\n\n      // Add any extraction/analysis errors to state\n      if (analysis.extracted.errors && analysis.extracted.errors.length > 0) {\n        analysis.extracted.errors.forEach(err => {\n          if (!this.state.errors.includes(err)) {\n            this.state.errors.push(err);\n          }\n        });\n      }\n\n      this.log('Analysis complete:', analysis.summary);\n\n      // Update or insert indicators\n      if (this.state.sessionIndicator || this.state.weeklyIndicator) {\n        this.updateIndicators();\n      } else {\n        this.insertIndicators();\n      }\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.UNKNOWN_ERROR,\n        `Unexpected error during refresh: ${e instanceof Error ? e.message : String(e)}`,\n        'unknown',\n        'error',\n        undefined,\n        e instanceof Error ? e : new Error(String(e))\n      );\n      this.logError(error);\n    }\n  }"
}
Now let me read and update the initialize method:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "offset": 710,
  "limit": 100
}

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/sessionTracker.ts",
  "old_string": "  /**\n   * Initialize the session tracker\n   */\n  public async initialize(): Promise<boolean> {\n    if (this.state.initialized) {\n      this.warn('SessionTracker already initialized');\n      return true;\n    }\n\n    this.log('Initializing SessionTracker...');\n\n    // Check if we're on the correct page\n    if (!isUsagePage()) {\n      this.log('Not on usage page, skipping initialization');\n      return false;\n    }\n\n    // Inject styles\n    this.injectStyles();\n\n    // Wait for usage elements to appear\n    const detection = await waitForUsageElements();\n    this.state.detection = detection;\n\n    if (!detection.isValid) {\n      this.warn('Failed to detect usage elements on page');\n      return false;\n    }\n\n    // Mark detected elements\n    markDetectedElements(detection);\n\n    // Extract and analyze data\n    const extractedData = extractTextFromElements(detection);\n    this.state.extractedData = extractedData;\n\n    const analysis = extractAndAnalyzeUsage(extractedData);\n    this.state.analysis = analysis;\n    this.state.lastUpdate = new Date();\n\n    this.log('Initial analysis complete:', analysis.summary);\n\n    // Insert indicators\n    this.insertIndicators();\n\n    // Set up auto-update\n    this.setupObserver();\n    this.setupUpdateInterval();\n\n    this.state.initialized = true;\n    this.log('SessionTracker initialized successfully');\n\n    return true;\n  }",
  "new_string": "  /**\n   * Initialize the session tracker\n   */\n  public async initialize(): Promise<boolean> {\n    const handler = getErrorHandler();\n\n    if (this.state.initialized) {\n      this.warn('SessionTracker already initialized');\n      return true;\n    }\n\n    this.log('Initializing SessionTracker...');\n\n    try {\n      // Check if we're on the correct page\n      if (!isUsagePage()) {\n        this.log('Not on usage page, skipping initialization');\n        return false;\n      }\n\n      // Inject styles\n      this.injectStyles();\n\n      // Wait for usage elements to appear\n      const detection = await waitForUsageElements();\n      this.state.detection = detection;\n\n      // Collect any errors from detection\n      if (detection.errors && detection.errors.length > 0) {\n        detection.errors.forEach(err => {\n          this.state.errors.push(err.message);\n        });\n      }\n\n      if (!detection.isValid) {\n        const error = handler.createError(\n          ErrorCodes.ELEMENT_NOT_FOUND,\n          'Failed to detect usage elements on page during initialization',\n          'page-structure',\n          'warning'\n        );\n        this.logError(error);\n        return false;\n      }\n\n      // Log if running in degraded mode\n      if (detection.degraded) {\n        this.log('Initializing in degraded mode - partial data available');\n      }\n\n      // Mark detected elements\n      try {\n        markDetectedElements(detection);\n      } catch (e) {\n        this.warn(`Failed to mark detected elements: ${e instanceof Error ? e.message : String(e)}`);\n      }\n\n      // Extract and analyze data\n      const extractedData = extractTextFromElements(detection);\n      this.state.extractedData = extractedData;\n\n      const analysis = extractAndAnalyzeUsage(extractedData);\n      this.state.analysis = analysis;\n      this.state.lastUpdate = new Date();\n\n      // Collect any extraction/analysis errors\n      if (analysis.extracted.errors && analysis.extracted.errors.length > 0) {\n        analysis.extracted.errors.forEach(err => {\n          if (!this.state.errors.includes(err)) {\n            this.state.errors.push(err);\n          }\n        });\n      }\n\n      this.log('Initial analysis complete:', analysis.summary);\n\n      // Insert indicators\n      try {\n        this.insertIndicators();\n      } catch (e) {\n        const error = handler.createError(\n          ErrorCodes.INDICATOR_CREATE_FAILED,\n          `Failed to insert indicators: ${e instanceof Error ? e.message : String(e)}`,\n          'rendering',\n          'error',\n          undefined,\n          e instanceof Error ? e : new Error(String(e))\n        );\n        this.logError(error);\n        // Continue anyway - tracker is partially functional\n      }\n\n      // Set up auto-update\n      try {\n        this.setupObserver();\n        this.setupUpdateInterval();\n      } catch (e) {\n        this.warn(`Failed to set up auto-update: ${e instanceof Error ? e.message : String(e)}`);\n        // Continue anyway - manual refresh still works\n      }\n\n      this.state.initialized = true;\n      this.log('SessionTracker initialized successfully');\n\n      return true;\n    } catch (e) {\n      const error = handler.createError(\n        ErrorCodes.UNKNOWN_ERROR,\n        `Unexpected error during initialization: ${e instanceof Error ? e.message : String(e)}`,\n        'unknown',\n        'critical',\n        undefined,\n        e instanceof Error ? e : new Error(String(e))\n      );\n      this.logError(error);\n      return false;\n    }\n  }"
}
Now let me update the content/index.ts with error handling:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/index.ts"
}

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/index.ts",
  "old_string": "/**\n * Claude Usage Tracker - Content Script Entry Point\n *\n * This content script runs on the claude.ai/settings/usage page and provides\n * visual feedback on usage efficiency through color-coded indicators.\n */\n\nimport {\n  isUsagePage,\n  type DOMDetectionResult,\n} from '../utils/domDetector';\n\nimport {\n  type UsageAnalysisResult,\n} from '../utils/usageDataExtractor';\n\nimport {\n  SessionTracker,\n  getSessionTracker,\n  destroySessionTracker,\n  type TrackerState,\n} from './sessionTracker';",
  "new_string": "/**\n * Claude Usage Tracker - Content Script Entry Point\n *\n * This content script runs on the claude.ai/settings/usage page and provides\n * visual feedback on usage efficiency through color-coded indicators.\n *\n * Includes comprehensive error handling for:\n * - Page not fully loaded\n * - Missing DOM elements\n * - Invalid time formats\n * - Unexpected page structure changes\n */\n\nimport {\n  isUsagePage,\n  type DOMDetectionResult,\n} from '../utils/domDetector';\n\nimport {\n  type UsageAnalysisResult,\n} from '../utils/usageDataExtractor';\n\nimport {\n  SessionTracker,\n  getSessionTracker,\n  destroySessionTracker,\n  type TrackerState,\n} from './sessionTracker';\n\nimport {\n  getErrorHandler,\n  ErrorCodes,\n  validatePageState,\n} from '../utils/errorHandler';"
}
Now let me update the initialize function with comprehensive error handling:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/index.ts",
  "old_string": "// Initialize the usage tracker when the DOM is ready\nasync function initialize(): Promise<void> {\n  console.log('[Claude Usage Tracker] Extension initialized');\n\n  // Check if we're on the correct page\n  if (!isUsagePage()) {\n    console.log('[Claude Usage Tracker] Not on usage page, skipping initialization');\n    return;\n  }\n\n  console.log('[Claude Usage Tracker] Running on usage page');\n\n  // Create and initialize the session tracker\n  tracker = getSessionTracker({\n    autoUpdate: true,\n    updateInterval: 30000, // 30 seconds\n    indicatorSize: 48,\n    showSessionIndicator: true,\n    showWeeklyIndicator: true,\n    injectStyles: true,\n    debug: true,\n  });\n\n  const success = await tracker.initialize();\n\n  if (success) {\n    const state = tracker.getState();\n    const analysis = tracker.getAnalysis();\n\n    // Log detection summary\n    console.log('[Claude Usage Tracker] Detection summary:', {\n      sessionContainer: !!state.detection?.sessionContainer,\n      weeklyContainer: !!state.detection?.weeklyContainer,\n      sessionPercentage: !!state.detection?.sessionPercentage,\n      sessionTimer: !!state.detection?.sessionTimer,\n      weeklyPercentage: !!state.detection?.weeklyPercentage,\n      weeklyTimer: !!state.detection?.weeklyTimer,\n    });\n\n    // Log usage summary\n    if (analysis) {\n      console.log('[Claude Usage Tracker] Usage summary:', {\n        hasSessionData: analysis.extracted.hasSessionData,\n        hasWeeklyData: analysis.extracted.hasWeeklyData,\n        overallStatus: analysis.summary.overallStatus,\n        sessionStatus: analysis.summary.sessionStatus,\n        weeklyStatus: analysis.summary.weeklyStatus,\n        recommendations: analysis.summary.recommendations,\n      });\n\n      // Log session efficiency if available\n      if (analysis.sessionAnalysis) {\n        const delta = analysis.sessionAnalysis.expectedUsage.usageDelta;\n        console.log('[Claude Usage Tracker] Session efficiency delta:', delta !== null ? `${delta >= 0 ? '+' : ''}${Math.round(delta)}%` : 'N/A');\n      }\n\n      // Log weekly efficiency if available\n      if (analysis.weeklyEfficiency) {\n        const delta = analysis.weeklyEfficiency.efficiencyDelta;\n        console.log('[Claude Usage Tracker] Weekly efficiency delta:', `${delta >= 0 ? '+' : ''}${Math.round(delta)}%`);\n      }\n\n      // Log any parsing errors\n      if (analysis.extracted.errors.length > 0) {\n        console.warn('[Claude Usage Tracker] Parsing errors:', analysis.extracted.errors);\n      }\n    }\n  } else {\n    console.warn('[Claude Usage Tracker] Failed to initialize SessionTracker');\n  }\n}",
  "new_string": "// Initialize the usage tracker when the DOM is ready\nasync function initialize(): Promise<void> {\n  const handler = getErrorHandler();\n  handler.info('Extension initialized');\n\n  try {\n    // Validate page state first\n    const pageState = validatePageState();\n\n    if (!pageState.isReady) {\n      handler.warn(`Page not fully loaded. State: ${pageState.documentState}`, {\n        hasBody: pageState.hasBody,\n        hasHead: pageState.hasHead,\n      });\n      // Continue anyway - elements might still be accessible\n    }\n\n    // Check if we're on the correct page\n    if (!isUsagePage()) {\n      handler.debug('Not on usage page, skipping initialization');\n      return;\n    }\n\n    handler.info('Running on usage page');\n\n    // Create and initialize the session tracker\n    tracker = getSessionTracker({\n      autoUpdate: true,\n      updateInterval: 30000, // 30 seconds\n      indicatorSize: 48,\n      showSessionIndicator: true,\n      showWeeklyIndicator: true,\n      injectStyles: true,\n      debug: true,\n    });\n\n    const success = await tracker.initialize();\n\n    if (success) {\n      const state = tracker.getState();\n      const analysis = tracker.getAnalysis();\n\n      // Log detection summary\n      handler.info('Detection summary', {\n        sessionContainer: !!state.detection?.sessionContainer,\n        weeklyContainer: !!state.detection?.weeklyContainer,\n        sessionPercentage: !!state.detection?.sessionPercentage,\n        sessionTimer: !!state.detection?.sessionTimer,\n        weeklyPercentage: !!state.detection?.weeklyPercentage,\n        weeklyTimer: !!state.detection?.weeklyTimer,\n        degraded: state.detection?.degraded || false,\n      });\n\n      // Log usage summary\n      if (analysis) {\n        handler.info('Usage summary', {\n          hasSessionData: analysis.extracted.hasSessionData,\n          hasWeeklyData: analysis.extracted.hasWeeklyData,\n          overallStatus: analysis.summary.overallStatus,\n          sessionStatus: analysis.summary.sessionStatus,\n          weeklyStatus: analysis.summary.weeklyStatus,\n          recommendations: analysis.summary.recommendations,\n        });\n\n        // Log session efficiency if available\n        if (analysis.sessionAnalysis) {\n          const delta = analysis.sessionAnalysis.expectedUsage.usageDelta;\n          handler.info(`Session efficiency delta: ${delta !== null ? `${delta >= 0 ? '+' : ''}${Math.round(delta)}%` : 'N/A'}`);\n        }\n\n        // Log weekly efficiency if available\n        if (analysis.weeklyEfficiency) {\n          const delta = analysis.weeklyEfficiency.efficiencyDelta;\n          handler.info(`Weekly efficiency delta: ${delta >= 0 ? '+' : ''}${Math.round(delta)}%`);\n        }\n\n        // Log any parsing errors\n        if (analysis.extracted.errors.length > 0) {\n          handler.warn(`Parsing errors encountered: ${analysis.extracted.errors.length}`, {\n            errors: analysis.extracted.errors,\n          });\n        }\n      }\n\n      // Log any state errors\n      if (state.errors.length > 0) {\n        handler.warn(`State errors: ${state.errors.length}`, {\n          errors: state.errors,\n        });\n      }\n    } else {\n      const error = handler.createError(\n        ErrorCodes.ELEMENT_NOT_FOUND,\n        'Failed to initialize SessionTracker - usage elements not found or page structure changed',\n        'page-structure',\n        'warning'\n      );\n      handler.logError(error);\n    }\n  } catch (e) {\n    const error = handler.createError(\n      ErrorCodes.UNKNOWN_ERROR,\n      `Unexpected error during initialization: ${e instanceof Error ? e.message : String(e)}`,\n      'unknown',\n      'critical',\n      undefined,\n      e instanceof Error ? e : new Error(String(e))\n    );\n    handler.logError(error);\n  }\n}"
}
Now let me update the cleanup function and update the todo list:

🔧 Tool: Edit
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/src/content/index.ts",
  "old_string": "// Clean up on page unload\nfunction cleanup(): void {\n  destroySessionTracker();\n  tracker = null;\n}",
  "new_string": "// Clean up on page unload\nfunction cleanup(): void {\n  const handler = getErrorHandler();\n  try {\n    handler.debug('Cleaning up SessionTracker...');\n    destroySessionTracker();\n    tracker = null;\n    handler.debug('SessionTracker cleanup complete');\n  } catch (e) {\n    handler.warn(`Error during cleanup: ${e instanceof Error ? e.message : String(e)}`);\n    tracker = null; // Still clear the reference\n  }\n}"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Read and understand existing source files",
      "status": "completed",
      "activeForm": "Reading source files"
    },
    {
      "content": "Create error handling utility module",
      "status": "completed",
      "activeForm": "Creating error handling utility"
    },
    {
      "content": "Add error handling to domDetector.ts",
      "status": "completed",
      "activeForm": "Adding error handling to DOM detector"
    },
    {
      "content": "Add error handling to usageDataExtractor.ts",
      "status": "completed",
      "activeForm": "Adding error handling to data extractor"
    },
    {
      "content": "Add error handling to timeStringParser.ts",
      "status": "completed",
      "activeForm": "Adding error handling to time parser"
    },
    {
      "content": "Add error handling to sessionTracker.ts",
      "status": "completed",
      "activeForm": "Adding error handling to session tracker"
    },
    {
      "content": "Add error handling to content/index.ts",
      "status": "completed",
      "activeForm": "Adding error handling to content script"
    },
    {
      "content": "Update utils/index.ts with new exports",
      "status": "completed",
      "activeForm": "Updating utility exports"
    },
    {
      "content": "Verify build compiles successfully",
      "status": "in_progress",
      "activeForm": "Verifying build"
    },
    {
      "content": "Create and run Playwright verification test",
      "status": "pending",
      "activeForm": "Verifying with Playwright test"
    }
  ]
}
Now let me verify the build compiles successfully:

🔧 Tool: Bash
Input: {
  "command": "npm run build 2>&1",
  "description": "Build the extension to verify changes compile",
  "timeout": 120000
}
The build compiles successfully. Now let me create a Playwright verification test:

🔧 Tool: Bash
Input: {
  "command": "ls /home/shaal/code/utilities/claude-usage-rate-chrome-extension/*.config.* 2>/dev/null | head -5",
  "description": "Check for existing config files"
}
Let me read the playwright config to understand the test setup:

🔧 Tool: Read
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/playwright.config.ts"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Read and understand existing source files",
      "status": "completed",
      "activeForm": "Reading source files"
    },
    {
      "content": "Create error handling utility module",
      "status": "completed",
      "activeForm": "Creating error handling utility"
    },
    {
      "content": "Add error handling to domDetector.ts",
      "status": "completed",
      "activeForm": "Adding error handling to DOM detector"
    },
    {
      "content": "Add error handling to usageDataExtractor.ts",
      "status": "completed",
      "activeForm": "Adding error handling to data extractor"
    },
    {
      "content": "Add error handling to timeStringParser.ts",
      "status": "completed",
      "activeForm": "Adding error handling to time parser"
    },
    {
      "content": "Add error handling to sessionTracker.ts",
      "status": "completed",
      "activeForm": "Adding error handling to session tracker"
    },
    {
      "content": "Add error handling to content/index.ts",
      "status": "completed",
      "activeForm": "Adding error handling to content script"
    },
    {
      "content": "Update utils/index.ts with new exports",
      "status": "completed",
      "activeForm": "Updating utility exports"
    },
    {
      "content": "Verify build compiles successfully",
      "status": "completed",
      "activeForm": "Verifying build"
    },
    {
      "content": "Create and run Playwright verification test",
      "status": "in_progress",
      "activeForm": "Verifying with Playwright test"
    }
  ]
}
Now let me create a comprehensive Playwright verification test for the error handling:

🔧 Tool: Write
Input: {
  "file_path": "/home/shaal/code/utilities/claude-usage-rate-chrome-extension/error-handling-verification.spec.ts",
  "content": "/**\n * Error Handling Verification Test\n *\n * This test verifies the comprehensive error handling implementation for:\n * - Page not fully loaded\n * - Missing DOM elements\n * - Invalid time formats\n * - Unexpected page structure changes\n * - Graceful degradation\n */\n\nimport { test, expect } from '@playwright/test';\n\n// Import the error handler and related utilities for testing\nimport {\n  ErrorHandler,\n  getErrorHandler,\n  resetErrorHandler,\n  ErrorCodes,\n  validatePageState,\n  safeQuerySelector,\n  safeQuerySelectorAll,\n  safeGetTextContent,\n  safeSetAttribute,\n  safeAppendChild,\n  safeRemoveElement,\n  isElementInDOM,\n  validateRelativeTimeFormat,\n  validateAbsoluteTimeFormat,\n  validatePercentage,\n  withGracefulDegradation,\n} from './src/utils/errorHandler';\n\nimport {\n  parsePercentage,\n  parseSessionTimer,\n  parseWeeklyResetTime,\n  extractUsageData,\n} from './src/utils/usageDataExtractor';\n\nimport type { ExtractedUsageData } from './src/utils/domDetector';\n\ntest.describe('Error Handler Module', () => {\n  test.beforeEach(() => {\n    // Reset the error handler before each test\n    resetErrorHandler();\n  });\n\n  test('should create and log errors with correct structure', () => {\n    const handler = getErrorHandler();\n\n    const error = handler.createError(\n      ErrorCodes.ELEMENT_NOT_FOUND,\n      'Test element not found',\n      'dom-element',\n      'error',\n      { selector: '.test-element' }\n    );\n\n    expect(error).toBeDefined();\n    expect(error.code).toBe(ErrorCodes.ELEMENT_NOT_FOUND);\n    expect(error.message).toBe('Test element not found');\n    expect(error.category).toBe('dom-element');\n    expect(error.severity).toBe('error');\n    expect(error.context).toEqual({ selector: '.test-element' });\n    expect(error.timestamp).toBeInstanceOf(Date);\n    expect(error.recovered).toBe(false);\n  });\n\n  test('should accumulate errors in the handler', () => {\n    const handler = getErrorHandler();\n\n    handler.error('Error 1');\n    handler.error('Error 2');\n    handler.warn('Warning 1');\n\n    const allErrors = handler.getErrors();\n    expect(allErrors.length).toBeGreaterThanOrEqual(3);\n  });\n\n  test('should filter errors by category', () => {\n    const handler = getErrorHandler();\n\n    const domError = handler.createError(\n      ErrorCodes.ELEMENT_NOT_FOUND,\n      'DOM error',\n      'dom-element',\n      'error'\n    );\n    handler.logError(domError);\n\n    const timeError = handler.createError(\n      ErrorCodes.INVALID_TIME_FORMAT,\n      'Time error',\n      'time-format',\n      'error'\n    );\n    handler.logError(timeError);\n\n    const domErrors = handler.getErrorsByCategory('dom-element');\n    const timeErrors = handler.getErrorsByCategory('time-format');\n\n    expect(domErrors.some(e => e.message === 'DOM error')).toBe(true);\n    expect(timeErrors.some(e => e.message === 'Time error')).toBe(true);\n  });\n\n  test('should mark errors as recovered', () => {\n    const handler = getErrorHandler();\n\n    const error = handler.createError(\n      ErrorCodes.ELEMENT_NOT_FOUND,\n      'Test error',\n      'dom-element',\n      'error'\n    );\n    handler.logError(error);\n\n    expect(error.recovered).toBe(false);\n\n    handler.markRecovered(error, 'Used fallback selector');\n\n    expect(error.recovered).toBe(true);\n    expect(error.recoveryAction).toBe('Used fallback selector');\n  });\n\n  test('should support error callbacks', () => {\n    const handler = getErrorHandler();\n    const receivedErrors: unknown[] = [];\n\n    const unsubscribe = handler.onError((error) => {\n      receivedErrors.push(error);\n    });\n\n    handler.error('Callback test error');\n\n    expect(receivedErrors.length).toBeGreaterThan(0);\n\n    // Cleanup\n    unsubscribe();\n  });\n});\n\ntest.describe('Time Format Validation', () => {\n  test('should validate relative time formats', () => {\n    // Valid formats\n    expect(validateRelativeTimeFormat('2 hr 30 min').success).toBe(true);\n    expect(validateRelativeTimeFormat('45 min').success).toBe(true);\n    expect(validateRelativeTimeFormat('1 hour 15 minutes').success).toBe(true);\n\n    // Invalid formats\n    expect(validateRelativeTimeFormat('invalid').success).toBe(false);\n    expect(validateRelativeTimeFormat('').success).toBe(false);\n    expect(validateRelativeTimeFormat('10:30 AM').success).toBe(false);\n  });\n\n  test('should validate absolute time formats', () => {\n    // Valid formats\n    expect(validateAbsoluteTimeFormat('Thu 8:00 AM').success).toBe(true);\n    expect(validateAbsoluteTimeFormat('10:30 PM').success).toBe(true);\n    expect(validateAbsoluteTimeFormat('Mon 14:30').success).toBe(true);\n\n    // Invalid formats\n    expect(validateAbsoluteTimeFormat('invalid').success).toBe(false);\n    expect(validateAbsoluteTimeFormat('').success).toBe(false);\n    expect(validateAbsoluteTimeFormat('2 hr 30 min').success).toBe(false);\n  });\n\n  test('should validate and clamp percentages', () => {\n    // Valid percentages\n    expect(validatePercentage(50).success).toBe(true);\n    expect(validatePercentage(50).value).toBe(50);\n\n    expect(validatePercentage(0).success).toBe(true);\n    expect(validatePercentage(100).success).toBe(true);\n\n    // Out of range - should clamp\n    const tooHigh = validatePercentage(150);\n    expect(tooHigh.success).toBe(true);\n    expect(tooHigh.value).toBe(100);\n\n    const tooLow = validatePercentage(-10);\n    expect(tooLow.success).toBe(true);\n    expect(tooLow.value).toBe(0);\n\n    // Invalid\n    expect(validatePercentage(NaN).success).toBe(false);\n  });\n});\n\ntest.describe('Percentage Parsing with Error Handling', () => {\n  test('should parse valid percentages', () => {\n    const errors: unknown[] = [];\n\n    const result1 = parsePercentage('75%', errors);\n    expect(result1?.isValid).toBe(true);\n    expect(result1?.value).toBe(75);\n\n    const result2 = parsePercentage('50.5%', errors);\n    expect(result2?.isValid).toBe(true);\n    expect(result2?.value).toBe(50.5);\n\n    const result3 = parsePercentage('100', errors);\n    expect(result3?.isValid).toBe(true);\n    expect(result3?.value).toBe(100);\n  });\n\n  test('should handle invalid percentage formats gracefully', () => {\n    const errors: unknown[] = [];\n\n    const result1 = parsePercentage('not-a-number%', errors);\n    expect(result1?.isValid).toBe(false);\n\n    const result2 = parsePercentage('', errors);\n    expect(result2).toBeNull();\n\n    const result3 = parsePercentage(null, errors);\n    expect(result3).toBeNull();\n  });\n\n  test('should clamp out-of-range percentages', () => {\n    const errors: unknown[] = [];\n\n    // Over 100% should be clamped\n    const result = parsePercentage('150%', errors);\n    expect(result?.isValid).toBe(true);\n    expect(result?.value).toBeLessThanOrEqual(100);\n  });\n});\n\ntest.describe('Session Timer Parsing with Error Handling', () => {\n  test('should parse valid session timer formats', () => {\n    const errors: unknown[] = [];\n\n    const result1 = parseSessionTimer('2 hr 30 min', errors);\n    expect(result1?.isValid).toBe(true);\n    expect(result1?.remainingMinutes).toBe(150);\n\n    const result2 = parseSessionTimer('Resets in 1 hr 15 min', errors);\n    expect(result2?.isValid).toBe(true);\n    expect(result2?.remainingMinutes).toBe(75);\n\n    const result3 = parseSessionTimer('45 min', errors);\n    expect(result3?.isValid).toBe(true);\n    expect(result3?.remainingMinutes).toBe(45);\n  });\n\n  test('should handle invalid session timer formats', () => {\n    const errors: unknown[] = [];\n\n    const result1 = parseSessionTimer('invalid time', errors);\n    expect(result1?.isValid).toBe(false);\n\n    const result2 = parseSessionTimer('', errors);\n    expect(result2).toBeNull();\n\n    const result3 = parseSessionTimer(null, errors);\n    expect(result3).toBeNull();\n  });\n});\n\ntest.describe('Weekly Reset Time Parsing with Error Handling', () => {\n  test('should parse valid weekly reset formats', () => {\n    const errors: unknown[] = [];\n\n    const result1 = parseWeeklyResetTime('Thu 8:00 AM', errors);\n    expect(result1?.isValid).toBe(true);\n    expect(result1?.resetDay).not.toBeNull();\n\n    const result2 = parseWeeklyResetTime('Resets Mon 10:30 PM', errors);\n    expect(result2?.isValid).toBe(true);\n  });\n\n  test('should handle invalid weekly reset formats', () => {\n    const errors: unknown[] = [];\n\n    const result1 = parseWeeklyResetTime('invalid format', errors);\n    expect(result1?.isValid).toBe(false);\n\n    const result2 = parseWeeklyResetTime('', errors);\n    expect(result2).toBeNull();\n  });\n});\n\ntest.describe('Usage Data Extraction with Error Handling', () => {\n  test('should extract valid usage data', () => {\n    const rawData: ExtractedUsageData = {\n      sessionPercentageText: '44%',\n      sessionTimerText: 'Resets in 2 hr 15 min',\n      weeklyPercentageText: '60%',\n      weeklyTimerText: 'Resets Thu 8:00 AM',\n      extractionErrors: [],\n    };\n\n    const result = extractUsageData(rawData);\n\n    expect(result.isValid).toBe(true);\n    expect(result.hasSessionData).toBe(true);\n    expect(result.hasWeeklyData).toBe(true);\n    expect(result.sessionPercentage?.value).toBe(44);\n    expect(result.weeklyPercentage?.value).toBe(60);\n  });\n\n  test('should handle partial data gracefully', () => {\n    const rawData: ExtractedUsageData = {\n      sessionPercentageText: '44%',\n      sessionTimerText: null,\n      weeklyPercentageText: null,\n      weeklyTimerText: null,\n      extractionErrors: [],\n    };\n\n    const result = extractUsageData(rawData);\n\n    expect(result.isValid).toBe(true);\n    expect(result.hasSessionData).toBe(true);\n    expect(result.hasWeeklyData).toBe(false);\n    expect(result.sessionPercentage?.value).toBe(44);\n  });\n\n  test('should handle invalid data with errors', () => {\n    const rawData: ExtractedUsageData = {\n      sessionPercentageText: 'not-valid',\n      sessionTimerText: 'also-not-valid',\n      weeklyPercentageText: null,\n      weeklyTimerText: null,\n      extractionErrors: [],\n    };\n\n    const result = extractUsageData(rawData);\n\n    expect(result.errors.length).toBeGreaterThan(0);\n  });\n\n  test('should propagate extraction errors from raw data', () => {\n    const handler = getErrorHandler();\n    const extractionError = handler.createError(\n      ErrorCodes.ELEMENT_REMOVED,\n      'Element was removed',\n      'dom-element',\n      'warning'\n    );\n\n    const rawData: ExtractedUsageData = {\n      sessionPercentageText: '44%',\n      sessionTimerText: null,\n      weeklyPercentageText: null,\n      weeklyTimerText: null,\n      extractionErrors: [extractionError],\n    };\n\n    const result = extractUsageData(rawData);\n\n    expect(result.errors.length).toBeGreaterThan(0);\n    expect(result.errors.some(e => e.includes('Element was removed'))).toBe(true);\n  });\n});\n\ntest.describe('Graceful Degradation', () => {\n  test('should return value on success', async () => {\n    const result = await withGracefulDegradation(\n      () => 'success',\n      'fallback'\n    );\n\n    expect(result.value).toBe('success');\n    expect(result.degraded).toBe(false);\n    expect(result.errors.length).toBe(0);\n  });\n\n  test('should use fallback on failure', async () => {\n    const result = await withGracefulDegradation(\n      () => {\n        throw new Error('Test error');\n      },\n      'fallback',\n      { retryOnFailure: false }\n    );\n\n    expect(result.value).toBe('fallback');\n    expect(result.degraded).toBe(true);\n    expect(result.errors.length).toBeGreaterThan(0);\n  });\n\n  test('should retry on failure when configured', async () => {\n    let attempts = 0;\n\n    const result = await withGracefulDegradation(\n      () => {\n        attempts++;\n        if (attempts < 3) {\n          throw new Error('Retry me');\n        }\n        return 'success after retry';\n      },\n      'fallback',\n      { retryOnFailure: true, maxRetries: 3, retryDelayMs: 10 }\n    );\n\n    expect(result.value).toBe('success after retry');\n    expect(result.degraded).toBe(false);\n    expect(attempts).toBe(3);\n  });\n});\n\ntest.describe('Error Code Coverage', () => {\n  test('should have unique error codes for different categories', () => {\n    const pageLoadCodes = [\n      ErrorCodes.PAGE_NOT_READY,\n      ErrorCodes.PAGE_LOAD_TIMEOUT,\n      ErrorCodes.WRONG_PAGE,\n      ErrorCodes.DOCUMENT_NOT_AVAILABLE,\n    ];\n\n    const domCodes = [\n      ErrorCodes.ELEMENT_NOT_FOUND,\n      ErrorCodes.ELEMENT_REMOVED,\n      ErrorCodes.CONTAINER_NOT_FOUND,\n      ErrorCodes.MULTIPLE_ELEMENTS_FOUND,\n    ];\n\n    const timeCodes = [\n      ErrorCodes.INVALID_TIME_FORMAT,\n      ErrorCodes.INVALID_RELATIVE_TIME,\n      ErrorCodes.INVALID_ABSOLUTE_TIME,\n      ErrorCodes.TIME_OUT_OF_RANGE,\n    ];\n\n    // Verify all codes are unique\n    const allCodes = [...pageLoadCodes, ...domCodes, ...timeCodes];\n    const uniqueCodes = new Set(allCodes);\n    expect(uniqueCodes.size).toBe(allCodes.length);\n  });\n});\n"
}
Now let me run the Playwright tests:

🔧 Tool: Bash
Input: {
  "command": "npx playwright test error-handling-verification.spec.ts 2>&1",
  "description": "Run Playwright verification test",
  "timeout": 120000
}
All 23 tests pass. Now let me clean up the test file as instructed:

🔧 Tool: Bash
Input: {
  "command": "rm /home/shaal/code/utilities/claude-usage-rate-chrome-extension/error-handling-verification.spec.ts && echo \"Test file deleted successfully\"",
  "description": "Delete verification test file"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Read and understand existing source files",
      "status": "completed",
      "activeForm": "Reading source files"
    },
    {
      "content": "Create error handling utility module",
      "status": "completed",
      "activeForm": "Creating error handling utility"
    },
    {
      "content": "Add error handling to domDetector.ts",
      "status": "completed",
      "activeForm": "Adding error handling to DOM detector"
    },
    {
      "content": "Add error handling to usageDataExtractor.ts",
      "status": "completed",
      "activeForm": "Adding error handling to data extractor"
    },
    {
      "content": "Add error handling to timeStringParser.ts",
      "status": "completed",
      "activeForm": "Adding error handling to time parser"
    },
    {
      "content": "Add error handling to sessionTracker.ts",
      "status": "completed",
      "activeForm": "Adding error handling to session tracker"
    },
    {
      "content": "Add error handling to content/index.ts",
      "status": "completed",
      "activeForm": "Adding error handling to content script"
    },
    {
      "content": "Update utils/index.ts with new exports",
      "status": "completed",
      "activeForm": "Updating utility exports"
    },
    {
      "content": "Verify build compiles successfully",
      "status": "completed",
      "activeForm": "Verifying build"
    },
    {
      "content": "Create and run Playwright verification test",
      "status": "completed",
      "activeForm": "Verifying with Playwright test"
    }
  ]
}
<summary>
## Summary: Add Comprehensive Error Handling for Edge Cases

### Changes Implemented
- **Created new error handling utility module** (`src/utils/errorHandler.ts`) with:
  - Custom `ErrorHandler` class with severity levels (debug, info, warning, error, critical)
  - Error categories for different failure types (page-load, dom-element, time-format, page-structure, parsing, calculation, rendering)
  - Comprehensive error codes (ErrorCodes) for specific error scenarios
  - Page state validation utilities (`validatePageState`, `waitForPageReady`)
  - Safe DOM operation wrappers (`safeQuerySelector`, `safeQuerySelectorAll`, `safeGetTextContent`, etc.)
  - Time format validation helpers
  - Graceful degradation utilities (`withGracefulDegradation`, `executeWithPartialResults`)

- **Updated `domDetector.ts`** with:
  - Error tracking in `DOMDetectionResult` interface (added `errors` and `degraded` fields)
  - Try-catch blocks around all DOM queries
  - Page state validation before detection
  - Element existence checks with `isElementInDOM`
  - Proper error logging through the new ErrorHandler
  - Graceful handling of missing elements

- **Updated `usageDataExtractor.ts`** with:
  - Error collection in parsing functions (`parsePercentage`, `parseSessionTimer`, `parseWeeklyResetTime`)
  - Validation of parsed values with appropriate error codes
  - Clamping of out-of-range values with warnings
  - Graceful degradation when partial data is available
  - Propagation of errors through the extraction pipeline

- **Updated `sessionTracker.ts`** with:
  - Error handling in indicator creation and updates
  - DOM element existence checks before operations
  - Recovery from indicator removal from DOM
  - Comprehensive error logging during initialization and refresh
  - Graceful degradation when partial tracking is possible

- **Updated `content/index.ts`** with:
  - Page state validation at startup
  - Comprehensive error logging during initialization
  - Error summary reporting
  - Graceful cleanup on errors

- **Updated `utils/index.ts`** with exports for all new error handling utilities

### Files Modified
- `src/utils/errorHandler.ts` (NEW - 570+ lines)
- `src/utils/domDetector.ts` (major updates)
- `src/utils/usageDataExtractor.ts` (updates to parsing functions)
- `src/content/sessionTracker.ts` (error handling throughout)
- `src/content/index.ts` (initialization error handling)
- `src/utils/index.ts` (new exports)

### Verification Status
- Build compiles successfully
- **23 Playwright tests passed** verifying:
  - Error handler creation and logging
  - Error accumulation and filtering by category
  - Error recovery marking
  - Time format validation (relative and absolute)
  - Percentage validation and clamping
  - Session timer parsing with error handling
  - Weekly reset time parsing with error handling
  - Usage data extraction with partial data
  - Error propagation through the extraction pipeline
  - Graceful degradation with retry support
  - Error code uniqueness

### Notes for Developer
- All error handling follows a consistent pattern with:
  - Error codes for identification
  - Categories for classification
  - Severity levels for filtering
  - Context data for debugging
  - Original errors preserved when wrapping
  
- The system supports **graceful degradation**:
  - Partial data extraction when some elements are missing
  - Continued operation with logged warnings
  - Automatic recovery from transient DOM issues
  
- Error logging can be configured:
  - `minSeverity` setting controls what gets logged
  - `maxStoredErrors` prevents memory issues
  - Error callbacks allow custom handling
  
- The `degraded` flag in detection results indicates when the tracker is running with partial data
</summary>