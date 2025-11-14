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

//TODO : IMPROVE THE DESIGN OF OTP SLOTS, CURRENTLY THEY JUST INCREASE THE OUTER DIV'S WIDTH WHEN FILLED

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
      <AlertDialogContent className="!rounded-2xl">
        <AlertDialogHeader className="relative flex justify-center ">
          <AlertDialogTitle className=" text-center text-xl flex justify-center">
            Enter your OTP
            <img
              src="/assets/icons/close-dark.svg"
              alt="close"
              className="relative h-[20px] w-[20px] left-[50px] bottom-[15px] sm:left-[150px] cursor-pointer "
              onClick={() => setOpen(false)}
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="flex justify-center overflow-auto text-light-100 m-2">
            <span>
              We've sent your code to the&nbsp;{" "}
              <span className="text-red">{email}</span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={OTP} onChange={setOTP}>
            <InputOTPGroup className="space-x-2 sm:space-x-4 md:space-x-8">
              <InputOTPSlot
                index={0}
                className="w-10 md:w-full md:p-5 !rounded-xl"
              />
              <InputOTPSlot
                index={1}
                className="w-10 md:w-full md:p-5 !rounded-xl"
              />
              <InputOTPSlot
                index={2}
                className="w-10 md:w-full md:p-5 !rounded-xl"
              />
              <InputOTPSlot
                index={3}
                className="w-10 md:w-full md:p-5 !rounded-xl"
              />
              <InputOTPSlot
                index={4}
                className="w-10 md:w-full md:p-5 !rounded-xl"
              />
              <InputOTPSlot
                index={5}
                className="w-10 md:w-full md:p-5 !rounded-xl"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <AlertDialogFooter className="flex justify-center p-2">
          <AlertDialogAction
            className="rounded-3xl w-full bg-red text-white h-10 hover:bg-rose-600"
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
        <div className="text-sm flex justify-center">
          Didn't get a code?{" "}
          <p className="ml-2 text-red cursor-pointer" onClick={handleResendOtp}>
            Click to resend
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
