import { DatabaseZap, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissingDataPlaceholderProps {
    message?: string;
    subMessage?: string;
    className?: string;
    icon?: React.ElementType;
}

export function MissingDataPlaceholder({
    message = "Nenhum dado disponível",
    subMessage = "Ainda não há dados para esta métrica.",
    className,
    icon: Icon = DatabaseZap
}: MissingDataPlaceholderProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center h-full w-full min-h-[150px] p-6 text-center animate-in fade-in duration-500", className)}>
            <div className="bg-primary/5 p-4 rounded-full mb-4">
                <Icon className="h-8 w-8 text-primary/40" />
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">{message}</h3>
            <p className="text-xs text-muted-foreground/60 max-w-[200px]">{subMessage}</p>
        </div>
    )
}
