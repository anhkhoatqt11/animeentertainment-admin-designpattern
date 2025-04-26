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
import toast, { Toaster } from "react-hot-toast";
import { useReports } from "@/hooks/useReports";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

const statusColorMap = {
  completed: "success",
  pending: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "reporter",
  "reported",
  "content",
  "type",
  "status",
  "actions",
];

export default function UserTable() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [reportListPick, setReportListPick] = React.useState([]);
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState(new Set(["all"]));
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // -----------------------------
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { fetchAllReport, editReportStatus, deleteRecord } = useReports();

  const { data, refetch } = useQuery({
    queryKey: [
      ["users", currentPage],
      ["status", statusFilter],
      ["limit", rowsPerPage],
    ],
    queryFn: () => fetchAllReport(currentPage, rowsPerPage, statusFilter),
    staleTime: 60 * 1000 * 1,
    keepPreviousData: true,
    onSuccess: () => {
      setIsLoaded(true);
      console.log(data);
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const onDeleteReport = async () => {
    const data = {
      reportList: reportListPick,
    };
    await deleteRecord(data);
    toast.success("Xoá report thành công");
    refetch();
  };
  const onCompletedReport = async (reportId) => {
    const data = {
      completedId: reportId,
    };
    await editReportStatus(data);
    toast.success("Cập nhật thành công");
    refetch();
  };
  // ----------------------------
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const renderCell = React.useCallback((report, columnKey) => {
    switch (columnKey) {
      case "reporter":
        return (
          <User
            avatarProps={{
              src:
                report.userReportedInfo[0]?.avatar ||
                "https://i.pinimg.com/originals/5c/62/90/5c6290cc2fc59b6ff13a47b214a98046.jpg",
            }}
            description={report.userReportedInfo[0]?._id}
            name={report.userReportedInfo[0]?.username}
          >
            {report.userReportedInfo[0]?.username}
          </User>
        );
      case "reported":
        return (
          <User
            avatarProps={{
              src:
                report.userBeReportedInfo[0]?.avatar ||
                "https://i.pinimg.com/originals/5c/62/90/5c6290cc2fc59b6ff13a47b214a98046.jpg",
            }}
            description={report.userBeReportedInfo[0]?._id}
            name={report.userBeReportedInfo[0]?.username}
          >
            {report.userBeReportedInfo[0]?.username}
          </User>
        );
      case "content":
        return (
          <p className="text-[13px] font-medium">{report.reportContent}</p>
        );
      case "type":
        return (
          <p className="text-[13px] text-gray-500">
            {report.type === "comic" ? "Truyện" : "Anime"}
          </p>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 font-medium"
            color={statusColorMap[report.status]}
            size="sm"
            variant="flat"
          >
            {report.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <DotsVerticalIcon className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disabledKeys={
                  report.status === "completed" ? ["handle", "completed"] : []
                }
              >
                <DropdownItem
                  onClick={() => {
                    router.push(`/reports/report-processing/${report._id}`);
                  }}
                  key={"handle"}
                >
                  Xử lý
                </DropdownItem>

                <DropdownItem
                  key={"completed"}
                  onClick={() => {
                    onCompletedReport(report._id);
                  }}
                >
                  Hoàn thành
                </DropdownItem>

                <DropdownItem
                  onClick={() => {
                    setReportListPick([report._id]);
                    onOpen();
                  }}
                >
                  Xóa
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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

  const onClear = React.useCallback(() => {
    setCurrentPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Tổng cộng {data?.totalItems} đơn báo cáo
          </span>
          <div className="flex flex-row gap-3 ">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="single"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
      </div>
    );
  }, [statusFilter, visibleColumns, onRowsPerPageChange, data?.totalItems, ,]);

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
                    reportListPick.push(item);
                  });
                  setReportListPick(reportListPick);
                  onOpen();
                }}
              >
                Xóa
              </Button>
            </div>
          ) : (
            <div></div>
          )}
          <span className="text-small text-default-400">
            {selectedKeys === "all"
              ? "Đã chọn tất cả"
              : `${selectedKeys.size} trên ${data?.data.length} report đã chọn`}
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
  }, [selectedKeys, data?.totalItems, currentPage, data?.totalPages]);

  return (
    <div>
      {!isLoaded ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <Toaster />
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Xác nhận
                  </ModalHeader>
                  <ModalBody>
                    <p>Bạn có chắc chắn muốn xóa những report này</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="success"
                      variant="ghost"
                      onClick={() => {
                        onClose();
                        onDeleteReport();
                      }}
                    >
                      Xóa report
                    </Button>
                    <Button color="primary" onClick={onClose}>
                      Hủy
                    </Button>
                  </ModalFooter>
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
            <TableBody emptyContent={"No report found"} items={data?.data}>
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
