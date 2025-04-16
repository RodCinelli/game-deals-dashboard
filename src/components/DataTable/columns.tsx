import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Deal } from "../../types"
import { Button } from "../ui/button"

export const columns: ColumnDef<Deal>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Título
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      )
    },
    cell: ({ row }) => {
      const title = row.original.title
      return (
        <div className="flex items-center gap-2">
          <img 
            src={row.original.thumb} 
            alt={title} 
            className="h-16 w-auto rounded" 
          />
          <span className="font-medium">{title}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "salePrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Preço Atual
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.original.salePrice)
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price)
      return <div className="font-medium text-green-600">{formatted}</div>
    },
  },
  {
    accessorKey: "normalPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Preço Original
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.original.normalPrice)
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price)
      return <div className="line-through text-gray-500">{formatted}</div>
    },
  },
  {
    accessorKey: "savings",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Desconto
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      )
    },
    cell: ({ row }) => {
      const savings = parseFloat(row.original.savings)
      return (
        <div className="font-medium text-green-600">{savings.toFixed(0)}%</div>
      )
    },
  },
  {
    accessorKey: "storeID",
    header: "Loja",
    cell: ({ row }) => {
      const storeID = parseInt(row.original.storeID) - 1
      return (
        <div className="flex justify-center">
          <img 
            src={`https://www.cheapshark.com/img/stores/icons/${storeID}.png`} 
            alt="Store" 
            className="h-6 w-6" 
          />
        </div>
      )
    },
  },
  {
    accessorKey: "dealRating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Avaliação
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      )
    },
    cell: ({ row }) => {
      const rating = row.original.dealRating ? parseFloat(row.original.dealRating) : 0
      
      // Determinar cor baseada na avaliação
      let ratingColor = "text-red-500"
      if (rating >= 8) {
        ratingColor = "text-green-500"
      } else if (rating >= 5) {
        ratingColor = "text-yellow-500"
      }

      return (
        <div className={`font-bold ${ratingColor}`}>
          {rating.toFixed(1)}
        </div>
      )
    },
  },
] 