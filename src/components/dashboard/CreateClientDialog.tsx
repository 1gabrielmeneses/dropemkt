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
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>
                        {step === 1 && "Add New Client"}
                        {step === 2 && "Analyzing Client Niche..."}
                        {step === 3 && "Strategy Ready"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1 && "Enter the client details to start tracking competitors."}
                        {step === 2 && "Our AI is building the initial content profile..."}
                        {step === 3 && "Client profile created successfully."}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="client-name">Client / Project Name</Label>
                            <Input
                                id="client-name"
                                placeholder="e.g. FitGear Apparel"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client-instagram">Instagram Username</Label>
                            <Input
                                id="client-instagram"
                                placeholder="@username"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client-brief">Briefing</Label>
                            <textarea
                                id="client-brief"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Describe the client's niche and goals..."
                                value={brief}
                                onChange={(e) => setBrief(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-sm text-muted-foreground animate-pulse">{progressMessage}</p>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 py-4">
                        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm border border-green-200 dark:border-green-900">
                            <p className="font-semibold text-green-800 dark:text-green-300">Success!</p>
                            <p className="text-green-700 dark:text-green-400 mt-1">
                                Created context for <strong>{name}</strong>. You can now add profiles and find content.
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 1 && (
                        <Button onClick={handleSubmit} disabled={!name || !instagram}>Analyze & Create</Button>
                    )}
                    {step === 3 && (
                        <Button onClick={() => {
                            reset();
                            onOpenChange(false);
                        }}>Go to Dashboard</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
