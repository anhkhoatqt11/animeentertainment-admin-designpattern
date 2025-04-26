"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  DatePicker,
  Tooltip,
  Select,
  CircularProgress,
  SelectItem,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
// import { columns, statusOptions, capitalize } from "./data/data";

import { columns, capitalize } from "./data/data";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@nextui-org/modal";
import toast, { Toaster } from "react-hot-toast";
import { useCredentials } from "@/hooks/useCredentials";
import { CiEdit } from "react-icons/ci";
import { CiLock, CiUnlock } from "react-icons/ci";

const statusColorMap = {
  active: "success",
  deactivated: "warning",
};

const statusMap = {
  active: "Đang hoạt động",
  deactivate: "Vô hiệu hoá",
};

const INITIAL_VISIBLE_COLUMNS = ["username", "id", "status", "role", "actions"];

export default function CredentialsTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [userListPick, setUserListPick] = React.useState([]);
  const [actionType, setActionType] = useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isLoading, setIsLoading] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [currentUserId, setCurrentUserId] = React.useState("");
  // -----------------------------
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const roles = [
    { value: "Admin", label: "Admin (Quản trị viên)" },
    { value: "Editor", label: "Editor (Biên tập viên)" },
    { value: "Partner", label: "Partner (Đối tác)" },
    { value: "Advertiser", label: "Advertiser (Nhà quảng cáo)" },
  ];


  function removeCommasAndSpaces(inputString: string): string {
    // Replace commas with empty string
    let noCommas = inputString.replace(/,/g, '');
    // Replace spaces with empty string
    let result = noCommas.replace(/ /g, '');
    return result;
  }

  const { fetchAllCredentials, updateCredentials } = useCredentials();

  const { data, refetch } = useQuery({
    queryKey: [
      ["users", currentPage],
      ["name", filterValue],
      ["status", statusFilter],
      ["limit", rowsPerPage],
    ],
    queryFn: () =>
      fetchAllCredentials(currentPage, rowsPerPage, filterValue, statusFilter),
    staleTime: 60 * 1000 * 1,
    keepPreviousData: true,
    onSuccess: () => {
      setIsLoaded(true);
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const handleSelectionChange = (e) => {
    setRole(e.target.value.split(",").map((role) => role.trim()));
  };

  const onSubmit = async () => {
    console.log(role[0]);
    console.log(userName);
    const data = {
      id: currentUserId,
      username: userName,
      role: role[0],
    };
    const res = await updateCredentials(data);
    if (res) {
      console.log("Cập nhật thành công");
      toast.success("Cập nhật thành công");
      refetch();
    } else {
      console.log("Cập nhật thất bại");
      toast.error("Đã có lỗi xảy ra khi thực hiện cập nhật");
    }
  };


  const onSubmitStatus = async ({ status, userId }) => {
    console.log(userId, status);
    const data = {
      id: userId,
      username: "",
      role: "",
      status: status,
    };
    const res = await updateCredentials(data);
    if (res) {
      console.log("Cập nhật thành công");
      toast.success("Cập nhật thành công");
      refetch();
    } else {
      console.log("Cập nhật thất bại");
      toast.error("Đã có lỗi xảy ra khi thực hiện cập nhật");
    }
  };

  const renderCell = React.useCallback((user, columnKey) => {
    switch (columnKey) {
      case "username":
        return <div>{user.username}</div>;
      case "id":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-tiny capitalize text-default-400">
              {user._id}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[user.status]}
            size="sm"
            variant="dot"
          >
            {statusMap[user.status]}
          </Chip>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.role}
            </p>
          </div>
        );
      case "actions":
        return (
          <>
            <div className="flex flex-col">
              <div className="relative flex items-center gap-3">
                <Tooltip content="Sửa thông tin">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <CiEdit
                      className="w-6 h-6 text-blue-400"
                      onClick={() => {
                        setUserName(user.username);
                        setCurrentUserId(user._id);
                        setRole(user.role.split(",").map((role) => role.trim()));
                        onOpen();
                      }}
                    />
                  </span>
                </Tooltip>
                {user.status === "deactivate" ? (
                  <Tooltip color="primary" content="Kích hoạt tài khoản">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <CiUnlock className="w-6 h-6 text-emerald-400" onClick={() => {
                        onSubmitStatus({ userId: user._id, status: "active" });
                      }} />
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip color="danger" content="Vô hiệu hoá">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <CiLock className="w-6 h-6 text-red-400" onClick={() => { onSubmitStatus({ userId: user._id, status: "deactivate" }); }} />
                    </span>
                  </Tooltip>
                )}
              </div>
            </div>
          </>
        );
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (currentPage < data?.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, data?.totalPages]);

  const onPreviousPage = React.useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setCurrentPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setCurrentPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                  className="bg-blue-500 text-white"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Tổng cộng {data?.totalItems} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Số users trên một trang:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    data?.totalItems,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <div className="flex flex-row w-[30%] items-center">
          {selectedKeys.size > 0 ? (
            <div className="flex flex-row items-center">
              <Button
                className="bg-transparent font-semibold w-fit text-pink-500 p-0"
                onClick={() => {
                  // setUserListPick(selectedKeys.entries);
                  selectedKeys.forEach((item) => {
                    userListPick.push(item);
                  });
                  setUserListPick(userListPick);
                  onOpen();
                }}
              >
                Vô hiệu hoá
              </Button>
              <p className="text-blue-500"> / </p>
              <Button
                className="bg-transparent font-semibold w-fit text-emerald-400 p-0"
                onClick={() => {
                  // setUserListPick(selectedKeys.entries);
                  selectedKeys.forEach((item) => {
                    userListPick.push(item);
                  });
                  setUserListPick(userListPick);
                  onOpen();
                }}
              >
                Kích hoạt
              </Button>
            </div>
          ) : (
            <div></div>
          )}
          <span className="text-small text-default-400">
            {selectedKeys === "all"
              ? "Đã chọn tất cả"
              : `${selectedKeys.size} trên ${data?.data.length} user đã chọn`}
          </span>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={currentPage}
          total={data?.totalPages}
          onChange={setCurrentPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={data?.totalPages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Trước
          </Button>
          <Button
            isDisabled={data?.totalPages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Sau
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    data?.totalItems,
    currentPage,
    data?.totalPages,
    hasSearchFilter,
  ]);

  return (
    <div>
      {!isLoaded ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <Toaster />
          <Modal size={"md"} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Chỉnh sửa tài khoản
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      label="Tên người dùng"
                      labelPlacement={"inside"}
                      placeholder="Nhập tên người dùng"
                      value={userName}
                      onValueChange={setUserName}
                    />
                    <Select
                      isRequired
                      onChange={handleSelectionChange}
                      label="Vai trò"
                      className="w-full"
                      selectedKeys={role}
                    >
                      {roles.map((role) => (
                        <SelectItem key={role.value}>{role.label}</SelectItem>
                      ))}
                    </Select>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Đóng
                    </Button>
                    <Button
                      className="bg-blue-400 text-white"
                      onPress={onSubmit}
                    >
                      Chỉnh sửa thông tin
                    </Button>
                  </ModalFooter>
                  {isLoading ? (
                    <div className="w-full h-full flex justify-center bg-gray-200 z-10 absolute top-0">
                      <CircularProgress
                        color="success"
                        aria-label="Loading..."
                        classNames={{
                          svg: "w-20 h-20 text-gray-600",
                        }}
                      />
                    </div>
                  ) : null}
                </>
              )}
            </ModalContent>
          </Modal>
          <Table
            aria-label="All skylark users"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn key={column.uid} align={"start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"No users found"} items={data?.data}>
              {(item) => (
                <TableRow key={item?._id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
