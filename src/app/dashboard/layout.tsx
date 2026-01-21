import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="md:pl-64 min-h-screen flex flex-col">
                <div className="md:hidden flex items-center h-14 border-b px-4">
                    <MobileSidebar />
                    <span className="ml-2 font-semibold">Menu</span>
                </div>
                <div className="container py-6 px-4 md:px-8 max-w-7xl mx-auto flex-1">
                    {children}
                </div>
            </main>
        </div>
    )
}
