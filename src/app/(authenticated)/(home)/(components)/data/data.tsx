import React from "react";
const columns = [
  { name: "Họ tên", uid: "username" },
  { name: "Mã ID", uid: "id" },
  { name: "Trạng thái", uid: "status" },
  { name: "Hành động", uid: "actions" },
];

const statusOptions = [
  { name: "Hoạt động", uid: "active" },
  { name: "Cấm bình luận", uid: "paused" },
];

export { columns, statusOptions };
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
