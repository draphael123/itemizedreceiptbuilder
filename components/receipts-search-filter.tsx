"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ReceiptsSearchFilterProps {
  onSearchChange: (search: string) => void
  onFilterChange: (filters: {
    state?: string
    minAmount?: number
    maxAmount?: number
    startDate?: string
    endDate?: string
    sortBy?: string
  }) => void
}

export function ReceiptsSearchFilter({ onSearchChange, onFilterChange }: ReceiptsSearchFilterProps) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({
    state: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    sortBy: "newest",
  })

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange(value)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange({
      state: newFilters.state || undefined,
      minAmount: newFilters.minAmount ? parseFloat(newFilters.minAmount) : undefined,
      maxAmount: newFilters.maxAmount ? parseFloat(newFilters.maxAmount) : undefined,
      startDate: newFilters.startDate || undefined,
      endDate: newFilters.endDate || undefined,
      sortBy: newFilters.sortBy,
    })
  }

  const clearFilters = () => {
    setSearch("")
    setFilters({
      state: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
      sortBy: "newest",
    })
    onSearchChange("")
    onFilterChange({})
  }

  return (
    <Card className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Label htmlFor="search">🔍 Search Receipts</Label>
            <Input
              id="search"
              placeholder="Search by patient name, amount, or date..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Select value={filters.state} onValueChange={(value) => handleFilterChange("state", value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All states" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="NJ">New Jersey</SelectItem>
                <SelectItem value="MD">Maryland</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sortBy">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amountHigh">Amount: High to Low</SelectItem>
                <SelectItem value="amountLow">Amount: Low to High</SelectItem>
                <SelectItem value="name">Patient Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="minAmount">Min Amount ($)</Label>
            <Input
              id="minAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange("minAmount", e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="maxAmount">Max Amount ($)</Label>
            <Input
              id="maxAmount"
              type="number"
              step="0.01"
              placeholder="9999.99"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={clearFilters} className="bg-white">
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

