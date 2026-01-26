import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export const metadata = {
  title: 'Dashboard | NextBlog',
  description: 'Dashboard - Role-Based Access Control System',
}

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
