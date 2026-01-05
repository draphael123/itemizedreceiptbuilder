"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  templateData: z.string(),
  isPublic: z.boolean().default(false),
})

export async function createTemplate(data: z.infer<typeof templateSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const template = await prisma.receiptTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        templateData: data.templateData,
        isPublic: data.isPublic,
        createdById: session.user.id,
      },
    })

    return { success: true, template }
  } catch (error: any) {
    console.error("Error creating template:", error)
    return { success: false, error: error.message || "Failed to create template" }
  }
}

export async function getTemplates(userId?: string, includePublic = true) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const templates = await prisma.receiptTemplate.findMany({
      where: {
        OR: [
          { createdById: session.user.id },
          ...(includePublic ? [{ isPublic: true }] : []),
        ],
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, templates }
  } catch (error: any) {
    console.error("Error fetching templates:", error)
    return { success: false, error: error.message || "Failed to fetch templates" }
  }
}

export async function deleteTemplate(templateId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const template = await prisma.receiptTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template || (template.createdById !== session.user.id && !template.isPublic)) {
      return { success: false, error: "Template not found or unauthorized" }
    }

    await prisma.receiptTemplate.delete({
      where: { id: templateId },
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting template:", error)
    return { success: false, error: error.message || "Failed to delete template" }
  }
}

