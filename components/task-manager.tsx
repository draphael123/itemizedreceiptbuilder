"use client"

import { useState } from "react"
import { Task } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createTask, updateTaskStatus } from "@/app/actions/tasks"

interface TaskManagerProps {
  receiptId: string
  tasks: Task[]
}

export function TaskManager({ receiptId, tasks: initialTasks }: TaskManagerProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const { toast } = useToast()

  const handleCreateTask = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const result = await createTask({
        title,
        description,
        receiptId,
      })

      if (result.success && result.task) {
        setTasks([...tasks, result.task])
        setTitle("")
        setDescription("")
        toast({
          title: "Success",
          description: "Task created successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create task",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Open" ? "Completed" : "Open"
    try {
      const result = await updateTaskStatus(taskId, newStatus)
      if (result.success) {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        )
        toast({
          title: "Success",
          description: `Task marked as ${newStatus.toLowerCase()}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="taskTitle">Create New Task</Label>
          <Input
            id="taskTitle"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={handleCreateTask} disabled={isCreating} size="sm">
            Create Task
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Linked Tasks</h3>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks linked to this receipt</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Status: {task.status}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(task.id, task.status)}
                  >
                    {task.status === "Open" ? "Mark Complete" : "Reopen"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

