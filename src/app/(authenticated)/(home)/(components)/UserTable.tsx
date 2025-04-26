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
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { columns, statusOptions, capitalize } from "./data/data";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react";
import Loader from "@/components/Loader";
import { useUsers } from "@/hooks/useUsers";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@nextui-org/modal";
import { Toaster } from "react-hot-toast";
import { BanUserModal } from "./BanUserModal";

const statusColorMap = {
  active: "success",
  banned: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["username", "id", "status", "actions"];

const calculateStatus = (value) => {
  var accessDate = new Date(value);
  return accessDate.getTime() - Date.now() > 0 ? "banned" : "active";
};

export default function UserTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [userListPick, setUserListPick] = React.useState([]);
  const [actionType, setActionType] = useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // -----------------------------
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { fetchAllUsers, editAccessCommentDate } = useUsers();

  const { data, refetch } = useQuery({
    queryKey: [
      ["users", currentPage],
      ["name", filterValue],
      ["status", statusFilter],
      ["limit", rowsPerPage],
    ],
    queryFn: () =>
      fetchAllUsers(currentPage, rowsPerPage, filterValue, statusFilter),
    staleTime: 60 * 1000 * 1,
    keepPreviousData: true,
    onSuccess: () => {
      setIsLoaded(true);
    },
  });

  useEffect(() => {
    refetch();
  }, []);
  // ----------------------------

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const renderCell = React.useCallback((user, columnKey) => {
    switch (columnKey) {
      case "username":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.phone}
            name={user.username}
          >
            {user.username}
          </User>
        );
      case "id":
        return (
          <div className="flex flex-col">
            {/* <p className="text-bold text-small capitalize">{user._id}</p> */}
            <p className="text-bold text-tiny capitalize text-default-400">
              {user._id}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[calculateStatus(user.accessCommentDate)]}
            size="sm"
            variant="dot"
          >
            {calculateStatus(user.accessCommentDate)}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-start items-center gap-2">
            {calculateStatus(user.accessCommentDate) === "active" ? (
              <Button
                radius="full"
                className="bg-pink-500 text-white font-medium"
                onClick={() => {
                  setUserListPick([user?._id]);
                  setActionType("ban");
                  onOpen();
                }}
              >
                Cấm bình luận
              </Button>
            ) : (
              <Button
                className="bg-emerald-400 text-white font-medium"
                radius="full"
                onClick={() => {
                  setUserListPick([user?._id]);
                  setActionType("open");
                  onOpen();
                }}
              >
                Mở bình luận
              </Button>
            )}
          </div>
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
                  setActionType("ban");
                  setUserListPick(userListPick);
                  onOpen();
                }}
              >
                Cấm
              </Button>
              <p className="text-blue-500">/</p>
              <Button
                className="bg-transparent font-semibold w-fit text-emerald-400 p-0"
                onClick={() => {
                  // setUserListPick(selectedKeys.entries);
                  selectedKeys.forEach((item) => {
                    userListPick.push(item);
                  });
                  setActionType("open");
                  setUserListPick(userListPick);
                  onOpen();
                }}
              >
                Mở
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
          <BanUserModal
            props={{
              isOpen,
              onOpen,
              onOpenChange,
              userListPick,
              actionType,
              refetch,
            }}
          />
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
