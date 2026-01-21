
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
                <p className="text-muted-foreground">Please select a client to manage settings.</p>
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
                <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage details for {activeClient.name}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Client Profile</CardTitle>
                    <CardDescription>Update the core details for this workspace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Client Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram Username</Label>
                        <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="brief">Briefing / Description</Label>
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
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    {success && <span className="text-sm text-green-600 font-medium animate-in fade-in">Saved successfully!</span>}
                </CardFooter>
            </Card>

            <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions for this client.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            Deleting this client will remove all associated profiles, saved content, and calendar events.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full sm:w-auto">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Client
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete <strong>{activeClient.name}</strong> and remove all data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete Client</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    )
}
