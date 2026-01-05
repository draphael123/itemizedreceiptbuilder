"use client"

import { useState } from "react"
import { PricingRule } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createPricingRule, updatePricingRule, deletePricingRule } from "@/app/actions/pricing-rules"

interface PricingRulesManagerProps {
  initialRules: PricingRule[]
}

const CATEGORIES = ["Pharmacy", "Lab", "Clinical", "Operational", "Core"]

export function PricingRulesManager({ initialRules }: PricingRulesManagerProps) {
  const [rules, setRules] = useState(initialRules)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    planPrice: "",
    planWeeks: "",
    medicationKey: "",
    category: "",
    itemName: "",
    itemDescription: "",
    unitPrice: "",
    quantity: "1",
    isActive: true,
  })

  const handleCreate = async () => {
    if (!formData.planPrice || !formData.planWeeks || !formData.medicationKey || !formData.category || !formData.itemName || !formData.unitPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const result = await createPricingRule({
        planPrice: parseFloat(formData.planPrice),
        planWeeks: parseInt(formData.planWeeks),
        medicationKey: formData.medicationKey,
        category: formData.category,
        itemName: formData.itemName,
        itemDescription: formData.itemDescription || null,
        unitPrice: parseFloat(formData.unitPrice),
        quantity: parseFloat(formData.quantity),
        isActive: formData.isActive,
      })

      if (result.success && result.rule) {
        setRules([...rules, result.rule])
        setFormData({
          planPrice: "",
          planWeeks: "",
          medicationKey: "",
          category: "",
          itemName: "",
          itemDescription: "",
          unitPrice: "",
          quantity: "1",
          isActive: true,
        })
        toast({
          title: "Success",
          description: "Pricing rule created successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create pricing rule",
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

  const handleUpdate = async (rule: PricingRule) => {
    try {
      const result = await updatePricingRule(rule.id, {
        itemName: rule.itemName,
        itemDescription: rule.itemDescription || null,
        unitPrice: rule.unitPrice,
        quantity: rule.quantity,
        isActive: rule.isActive,
      })

      if (result.success) {
        setRules(rules.map((r) => (r.id === rule.id ? { ...rule } : r)))
        setEditingId(null)
        toast({
          title: "Success",
          description: "Pricing rule updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pricing rule",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pricing rule?")) {
      return
    }

    try {
      const result = await deletePricingRule(id)
      if (result.success) {
        setRules(rules.filter((r) => r.id !== id))
        toast({
          title: "Success",
          description: "Pricing rule deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pricing rule",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            ➕ Create New Pricing Rule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="planPrice">Plan Price ($) *</Label>
              <Input
                id="planPrice"
                type="number"
                step="0.01"
                value={formData.planPrice}
                onChange={(e) => setFormData({ ...formData, planPrice: e.target.value })}
                placeholder="199.00"
              />
            </div>
            <div>
              <Label htmlFor="planWeeks">Plan Weeks *</Label>
              <Input
                id="planWeeks"
                type="number"
                value={formData.planWeeks}
                onChange={(e) => setFormData({ ...formData, planWeeks: e.target.value })}
                placeholder="4"
              />
            </div>
            <div>
              <Label htmlFor="medicationKey">Medication Key *</Label>
              <Input
                id="medicationKey"
                value={formData.medicationKey}
                onChange={(e) => setFormData({ ...formData, medicationKey: e.target.value })}
                placeholder="medication-a"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="itemName">Item Name *</Label>
              <Input
                id="itemName"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                placeholder="Item name"
              />
            </div>
            <div>
              <Label htmlFor="unitPrice">Unit Price ($) *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                placeholder="50.00"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="1"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="itemDescription">Item Description</Label>
              <Textarea
                id="itemDescription"
                value={formData.itemDescription}
                onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked as boolean })
                }
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>
          <Button 
            onClick={handleCreate} 
            disabled={isCreating} 
            className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
          >
            {isCreating ? "Creating..." : "✨ Create Rule"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            📋 Existing Pricing Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 border rounded-lg space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{rule.itemName}</h3>
                      {!rule.isActive && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ${rule.planPrice} / {rule.planWeeks} weeks / {rule.medicationKey} / {rule.category}
                    </p>
                    {rule.itemDescription && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {rule.itemDescription}
                      </p>
                    )}
                    <p className="text-sm mt-1">
                      ${rule.unitPrice.toFixed(2)} × {rule.quantity} = $
                      {(rule.unitPrice * rule.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(rule.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

