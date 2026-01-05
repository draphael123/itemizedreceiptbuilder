import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignIn } from "@/components/signin"
import { getDevSession } from "@/lib/auth-dev"

export default async function SignInPage() {
  // Check if dev auth is enabled
  if (process.env.ENABLE_DEV_AUTH === "true") {
    const devSession = await getDevSession()
    if (devSession) {
      redirect("/")
    }
  }

  const session = await auth()
  if (session) {
    redirect("/")
  }

  return <SignIn />
}

