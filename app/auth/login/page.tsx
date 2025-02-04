"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { login } from "@/actions/auth/login";
import { useSession } from "next-auth/react";
import { Socials } from "@/components/auth/socials";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FormError } from "@/components/form/form-error";

export default function SignIn() {
  const searchParams = useSearchParams();
  const loginError = searchParams.get("error");

  const urlError =
    loginError === "OAuthAccountNotLinked" ? "Email already in use" : "";

  const session = useSession();

  const [isPending, startTransition] = useTransition();

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      // const data = await login(values, callbackUrl);
      const data = await login(values);

      try {
        if (data?.error) {
          console.error(data.error);
          toast.error(data?.error || "Something went wrong!");
        }

        if (data?.success) {
          form.reset();

          session.update();
        }

        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }
      } catch (error) {
        console.error("ERROR", error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-custom-4 max-lg:bg-gradient-to-tr from-custom-2/25 to-custom-1/25">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gray-300 dark:bg-teal-400" />
        <div className="relative z-20 flex items-center justify-center w-[90%] text-lg font-medium">
          <Link
            href="/"
            className="text-custom-1 text-3xl font-bold font-kyiv flex items-center"
          >
            <Image
              src="/logo.svg"
              alt="Properly"
              width={56}
              height={56}
              className="w-14 h-14"
            />
            Properly
          </Link>
        </div>

        <Image
          src="/leohoho.png"
          alt="Hero"
          fill
          priority
          className="object-cover opacity-20"
          sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
        />

        <div className="relative z-20 mt-auto text-foreground">
          <blockquote className="space-y-2">
            <p className="text-lg font-semibold">
              {`"Properly has revolutionized how we manage our properties. It's intuitive, efficient, and has greatly improved our communication with tenants."`}
            </p>
            <footer className="text-sm">Sofia Davis, Property Manager</footer>
          </blockquote>
        </div>
      </div>

      <div className="lg:p-8 w-full">
        <div className="relative z-20 flex lg:hidden items-center justify-center w-[90%] text-lg font-medium mb-8">
          <Link
            href="/"
            className="text-custom-1 text-3xl font-bold font-kyiv flex items-center"
          >
            <Image
              src="/logo.svg"
              alt="Properly"
              width={56}
              height={56}
              className="w-14 h-14"
            />
            Properly
          </Link>
        </div>
        <div className="border-2 rounded-lg p-8 shadow-md m-4">
          <div className="w-full flex flex-col justify-center items-center">
            <div className="text-2xl md:text-3xl text-center font-semibold font-nunito mt-4 md:mt-0">
              Log Into Your Account
            </div>
            <div className="text-lg md:text-xl text-center font-semibold font-nunito">
              Let&apos;s get you into your account
            </div>
          </div>
          <Separator className="my-4 bg-custom-1" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Two-Factor Code
                      </FormLabel>
                      <FormControl>
                        <InputOTP disabled={isPending} {...field} maxLength={6}>
                          <InputOTPGroup className="flex-1 w-[300px]">
                            <InputOTPSlot className="w-1/6" index={0} />
                            <InputOTPSlot className="w-1/6" index={1} />
                            <InputOTPSlot className="w-1/6" index={2} />
                            <InputOTPSlot className="w-1/6" index={3} />
                            <InputOTPSlot className="w-1/6" index={4} />
                            <InputOTPSlot className="w-1/6" index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled={isPending}
                            {...field}
                            placeholder="name@example.com"
                            id="email"
                            autoCorrect="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold flex justify-between">
                          <span>Password</span>
                          <Link
                            href="/auth/reset-password"
                            className="text-sm text-primary hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={isPending}
                            {...field}
                            placeholder="Enter password"
                            id="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {showTwoFactor ? (
                <Button
                  className="w-full bg-custom-1 hover:bg-custom-1"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Validating
                    </>
                  ) : (
                    <>Validate</>
                  )}
                </Button>
              ) : (
                <Button
                  className="w-full bg-custom-1 hover:bg-custom-1"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Signing In
                    </>
                  ) : (
                    <>
                      Login
                      <LogIn className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </form>
          </Form>
          <div className="flex items-center justify-center mt-4">
            <Link
              href="/auth/register"
              className="text-sm text-primary hover:underline"
            >
              Property Manager? Create an account
            </Link>
          </div>
          {urlError && (
            <div className="mt-2">
              <FormError message={urlError} />
            </div>
          )}
          <Socials text="logging in" />
        </div>
      </div>
    </div>
  );
}
