"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function createTask(data: {
  title: string
  description?: string
  receiptId: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        receiptId: data.receiptId,
        status: "Open",
      },
    })

    return { success: true, task }
  } catch (error: any) {
    console.error("Error creating task:", error)
    return { success: false, error: error.message || "Failed to create task" }
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { status },
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error updating task:", error)
    return { success: false, error: error.message || "Failed to update task" }
  }
}

