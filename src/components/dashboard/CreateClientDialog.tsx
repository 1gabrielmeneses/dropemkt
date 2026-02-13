"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/store/useStore"
import { Loader2 } from "lucide-react"

interface CreateClientDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateClientDialog({ open, onOpenChange }: CreateClientDialogProps) {
    const { addClient, enrichClient, clients } = useStore()

    const [step, setStep] = useState(1) // 1: Input, 2: AI Processing, 3: Confirmation
    const [name, setName] = useState("")
    const [instagram, setInstagram] = useState("")
    const [brief, setBrief] = useState("")

    // Simulated progress messages
    const [progressMessage, setProgressMessage] = useState("Inicializando análise...")
    const messages = [
        "Buscando perfil no Instagram...",
        "Analisando métricas de engajamento...",
        "Identificando nicho e concorrentes...",
        "Gerando estratégia de conteúdo...",
        "Finalizando cadastro..."
    ]

    useEffect(() => {
        if (step === 2) {
            let i = 0;
            setProgressMessage(messages[0])
            const interval = setInterval(() => {
                i++;
                if (i < messages.length) {
                    setProgressMessage(messages[i])
                }
            }, 2500) // Change message every 2.5s
            return () => clearInterval(interval)
        }
    }, [step])



    const handleSubmit = async () => {
        setStep(2)

        // Create Client
        await addClient(name, brief, instagram)

        // Trigger Webhook
        try {
            await fetch("https://autowebhook.maxmizeai.com/webhook/9980ff97-5b0a-4d50-8ff6-f06f4c5a949b", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    usuario_instagram: instagram,
                }),
            })
        } catch (error) {
            console.error("Error triggering webhook:", error)
        }

        // Fetch the newly created client (it is set as active)
        const { getActiveClient, activeClientId } = useStore.getState();
        const newClient = getActiveClient();

        if (newClient && newClient.id && instagram) {
            // Trigger Enrichment
            await enrichClient(newClient.id, instagram, name)
        }

        setStep(3)
    }

    const reset = () => {
        setStep(1)
        setName("")
        setInstagram("")
        setBrief("")
    }

    // Reset when closed
    if (!open && step !== 1) {
        setTimeout(reset, 300)
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) reset();
            onOpenChange(val);
        }}>
            <DialogContent className="sm:max-w-md border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm p-6" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="font-black uppercase text-xl">
                        {step === 1 && "Novo cliente"}
                        {step === 2 && "Analisando nicho do cliente..."}
                        {step === 3 && "Estratégia pronta"}
                    </DialogTitle>
                    <DialogDescription className="font-medium text-black/70">
                        {step === 1 && "Preencha os dados do cliente para começar a rastrear concorrentes."}
                        {step === 2 && "Nossa IA está montando o perfil de conteúdo..."}
                        {step === 3 && "Perfil do cliente criado com sucesso."}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="client-name" className="font-bold uppercase">Nome do cliente ou projeto</Label>
                            <Input
                                id="client-name"
                                placeholder="ex: Marca Fitness"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client-instagram" className="font-bold uppercase">Usuário do Instagram</Label>
                            <Input
                                id="client-instagram"
                                placeholder="@username"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                className="border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client-brief" className="font-bold uppercase">Briefing</Label>
                            <textarea
                                id="client-brief"
                                className="flex min-h-[80px] w-full rounded-sm border-2 border-black bg-transparent px-3 py-2 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Descreva o nicho e os objetivos do cliente..."
                                value={brief}
                                onChange={(e) => setBrief(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-black mb-4" />
                        <p className="text-sm font-bold uppercase animate-pulse">{progressMessage}</p>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 py-4">
                        <div className="rounded-sm bg-green-50 p-4 text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <p className="font-black uppercase text-green-800">Sucesso!</p>
                            <p className="text-black mt-1 font-medium">
                                Contexto criado para <strong>{name}</strong>. Agora você pode adicionar perfis e encontrar conteúdo.
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 1 && (
                        <Button
                            onClick={handleSubmit}
                            disabled={!name || !instagram}
                            className="bg-black text-white border-2 border-black rounded-sm font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            Analisar e criar
                        </Button>
                    )}
                    {step === 3 && (
                        <Button
                            onClick={() => {
                                reset();
                                onOpenChange(false);
                            }}
                            className="bg-purple-600 text-white border-2 border-black rounded-sm font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-700 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            Ir para o dashboard
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
