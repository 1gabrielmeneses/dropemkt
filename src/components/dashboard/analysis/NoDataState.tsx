import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface NoDataStateProps {
    message?: string
}

export function NoDataState({ message = "Dados não disponíveis para esta seção." }: NoDataStateProps) {
    return (
        <Card className="bg-gray-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
                <div className="bg-white p-4 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <AlertCircle className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-black uppercase text-black">
                    Sem Dados
                </h3>
                <p className="text-muted-foreground font-medium max-w-sm">
                    {message}
                </p>
            </CardContent>
        </Card>
    )
}
