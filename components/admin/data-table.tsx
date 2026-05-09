"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useMemo } from "react"

interface Column<T> {
  key: string
  header: string
  cell: (item: T) => React.ReactNode
  sortable?: boolean
}

interface Filter {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  filters?: Filter[]
  pageSize?: number
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filters = [],
  pageSize = 10
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search
    if (search && searchKeys.length > 0) {
      const lowerSearch = search.toLowerCase()
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key]
          return typeof value === "string" && value.toLowerCase().includes(lowerSearch)
        })
      )
    }

    // Apply filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== "all") {
        result = result.filter((item) => {
          const itemValue = (item as Record<string, unknown>)[key]
          return itemValue === value
        })
      }
    })

    return result
  }, [data, search, searchKeys, filterValues])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 bg-secondary border-0"
          />
        </div>
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filterValues[filter.key] || "all"}
            onValueChange={(value) => handleFilterChange(filter.key, value)}
          >
            <SelectTrigger className="w-[150px] bg-secondary border-0">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filter.label}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.key} className="text-muted-foreground">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id} className="border-border">
                  {columns.map((column) => (
                    <TableCell key={column.key}>{column.cell(item)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
          {filteredData.length} results
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
