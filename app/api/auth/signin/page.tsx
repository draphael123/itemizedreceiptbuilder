import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignIn } from "@/components/signin"

export default async function SignInPage() {
  const session = await auth()
  if (session) {
    redirect("/")
  }

  return <SignIn />
}

