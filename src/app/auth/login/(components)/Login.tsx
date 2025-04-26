"use client";

import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { cn } from "@/lib/utils";
import Loader from "@/components/Loader";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  loginid: z.string().min(1, {
    message: "Vui lòng nhập tài khoản",
  }),
  password: z.string().min(1, {
    message: "Vui lòng nhập Password",
  }),
});

const Login = ({ className }: { className?: string }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const router = useRouter();
  const [show, setShow] = React.useState({
    showPass: false,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      loginid: "",
      password: "",
    },
  });

  useEffect(() => { }, []);

  async function onSubmit(data) {
    console.log(data);
    setIsLoading(true);

    const loginid = data.loginid;
    const password = data.password;

    try {
      const res = await signIn("credentials", {
        loginid,
        password,
        redirect: false,
      });

      if (res.error) {
        toast("Đăng nhập thất bại", {
          description: "Tài khoản hoặc mật khẩu không đúng.",
        });
        setIsLoading(false);
        return;
      }

      console.log("success");
      toast("Đăng nhập thành công", {
        description: "Bạn đã đăng nhập thành công vào tài khoản của mình",
      });
      console.log(res);
      router.refresh();



      router.replace("/");
    } catch (error) { }


  }

  const handleLogout = async () => {
    toast("Đăng xuất thành công", {
      description: "Bạn đã đăng xuất khỏi tài khoản của mình",
    });
    setUser(null);
    router.refresh();
  };

  if (user) {
    return (
      <div>
        You already logged in.
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <Loader />
      </div>
    );
  return (
    <div className="bg-[#ffffff8a] rounded-md w-[36%] h-[540px] flex justify-center items-center">
      <div className="bg-white py-12 rounded-md space-y-6 w-[96%] h-[96%] flex flex-col items-center justify-center">
        <div
          className={cn("grid gap-6 w-[80%] md:w-[70%] lg:w-[60%] ", className)}
        >
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Đăng nhập</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Chào mừng đến với Skylark Portal.
            </p>
          </div>
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="gap-8 flex flex-col">
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="loginid">Tài khoản</Label>
                      <FormField
                        control={form.control}
                        name="loginid"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Nhập tài khoản của bạn"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label>Password</Label>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                renderRight={
                                  <div
                                    onClick={() => {
                                      setShow({
                                        ...show,
                                        showPass: !show.showPass,
                                      });
                                    }}
                                    className="opacity-50 cursor-pointer hover:opacity-100"
                                  >
                                    {show.showPass ? (
                                      <AiFillEyeInvisible size={20} />
                                    ) : (
                                      <AiFillEye size={20} />
                                    )}
                                  </div>
                                }
                                value={field.value}
                                onChange={field.onChange}
                                id="password"
                                placeholder="Nhập mật khẩu"
                                type={show.showPass ? "text" : "password"}
                                autoCapitalize="none"
                                autoComplete="password"
                                autoCorrect="off"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      className={`font-semibold hover:scale-105 transition ease-in-out active:scale-[0.96]`}
                      type="submit"
                    >
                      Đăng nhập
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Quên mật khẩu?
            <Link className="underline ml-1" href="#">
              Liên hệ với Skylark
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
