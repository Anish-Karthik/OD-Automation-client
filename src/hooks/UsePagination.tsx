import { useState, useMemo } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }, [items, currentPage, itemsPerPage])

  const totalPages = Math.ceil(items.length / itemsPerPage)

  const PaginationComponent = () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}
          />
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i + 1)}
              isActive={currentPage === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}
          />
        
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    paginatedItems,
    Pagination: PaginationComponent,
  }
}