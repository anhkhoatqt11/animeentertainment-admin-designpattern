"use client";

import {
  Button,
  CircularProgress,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useCredentials } from "@/hooks/useCredentials";
import toast, { Toaster } from "react-hot-toast";

const CreateAccount = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userName, setUserName] = React.useState("");
  const [loginId, setLoginId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { createNewCredential, checkIfUserExists } = useCredentials();

  const roles = [
    { key: "Admin", label: "Admin (Quản trị viên)" },
    { key: "Editor", label: "Editor (Biên tập viên)" },
    { Key: "Partner", label: "Partner (Đối tác)" },
    { key: "Advertiser", label: "Advertiser (Nhà quảng cáo)" },
  ];

  const handleSelectionChange = (e) => {
    setRole(e.target.value);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async () => {
    setIsLoading(true);

    const checkData = await checkIfUserExists({ loginid: loginId });

    if (userName === "" || loginId === "" || password === "" || role === "") {
      console.log("Vui lòng điền đầy đủ thông tin");
      toast.error("Vui lòng điền đầy đủ thông tin");
      setIsLoading(false);
      return;
    }

    console.log(checkData);

    if (checkData.credential != null) {
      console.log("Tài khoản đã tồn tại");
      toast.error("Tài khoản đã tồn tại");
      setIsLoading(false);
      return;
    }

    const data = {
      username: userName,
      loginid: loginId,
      password: password,
      role: role,
      status: "active",
    };
    console.log(data);
    const res = await createNewCredential(data);
    if (res) {
      console.log("Tạo tài khoản thành công");
      toast.success("Tạo tài khoản thành công");
    } else {
      console.log("Tạo tài khoản thất bại");
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <>
      <Toaster />
      <Modal size={"md"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tạo tài khoản
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Tên người dùng"
                  labelPlacement={"inside"}
                  placeholder="Nhập tên người dùng"
                  value={userName}
                  radius="sm"
                  onValueChange={setUserName}
                />
                <Input
                  label="Tài khoản"
                  labelPlacement={"inside"}
                  placeholder="Nhập tài khoản"
                  value={loginId}
                  radius="sm"
                  onValueChange={setLoginId}
                />
                <Input
                  label="Mật khẩu"
                  labelPlacement={"inside"}
                  placeholder="Nhập mật khẩu"
                  radius="sm"
                  type={isVisible ? "text" : "password"}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeOpenIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeClosedIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  value={password}
                  onValueChange={setPassword}
                />
                <Select
                  isRequired
                  onChange={handleSelectionChange}
                  label="Vai trò"
                  radius="sm"
                  className="w-full"
                >
                  {roles.map((role) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  className="bg-emerald-500 text-white"
                  radius="sm"
                  onPress={onSubmit}
                >
                  Tạo tài khoản
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
      <Button
        className="bg-fuchsia-500 text-white"
        radius="sm"
        onPress={() => {
          onOpen();
        }}
      >
        Tạo tài khoản mới
      </Button>
    </>
  );
};

export default CreateAccount;
