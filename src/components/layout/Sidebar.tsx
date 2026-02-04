"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Search,
    CalendarDays,
    Settings,
    Menu,
    ChevronDown,
    PlusCircle,
    UserCircle,
    LogOut,
    Users
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { useStore } from "@/store/useStore"
import { CreateClientDialog } from "@/components/dashboard/CreateClientDialog"
import { Trash2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Discovery",
        url: "/dashboard/discovery",
        icon: Search,
    },
    {
        title: "Calendário",
        url: "/dashboard/calendar",
        icon: CalendarDays,
    },
    {
        title: "Configurações",
        url: "/dashboard/settings",
        icon: Settings,
    },
]

export function Sidebar() {
    const { fetchClients } = useStore() // Fetch clients on mount

    useEffect(() => {
        fetchClients()
    }, [fetchClients])

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background hidden md:flex flex-col">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    Dropê Analytics
                </Link>
            </div>
            <div className="py-4 space-y-4 flex-1">
                <div className="px-4">
                    <ClientSwitcher />
                </div>
                <SidebarContent />
            </div>
            <div className="p-4 border-t space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tema</span>
                    <ThemeToggle />
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                    onClick={async () => {
                        const supabase = createClient()
                        await supabase.auth.signOut()
                        window.location.href = '/login'
                    }}
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </Button>
            </div>
        </aside>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
                <div className="flex h-14 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary" onClick={() => setOpen(false)}>
                        Dropê Analytics
                    </Link>
                </div>
                <div className="py-4 space-y-4 flex-1">
                    <div className="px-4">
                        <ClientSwitcher />
                    </div>
                </div>
                <SidebarContent onItemClick={() => setOpen(false)} />
                <div className="p-4 border-t mt-auto space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tema</span>
                        <ThemeToggle />
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                        onClick={async () => {
                            const supabase = createClient()
                            await supabase.auth.signOut()
                            window.location.href = '/login'
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

function ClientSwitcher() {
    const { clients, activeClientId, setActiveClient, getActiveClient, deleteClient } = useStore()
    const activeClient = getActiveClient()
    const [createOpen, setCreateOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const handleDelete = async () => {
        if (deleteId) {
            await deleteClient(deleteId)
            setDeleteId(null)
        }
    }

    return (
        <>
            <CreateClientDialog open={createOpen} onOpenChange={setCreateOpen} />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O cliente e todos os dados associados serão excluídos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between px-3 h-12 font-normal">
                        <div className="flex items-center gap-3 truncate">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={activeClient?.logo_url || ""} alt={activeClient?.name || undefined} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {activeClient?.name?.[0] || "?"}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate font-medium">{activeClient?.name || "Selecionar cliente"}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="start">
                    <DropdownMenuLabel>Meus clientes</DropdownMenuLabel>

                    {clients.map(client => (
                        <div key={client.id} className="relative flex items-center group">
                            <DropdownMenuItem
                                onClick={() => setActiveClient(client.id)}
                                className="flex-1 cursor-pointer gap-3 min-w-0 pr-10 h-12"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={client.logo_url || ""} alt={client.name || undefined} />
                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                        {client.name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col truncate">
                                    <span className={cn("truncate font-medium", activeClientId === client.id && "text-primary")}>
                                        {client.name}
                                    </span>
                                    {client.brief && (
                                        <span className="text-xs text-muted-foreground truncate w-32">
                                            {client.brief.split('\n')[0]}
                                        </span>
                                    )}
                                </div>
                                {activeClientId === client.id && (
                                    <div className="absolute right-9 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </DropdownMenuItem>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteId(client.id)
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setCreateOpen(true)}
                        className="gap-2 text-muted-foreground hover:text-primary cursor-pointer h-10"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Novo cliente
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname()
    return (
        <nav className="grid gap-1 px-2">
            {items.map((item) => (
                <Link
                    key={item.title}
                    href={item.url}
                    onClick={onItemClick}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === item.url ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                </Link>
            ))}
        </nav>
    )
}
