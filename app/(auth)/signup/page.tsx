import { getCurrentUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/SignUpForm";

export default async function SignUpPage() {
  const user = await getCurrentUser();

  if (user) redirect("/dashboard");

  return <SignUpForm />;
}
