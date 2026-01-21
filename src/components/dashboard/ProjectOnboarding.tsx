"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Need to install or use basic textarea
import { useStore } from "@/store/useStore"
import { Loader2 } from "lucide-react"

export function ProjectOnboarding() {
    const { clients, addClient } = useStore()
    const isConfigured = clients.length > 0
    const [open, setOpen] = useState(false)

    const [step, setStep] = useState(1) // 1: Input, 2: AI Processing, 3: Confirmation
    const [name, setName] = useState("")
    const [brief, setBrief] = useState("")

    useEffect(() => {
        if (!isConfigured) {
            setOpen(true)
        }
    }, [isConfigured])

    const handleSubmit = async () => {
        setStep(2)
        // Simulate AI processing time
        setTimeout(() => {
            setStep(3)
        }, 2000)
    }

    const handleConfirm = async () => {
        await addClient(name, brief)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>
                        {step === 1 && "Create New Project"}
                        {step === 2 && "Analyzing Briefing..."}
                        {step === 3 && "Project Strategy Ready"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1 && "Start by defining your client or niche."}
                        {step === 2 && "Our AI is extracting key niches and competitor suggestions..."}
                        {step === 3 && "Here is what we found based on your briefing."}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input id="name" placeholder="e.g. EcoFriendly Bottle Launch" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brief">Briefing / Goals</Label>
                            <Textarea
                                id="brief"
                                placeholder="We want to analyze competitors in the sustainable lifestyle niche on TikTok..."
                                value={brief}
                                onChange={(e) => setBrief(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-sm text-muted-foreground">Finding top Creators...</p>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 py-4">
                        <div className="rounded-lg bg-muted p-4 text-sm">
                            <p className="font-semibold mb-2">AI Summary:</p>
                            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                <li>Niche: Sustainable Living & Eco-Products</li>
                                <li>Primary Platform: TikTok & Instagram Reels</li>
                                <li>Suggested Content: "Day in the life", "Unboxing", "Educational Eco-tips"</li>
                            </ul>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 1 && (
                        <Button onClick={handleSubmit} disabled={!name || !brief}>Genererate Strategy</Button>
                    )}
                    {step === 3 && (
                        <Button onClick={handleConfirm}>Start Dashboard</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
