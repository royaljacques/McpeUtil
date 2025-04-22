export const logger = {
    info: (...args: any[]) => console.log('🟢 [INFO]', ...args),
    warn: (...args: any[]) => console.warn('🟡 [WARN]', ...args),
    error: (...args: any[]) => console.error('🔴 [ERROR]', ...args),
    debug: (...args: any[]) => console.debug('🔵 [DEBUG]', ...args),
  };