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
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r-2 border-black bg-background hidden md:flex flex-col">
            <div className="flex h-14 items-center border-b-2 border-black px-6">
                <Link href="/" className="flex items-center gap-2 font-black text-xl text-primary uppercase tracking-tight">
                    Dropê Analytics
                </Link>
            </div>
            <div className="py-4 space-y-4 flex-1">
                <div className="px-4">
                    <ClientSwitcher />
                </div>
                <SidebarContent />
            </div>
            <div className="p-4 border-t-2 border-black space-y-2">

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground font-bold uppercase"
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
                <Button variant="ghost" size="icon" className="md:hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col border-r-2 border-black">
                <div className="flex h-14 items-center border-b-2 border-black px-6">
                    <Link href="/" className="flex items-center gap-2 font-black text-xl text-primary uppercase tracking-tight" onClick={() => setOpen(false)}>
                        Dropê Analytics
                    </Link>
                </div>
                <div className="py-4 space-y-4 flex-1">
                    <div className="px-4">
                        <ClientSwitcher />
                    </div>
                </div>
                <SidebarContent onItemClick={() => setOpen(false)} />
                <div className="p-4 border-t-2 border-black mt-auto space-y-2">

                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground font-bold uppercase"
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
                <AlertDialogContent className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-black uppercase">Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription className="font-medium text-black">
                            Esta ação não pode ser desfeita. O cliente e todos os dados associados serão excluídos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm font-bold uppercase hover:bg-gray-100">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm font-bold uppercase hover:bg-red-700 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between px-3 h-12 border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white text-black hover:bg-white hover:text-black">
                        <div className="flex items-center gap-3 truncate">
                            <Avatar className="h-6 w-6 border border-black">
                                <AvatarImage src={activeClient?.logo_url || ""} alt={activeClient?.name || undefined} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                                    {activeClient?.name?.[0] || "?"}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{activeClient?.name || "Selecionar cliente"}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-100" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" align="start">
                    <DropdownMenuLabel className="uppercase font-black border-b-2 border-black mb-1">Meus clientes</DropdownMenuLabel>

                    {clients.map(client => (
                        <div key={client.id} className="relative flex items-center group">
                            <DropdownMenuItem
                                onClick={() => setActiveClient(client.id)}
                                className={cn("flex-1 cursor-pointer gap-3 min-w-0 pr-10 h-12 focus:bg-purple-100 focus:text-black font-medium border-2 border-transparent focus:border-black rounded-sm mx-1 my-0.5", activeClientId === client.id && "bg-purple-50")}
                            >
                                <Avatar className="h-8 w-8 border border-black">
                                    <AvatarImage src={client.logo_url || ""} alt={client.name || undefined} />
                                    <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                                        {client.name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col truncate">
                                    <span className={cn("truncate font-bold uppercase text-[10px]", activeClientId === client.id && "text-primary")}>
                                        {client.name}
                                    </span>
                                    {client.brief && (
                                        <span className="text-[10px] text-muted-foreground truncate w-32 font-medium">
                                            {client.brief.split('\n')[0]}
                                        </span>
                                    )}
                                </div>
                                {activeClientId === client.id && (
                                    <div className="absolute right-9 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border border-white ring-1 ring-black" />
                                )}
                            </DropdownMenuItem>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-black hover:bg-red-100 hover:text-red-600 border border-transparent hover:border-black rounded-sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteId(client.id)
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <DropdownMenuSeparator className="bg-black" />
                    <DropdownMenuItem
                        onClick={() => setCreateOpen(true)}
                        className="gap-2 text-primary font-bold uppercase cursor-pointer h-10 hover:bg-primary/10 focus:bg-primary/10 mx-1 border-2 border-transparent focus:border-primary/50 rounded-sm"
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
        <nav className="grid gap-2 px-2">
            {items.map((item) => (
                <Link
                    key={item.title}
                    href={item.url}
                    onClick={onItemClick}
                    className={cn(
                        "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-bold uppercase transition-all",
                        pathname === item.url
                            ? "bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px]"
                            : "text-muted-foreground hover:bg-purple-100 hover:text-black hover:border-black border-2 border-transparent hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                </Link>
            ))}
        </nav>
    )
}
