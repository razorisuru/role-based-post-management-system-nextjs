'use client'

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  href,
  ...props
}) => (
  <Link
    href={href}
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      isActive
        ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
        : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      size === "default" ? "h-9 px-4 py-2" : "h-9 w-9",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  href,
  disabled,
  ...props
}) => (
  <Link
    href={href}
    aria-label="Go to previous page"
    className={cn(
      "inline-flex items-center justify-center gap-1 pl-2.5 pr-3 h-9 rounded-md border border-input bg-background text-sm font-medium transition-colors",
      disabled 
        ? "pointer-events-none opacity-50" 
        : "hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  >
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    <span>Previous</span>
  </Link>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  href,
  disabled,
  ...props
}) => (
  <Link
    href={href}
    aria-label="Go to next page"
    className={cn(
      "inline-flex items-center justify-center gap-1 pr-2.5 pl-3 h-9 rounded-md border border-input bg-background text-sm font-medium transition-colors",
      disabled 
        ? "pointer-events-none opacity-50" 
        : "hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  >
    <span>Next</span>
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </Link>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
