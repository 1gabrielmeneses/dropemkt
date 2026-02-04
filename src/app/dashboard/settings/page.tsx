
"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/store/useStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Trash2, Key, Plus, Copy, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    const { getActiveClient, updateClient, deleteClient, addApiToken, deleteApiToken } = useStore()
    const activeClient = getActiveClient()

    const [name, setName] = useState("")
    const [brief, setBrief] = useState("")
    const [instagram, setInstagram] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // API Token states
    const [newTokenName, setNewTokenName] = useState("")
    const [newTokenValue, setNewTokenValue] = useState("")
    const [tokenLoading, setTokenLoading] = useState(false)
    const [copiedTokenId, setCopiedTokenId] = useState<number | null>(null)

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

    const handleAddToken = async () => {
        if (!newTokenName || !newTokenValue) return
        setTokenLoading(true)
        await addApiToken(newTokenName, newTokenValue)
        setNewTokenName("")
        setNewTokenValue("")
        setTokenLoading(false)
    }

    const handleDeleteToken = async (id: number) => {
        await deleteApiToken(id)
    }

    const copyToClipboard = (token: string, id: number) => {
        navigator.clipboard.writeText(token)
        setCopiedTokenId(id)
        setTimeout(() => setCopiedTokenId(null), 2000)
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Configurações</h1>
                <p className="text-muted-foreground mt-1">Gerenciar detalhes de {activeClient.name}</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="profile">Perfil do cliente</TabsTrigger>
                    <TabsTrigger value="tokens">API Tokens</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 mt-6">
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
                </TabsContent>

                <TabsContent value="tokens" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gerenciar API Tokens</CardTitle>
                            <CardDescription>Adicione chaves de API para serviços externos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="tokenName">Nome do Serviço</Label>
                                    <Input
                                        id="tokenName"
                                        placeholder="Ex: OpenAI"
                                        value={newTokenName}
                                        onChange={(e) => setNewTokenName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 flex-[2]">
                                    <Label htmlFor="tokenValue">Chave da API</Label>
                                    <Input
                                        id="tokenValue"
                                        placeholder="sk-..."
                                        value={newTokenValue}
                                        onChange={(e) => setNewTokenValue(e.target.value)}
                                        type="password"
                                    />
                                </div>
                                <Button onClick={handleAddToken} disabled={tokenLoading || !newTokenName || !newTokenValue}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <Label>Tokens Ativos</Label>
                                {activeClient.apiTokens?.length === 0 ? (
                                    <div className="text-sm text-muted-foreground border border-dashed rounded-lg p-8 text-center">
                                        Nenhum token configurado ainda.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {activeClient.apiTokens?.map((token) => (
                                            <div key={token.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <Key className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="grid gap-0.5">
                                                        <p className="text-sm font-medium">{token.name}</p>
                                                        <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px] sm:max-w-md">
                                                            {token.token.substring(0, 8)}...{token.token.substring(token.token.length - 4)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => copyToClipboard(token.token, token.id)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        title="Copiar token"
                                                    >
                                                        {copiedTokenId === token.id ? (
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Remover token?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    O token <strong>{token.name}</strong> será removido permanentemente. Integrações que utilizam este token pararão de funcionar.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteToken(token.id)} className="bg-red-600 hover:bg-red-700">
                                                                    Remover
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
