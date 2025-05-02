import { NotificationTypeStrategy } from "./notification_type_strategy";

// Lớp bọc sử dụng Strategy Pattern
export class NotificationContext {
  private strategy: NotificationTypeStrategy;

  constructor(strategy: NotificationTypeStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: NotificationTypeStrategy): void {
    this.strategy = strategy;
  }

  notifySuccess(message: string): void {
    this.strategy.notifySuccess(message);
  }

  notifyError(message: string): void {
    this.strategy.notifyError(message);
  }
}
