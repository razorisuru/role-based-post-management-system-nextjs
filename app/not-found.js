import Link from "next/link"
import { GoBackButton } from "@/components/go-back-button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-6">
        {/* Animated 404 Number */}
        <div className="relative">
          <h1 className="text-[12rem] sm:text-[16rem] font-black text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-20 h-20 sm:w-28 sm:h-28 mx-auto text-primary/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground -mt-8">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm sm:text-base">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </Link>
          <GoBackButton />
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link
              href="/dashboard"
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-border">•</span>
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              Login
            </Link>
            <span className="text-border">•</span>
            <Link
              href="/signup"
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
