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
            avatar_url: `https://ui-avatars.com/api/?name=${handle}&background=random`,
            last_scraped_at: null
        })
        setHandle("")
        setTags("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm p-6 bg-white">
                <DialogHeader>
                    <DialogTitle className="font-black uppercase text-xl">Adicionar perfil</DialogTitle>
                    <DialogDescription className="font-medium text-black">
                        Digite o handle ou a URL do concorrente que deseja rastrear.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="font-bold uppercase text-xs">Platform</Label>
                        <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
                            <SelectTrigger className="border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-0 focus:border-black focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all font-medium">
                                <SelectValue placeholder="Selecionar plataforma" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <SelectItem value="instagram" className="focus:bg-purple-100 focus:text-black font-medium cursor-pointer">Instagram</SelectItem>
                                <SelectItem value="tiktok" className="focus:bg-purple-100 focus:text-black font-medium cursor-pointer">TikTok</SelectItem>
                                <SelectItem value="youtube" className="focus:bg-purple-100 focus:text-black font-medium cursor-pointer">YouTube</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="handle" className="font-bold uppercase text-xs">Handle</Label>
                        <Input
                            id="handle"
                            placeholder="@usuario"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className="border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:border-black focus-visible:translate-y-[-2px] focus-visible:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags" className="font-bold uppercase text-xs">Tags (separadas por vírgula)</Label>
                        <Input
                            id="tags"
                            placeholder="Moda, Concorrente, Ref"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:border-black focus-visible:translate-y-[-2px] focus-visible:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-2 border-black rounded-sm font-bold uppercase hover:bg-red-100 hover:text-red-700 bg-white text-black hover:border-black transition-all"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!handle}
                        className="border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold uppercase bg-primary text-primary-foreground hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Adicionar perfil
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
