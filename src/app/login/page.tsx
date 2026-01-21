
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message?: string, error?: string }
}) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">DropeMKT</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {searchParams.error && (
                        <div className="bg-red-500/15 text-red-500 text-sm p-3 rounded-md mb-4 text-center">
                            {searchParams.error}
                        </div>
                    )}
                    {searchParams.message && (
                        <div className="bg-green-500/15 text-green-500 text-sm p-3 rounded-md mb-4 text-center">
                            {searchParams.message}
                        </div>
                    )}

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form action={login} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="mkt@drope.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">Sign In</Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form action={signup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-signup">Email</Label>
                                    <Input
                                        id="email-signup"
                                        name="email"
                                        type="email"
                                        placeholder="mkt@drope.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-signup">Password</Label>
                                    <Input
                                        id="password-signup"
                                        name="password"
                                        type="password"
                                        required
                                    />
                                </div>
                                <Button type="submit" variant="secondary" className="w-full">Create Account</Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center text-xs text-muted-foreground mt-4">
                    <p>Protected by Supabase Auth</p>
                </CardFooter>
            </Card>
        </div>
    )
}
