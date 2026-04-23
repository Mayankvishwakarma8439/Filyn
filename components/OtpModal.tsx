import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { sendEmailOtp, verifyOTP } from "@/lib/actions/users.actions";
import { useRouter } from "next/navigation";

const OtpModal = ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [OTP, setOTP] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const sessionId = await verifyOTP({ accountId, OTP });
      if (!sessionId) alert("Wrong OTP!");
      else router.push("/");
    } catch (error) {
      console.log("Failed to verify OTP", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOtp = async () => {
    setOTP("");
    await sendEmailOtp(email);
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-[92vw] max-w-md rounded-3xl border border-rose-100 bg-white p-6 sm:p-7">
        <AlertDialogHeader className="relative">
          <button
            type="button"
            className="absolute right-0 top-0 rounded-full p-1 hover:bg-rose-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <img
              src="/assets/icons/close-dark.svg"
              alt="close"
              className="h-5 w-5"
            />
          </button>
          <AlertDialogTitle className="text-center text-2xl font-bold text-light-100">
            Enter your OTP
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-center text-sm text-gray-600">
            We&apos;ve sent your code to <span className="text-red">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-2 flex justify-center">
          <InputOTP
            maxLength={6}
            value={OTP}
            onChange={setOTP}
            containerClassName="justify-center"
          >
            <InputOTPGroup className="gap-2 sm:gap-3">
              <InputOTPSlot
                index={0}
                className="!h-12 !w-12 sm:!h-14 sm:!w-14 !rounded-2xl !border-rose-200 !bg-rose-50 !text-light-100"
              />
              <InputOTPSlot
                index={1}
                className="!h-12 !w-12 sm:!h-14 sm:!w-14 !rounded-2xl !border-rose-200 !bg-rose-50 !text-light-100"
              />
              <InputOTPSlot
                index={2}
                className="!h-12 !w-12 sm:!h-14 sm:!w-14 !rounded-2xl !border-rose-200 !bg-rose-50 !text-light-100"
              />
              <InputOTPSlot
                index={3}
                className="!h-12 !w-12 sm:!h-14 sm:!w-14 !rounded-2xl !border-rose-200 !bg-rose-50 !text-light-100"
              />
              <InputOTPSlot
                index={4}
                className="!h-12 !w-12 sm:!h-14 sm:!w-14 !rounded-2xl !border-rose-200 !bg-rose-50 !text-light-100"
              />
              <InputOTPSlot
                index={5}
                className="!h-12 !w-12 sm:!h-14 sm:!w-14 !rounded-2xl !border-rose-200 !bg-rose-50 !text-light-100"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <AlertDialogFooter className="mt-4 flex justify-center p-0">
          <AlertDialogAction
            className="h-11 w-full rounded-full bg-red text-white font-semibold hover:bg-rose-600"
            onClick={handleSubmit}
          >
            Submit
            {isLoading && (
              <img
                src="assets/icons/loader.svg"
                width={20}
                height={20}
                className="ml-2 animate-spin"
              ></img>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
        <div className="mt-3 text-sm text-center text-gray-600">
          Didn&apos;t get a code?{" "}
          <button
            type="button"
            className="ml-1 text-red font-medium hover:text-rose-600"
            onClick={handleResendOtp}
          >
            Click to resend
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
