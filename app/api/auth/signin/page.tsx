import { getServerSession } from "next-auth"
import { authOptions } from "../[...nextauth]/route"
import { redirect } from "next/navigation"
import { SignIn } from "@/components/signin"

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  if (session) {
    redirect("/")
  }

  return <SignIn />
}

