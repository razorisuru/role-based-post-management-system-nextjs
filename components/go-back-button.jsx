"use client"

export function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-input bg-background font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Go Back
    </button>
  )
}
