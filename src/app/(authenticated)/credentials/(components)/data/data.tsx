import React from "react";
const columns = [
  { name: "Họ tên", uid: "username" },
  { name: "Mã ID", uid: "id" },
  { name: "Trạng thái", uid: "status" },
  { name: "Vai trò", uid: "role" },
  { name: "Hành động", uid: "actions" },
];

const statusOptions = [
  { name: "Đang hoạt động", uid: "active" },
  { name: "Vô hiệu hoá", uid: "deactivate" },
];

export { columns, statusOptions };
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
