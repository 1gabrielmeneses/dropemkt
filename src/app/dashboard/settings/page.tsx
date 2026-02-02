
"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/store/useStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
    const { getActiveClient, updateClient, deleteClient } = useStore()
    const activeClient = getActiveClient()

    const [name, setName] = useState("")
    const [brief, setBrief] = useState("")
    const [instagram, setInstagram] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (activeClient) {
            setName(activeClient.name || "")
            setBrief(activeClient.brief || "")
            setInstagram(activeClient.instagram_username || "")
        }
    }, [activeClient])

    if (!activeClient) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Selecione um cliente para gerenciar as configurações.</p>
            </div>
        )
    }

    const handleSave = async () => {
        setLoading(true)
        setSuccess(false)
        await updateClient(activeClient.id, {
            name,
            brief,
            instagram_username: instagram
        })
        setLoading(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
    }

    const handleDelete = async () => {
        await deleteClient(activeClient.id)
        // Sidebar will automatically switch active client or show empty state
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Configurações</h1>
                <p className="text-muted-foreground mt-1">Gerenciar detalhes de {activeClient.name}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Perfil do cliente</CardTitle>
                    <CardDescription>Atualize os dados principais deste workspace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do cliente</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instagram">Usuário do Instagram</Label>
                        <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="brief">Briefing / Descrição</Label>
                        <textarea
                            id="brief"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={brief}
                            onChange={(e) => setBrief(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Salvando..." : "Salvar alterações"}
                    </Button>
                    {success && <span className="text-sm text-green-600 font-medium animate-in fade-in">Salvo com sucesso!</span>}
                </CardFooter>
            </Card>

            <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400">Zona de perigo</CardTitle>
                    <CardDescription>Ações irreversíveis para este cliente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Atenção</AlertTitle>
                        <AlertDescription>
                            Excluir este cliente removerá todos os perfis, conteúdo salvo e eventos do calendário associados.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full sm:w-auto">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir cliente
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. O cliente <strong>{activeClient.name}</strong> será excluído permanentemente e todos os dados serão removidos.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Excluir cliente</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    )
}
