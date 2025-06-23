// Giao diện chiến lược thông báo
export interface NotificationTypeStrategy {
    notifySuccess(message: string): void;
    notifyError(message: string): void;
}

import toast from 'react-hot-toast';    

export class ToastNotificationStrategy implements NotificationTypeStrategy {
    notifySuccess(message: string): void {
      toast.success(message);
    }
  
    notifyError(message: string): void {
      toast.error(message);
    }
  }
  
  // Cài đặt chiến lược sử dụng alert (ví dụ modal có thể thay thế sau)
  export class AlertNotificationStrategy implements NotificationTypeStrategy {
    notifySuccess(message: string): void {
      alert("✅ " + message);
    }
  
    notifyError(message: string): void {
      alert("❌ " + message);
    }
  }
  