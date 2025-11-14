"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserByEmail, sendEmailOtp } from "@/lib/actions/users.actions";
import OtpModal from "@/components/OtpModal";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  email: z.string().nonempty("Required!").email("Invalid email!"),
});
type FormData = z.infer<typeof formSchema>;
const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const user = await getUserByEmail(data.email);
      if (!user) {
        alert("Email doesn't exist!");
        router.push("/signup");
        return;
      }
      const accountId = await sendEmailOtp(data.email);
      if (!accountId) {
        setErrorMessage("No user found with this email");
        return;
      }
      setAccountId(accountId);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to send OTP, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="w-full flex justify-center items-center space-y-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[70%] fieldset bg-base-200 border-base-300 "
        >
          <legend className="fieldset-legend mb-8 text-4xl font-bold text-slate-700">
            Sign In
          </legend>

          <div className="space-y-3 mt-7 shadow-light-300 border-2 border-solid border-gray-50 shadow-lg p-3 rounded-xl">
            <label className="label text-sm">Email</label>
            <input
              {...register("email")}
              type="email"
              className="input w-full block text-sm outline-none"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="ml-3 mt-2 text-[12px] text-red">
              {errors.email.message}
            </p>
          )}
          <button
            disabled={isLoading}
            className="btn btn-neutral p-4 flex justify-center bg-brand text-white w-full rounded-[50px] mt-4"
          >
            <p>Sign in</p>
            {isLoading && (
              <img
                src="assets/icons/loader.svg"
                width={20}
                height={20}
                className="ml-2 animate-spin"
              ></img>
            )}
          </button>

          <div className="flex justify-center items-center mt-[50px]">
            <p className="text-sm text-light-100">
              Don't have an account?{" "}
              <Link href="./signup" className="text-brand-100 cursor-pointer">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
      {accountId && (
        <OtpModal accountId={accountId} email={getValues("email")}></OtpModal>
      )}
    </>
  );
};

export default page;
