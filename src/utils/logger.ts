// src/utils/logger.ts
// 📝 Utilitário de logging para facilitar debugging
// Responsável por: Gerenciar logs, erros e avisos de forma organizada

/**
 * Níveis de log disponíveis
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Configuração do logger
 */
interface LoggerConfig {
  enabled: boolean;
  logLevel: LogLevel;
  showTimestamp: boolean;
}

/**
 * Configuração padrão do logger
 * Em produção, você pode desabilitar logs ou mudar o nível
 */
const config: LoggerConfig = {
  enabled: __DEV__, // Apenas em desenvolvimento
  logLevel: LogLevel.DEBUG,
  showTimestamp: true,
};

/**
 * Formata timestamp para exibição
 */
function formatTimestamp(): string {
  const now = new Date();
  return `[${now.toLocaleTimeString('pt-BR')}.${now.getMilliseconds()}]`;
}

/**
 * Formata a mensagem de log
 */
function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = config.showTimestamp ? formatTimestamp() : '';
  return `${timestamp} [${level}] [${context}] ${message}`;
}

/**
 * Verifica se deve logar baseado no nível configurado
 */
function shouldLog(level: LogLevel): boolean {
  if (!config.enabled) return false;

  const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
  const currentLevelIndex = levels.indexOf(config.logLevel);
  const messageLevelIndex = levels.indexOf(level);

  return messageLevelIndex >= currentLevelIndex;
}

/**
 * Logger personalizado para o app
 */
export const Logger = {
  /**
   * Log de debug - informações detalhadas para desenvolvimento
   */
  debug(context: string, message: string, data?: any) {
    if (!shouldLog(LogLevel.DEBUG)) return;
    console.log(formatMessage(LogLevel.DEBUG, context, message), data || '');
  },

  /**
   * Log de informação - eventos importantes do app
   */
  info(context: string, message: string, data?: any) {
    if (!shouldLog(LogLevel.INFO)) return;
    console.log(formatMessage(LogLevel.INFO, context, message), data || '');
  },

  /**
   * Log de aviso - situações que merecem atenção mas não impedem execução
   */
  warn(context: string, message: string, data?: any) {
    if (!shouldLog(LogLevel.WARN)) return;
    console.warn(formatMessage(LogLevel.WARN, context, message), data || '');
  },

  /**
   * Log de erro - erros que impedem execução normal
   */
  error(context: string, message: string, error?: any) {
    if (!shouldLog(LogLevel.ERROR)) return;
    console.error(formatMessage(LogLevel.ERROR, context, message));
    if (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
      } else {
        console.error('Error data:', error);
      }
    }
  },

  /**
   * Log de erro crítico - erros que podem causar crash
   */
  critical(context: string, message: string, error?: any) {
    // Erros críticos sempre são logados, independente da configuração
    const originalEnabled = config.enabled;
    config.enabled = true;

    console.error('🚨 CRITICAL ERROR 🚨');
    console.error(formatMessage(LogLevel.ERROR, context, message));
    if (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
      } else {
        console.error('Error data:', error);
      }
    }

    config.enabled = originalEnabled;
  },

  /**
   * Configura o logger
   */
  configure(newConfig: Partial<LoggerConfig>) {
    Object.assign(config, newConfig);
  },

  /**
   * Obtém configuração atual
   */
  getConfig(): LoggerConfig {
    return { ...config };
  },
};

/**
 * Hook para logging em contextos específicos
 * Uso: const log = createContextLogger('AuthContext');
 *      log.info('Usuário logado com sucesso');
 */
export function createContextLogger(context: string) {
  return {
    debug: (message: string, data?: any) => Logger.debug(context, message, data),
    info: (message: string, data?: any) => Logger.info(context, message, data),
    warn: (message: string, data?: any) => Logger.warn(context, message, data),
    error: (message: string, error?: any) => Logger.error(context, message, error),
    critical: (message: string, error?: any) => Logger.critical(context, message, error),
  };
}

/**
 * Decorator para logar entrada/saída de funções (experimental)
 */
export function logFunction(context: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      Logger.debug(context, `Chamando ${propertyKey}`, { args });
      try {
        const result = await originalMethod.apply(this, args);
        Logger.debug(context, `${propertyKey} completado`, { result });
        return result;
      } catch (error) {
        Logger.error(context, `Erro em ${propertyKey}`, error);
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Utilitário para tracking de performance
 */
export class PerformanceTracker {
  private startTime: number;
  private context: string;
  private operation: string;

  constructor(context: string, operation: string) {
    this.context = context;
    this.operation = operation;
    this.startTime = Date.now();
    Logger.debug(context, `Iniciando: ${operation}`);
  }

  end() {
    const duration = Date.now() - this.startTime;
    Logger.debug(
      this.context,
      `Finalizado: ${this.operation}`,
      { duration: `${duration}ms` }
    );
  }
}

export default Logger;
