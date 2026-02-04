"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/store/useStore"

interface AddProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddProfileDialog({ open, onOpenChange }: AddProfileDialogProps) {
    const { addProfile } = useStore()
    const [handle, setHandle] = useState("")
    const [platform, setPlatform] = useState<"tiktok" | "instagram" | "youtube">("instagram")
    const [tags, setTags] = useState("")

    const handleSubmit = async () => {
        await addProfile({
            username: handle,
            platform,
            avatar_url: `https://ui-avatars.com/api/?name=${handle}&background=random`
        })
        setHandle("")
        setTags("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Adicionar perfil</DialogTitle>
                    <DialogDescription>
                        Digite o handle ou a URL do concorrente que deseja rastrear.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Platform</Label>
                        <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecionar plataforma" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="handle">Handle</Label>
                        <Input id="handle" placeholder="@usuario" value={handle} onChange={(e) => setHandle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                        <Input id="tags" placeholder="Moda, Concorrente, Ref" value={tags} onChange={(e) => setTags(e.target.value)} />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={!handle}>Adicionar perfil</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
