import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4 md:px-6">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="hidden font-bold sm:inline-block text-xl text-primary">
                        Dropê Analytics
                    </span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link href="/features" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Features
                    </Link>
                    <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Pricing
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        About
                    </Link>
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                            <form action="/auth/signout" method="GET">
                                <Button variant="ghost" type="submit">
                                    Logout
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button>
                                Get Started
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
