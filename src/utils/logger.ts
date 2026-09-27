import { LogEntry, LogLevel, LogTag } from '../types';

type LogListener = (entry: LogEntry) => void;

class Logger {
  private listeners: Set<LogListener> = new Set();
  private history: LogEntry[] = [];
  private maxHistory = 200;

  public subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getHistory(): LogEntry[] {
    return [...this.history];
  }

  public clearHistory(): void {
    this.history = [];
  }

  private formatTime(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds().toString().padStart(3, '0');
  }

  public log(level: LogLevel, tag: LogTag, message: string, details?: Record<string, unknown>): void {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: this.formatTime(),
      level,
      tag,
      message,
      details,
    };

    // Store in history
    this.history.unshift(entry);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }

    // Output to browser/terminal console with formatted styling
    const colorMap: Record<LogLevel, string> = {
      DEBUG: '#94a3b8', // slate-400
      INFO: '#38bdf8',  // sky-400
      WARN: '#facc15',  // yellow-400
      ERROR: '#f87171', // red-400
    };

    const style = `color: ${colorMap[level]}; font-weight: bold;`;
    const tagStyle = `color: #a855f7; font-weight: bold;`;

    console.log(
      `%c[${entry.timestamp}] %c[${level}] %c[${tag}] %c${message}`,
      'color: #64748b',
      style,
      tagStyle,
      'color: inherit',
      details ? details : ''
    );

    // Notify listeners (Overlay HUD)
    this.listeners.forEach((listener) => listener(entry));
  }

  public debug(tag: LogTag, message: string, details?: Record<string, unknown>): void {
    this.log('DEBUG', tag, message, details);
  }

  public info(tag: LogTag, message: string, details?: Record<string, unknown>): void {
    this.log('INFO', tag, message, details);
  }

  public warn(tag: LogTag, message: string, details?: Record<string, unknown>): void {
    this.log('WARN', tag, message, details);
  }

  public error(tag: LogTag, message: string, details?: Record<string, unknown>): void {
    this.log('ERROR', tag, message, details);
  }
}

export const logger = new Logger();
