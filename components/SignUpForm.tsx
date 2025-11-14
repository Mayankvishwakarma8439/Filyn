"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccount } from "@/lib/actions/users.actions";
import OtpModal from "@/components/OtpModal";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  email: z.string().nonempty("Required!").email("Invalid email!"),
  fullname: z
    .string()
    .nonempty("Required!")
    .min(3, "Name must be atleast 3 characters")
    .max(50, "Max characters reached!"),
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
    defaultValues: { email: "", fullname: "" },
  });
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const user = await createAccount({
        fullname: data.fullname,
        email: data.email,
      });
      setAccountId(user.accountId);
    } catch (error) {
      if ((error as Error).message === "User already exist") {
        alert("User already exist, please signin to your account.");
        router.push("/signin");
      }
      setErrorMessage("Something went wrong..");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-center items-center space-y-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[70%] fieldset bg-base-200 border-base-300 "
        >
          <legend className="fieldset-legend mb-8 text-4xl font-bold text-slate-700">
            Sign Up
          </legend>
          <div className="space-y-3 shadow-light-300 border-2 border-solid border-gray-50 shadow-lg p-3 rounded-xl">
            <label className="label text-sm">Full name</label>
            <input
              {...register("fullname")}
              type="text"
              className="input block w-full text-sm outline-none"
              placeholder="Enter your full name"
            />
          </div>
          {errors.fullname && (
            <p className="ml-3 mt-2 text-[12px] text-red">
              {errors.fullname.message}
            </p>
          )}
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
            <p>Sign up</p>
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
              Already have an account?{" "}
              <Link href="./signin" className="text-brand-100">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
      {errorMessage && (
        <p className="text-sm text-center text-red">{errorMessage}</p>
      )}
      {accountId && (
        <OtpModal email={getValues("email")} accountId={accountId} />
      )}
    </div>
  );
};

export default page;
