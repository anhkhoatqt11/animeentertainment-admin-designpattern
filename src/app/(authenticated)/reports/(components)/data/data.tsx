import React from "react";
const columns = [
  { name: "Nguời gửi", uid: "reporter" },
  { name: "Người bị tố cáo", uid: "reported" },
  { name: "Nội dung", uid: "content" },
  { name: "Danh mục", uid: "type" },
  { name: "Trạng thái", uid: "status" },
  { name: "", uid: "actions" },
];

const statusOptions = [
  { name: "Chờ xử lý", uid: "pending" },
  { name: "Hoàn thành", uid: "completed" },
  { name: "Tất cả", uid: "all" },
];

export { columns, statusOptions };
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
