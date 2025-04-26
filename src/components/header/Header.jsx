"use client";

// import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import Logo from "../logo";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { FaFolder, FaPlusCircle, FaUser } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";


export default function Component({ session }) {
  // console.log(session); 
  const router = useRouter();
  return (
    <div className="bg-gray-50 px-3 shadow-md hidden lg:block">
      <div className="flex h-16 w-full justify-between bg-gray-50 shrink-0 items-center">
        <Logo />
        <div className="flex flex-row gap-2 items-center">
          {/* <div className="flex flex-col justify-end items-end">
            <p className="font-medium text-[14px]">Quản trị viên</p>
            <p className="text-[12px] text-gray-600">Alexandler Smith</p>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar> */}
          {session != null ? (
            <>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                  >
                    {session?.user.name}
                    <Badge>  {session?.user.role}
                    </Badge>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="delete" className="text-danger" color="danger" onClick={() => signOut()}>
                    Đăng xuất
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <div>
              <Button onClick={() => { router.push('/auth/login') }} >
                Đăng nhập
              </Button>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
