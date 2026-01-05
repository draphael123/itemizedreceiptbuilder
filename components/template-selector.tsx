"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTemplates } from "@/app/actions/templates"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Loader2 } from "lucide-react"

interface TemplateSelectorProps {
  onSelectTemplate: (templateData: any) => void
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    async function loadTemplates() {
      try {
        const result = await getTemplates()
        if (result.success && result.templates) {
          setTemplates(result.templates)
        }
      } catch (error) {
        console.error("Error loading templates:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTemplates()
  }, [])

  const handleLoadTemplate = () => {
    if (!selectedTemplateId) {
      toast({
        title: "No template selected",
        description: "Please select a template to load",
        variant: "destructive",
      })
      return
    }

    const template = templates.find((t) => t.id === selectedTemplateId)
    if (template) {
      try {
        const templateData = JSON.parse(template.templateData)
        onSelectTemplate(templateData)
        toast({
          title: "Template loaded",
          description: `Loaded template: ${template.name}`,
        })
      } catch (error) {
        toast({
          title: "Error loading template",
          description: "Failed to parse template data",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Receipt Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No templates available. Create a template from a receipt to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Load Receipt Template
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Template</label>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                    {template.isPublic && " (Public)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleLoadTemplate}
            disabled={!selectedTemplateId}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Load Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

