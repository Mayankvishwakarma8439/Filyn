import { getCurrentUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";
import SignInForm from "@/components/SignInForm";

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return <SignInForm />;
}
