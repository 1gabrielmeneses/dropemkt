import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CompetitiveLandscape as CompetitiveLandscapeType } from "@/types/analysis"
import { Swords, Info } from "lucide-react"
import { NoDataState } from "./NoDataState"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface CompetitiveMatrixProps {
    data?: CompetitiveLandscapeType
}

export function CompetitiveMatrix({ data }: CompetitiveMatrixProps) {
    if (!data?.competitive_matrix?.competitors_data) {
        return null
    }

    const { competitors_data, criteria } = data.competitive_matrix

    return (
        <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm overflow-hidden">
            <CardHeader className="bg-gray-100 border-b-2 border-black pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-black font-black uppercase text-xl">
                        <Swords className="h-6 w-6" /> Matriz Competitiva
                    </CardTitle>
                    <Badge variant="outline" className="bg-white text-black border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
                        {competitors_data.length} Concorrentes
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
                <Table>
                    <TableHeader className="bg-black">
                        <TableRow className="hover:bg-black border-b-2 border-black">
                            <TableHead className="text-white font-black uppercase text-xs w-[200px] border-r border-gray-800">Concorrente</TableHead>
                            <TableHead className="text-white font-black uppercase text-xs border-r border-gray-800">Seguidores</TableHead>
                            <TableHead className="text-white font-black uppercase text-xs border-r border-gray-800">Engajamento</TableHead>
                            <TableHead className="text-white font-black uppercase text-xs border-r border-gray-800">Preço</TableHead>
                            <TableHead className="text-white font-black uppercase text-xs border-r border-gray-800">Diferencial</TableHead>
                            <TableHead className="text-white font-black uppercase text-xs">Público Alvo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {competitors_data.map((comp, i) => (
                            <TableRow key={i} className="border-b-2 border-black hover:bg-yellow-50 transition-colors">
                                <TableCell className="font-bold border-r-2 border-black bg-gray-50 uppercase text-xs">
                                    {comp.name}
                                </TableCell>
                                <TableCell className="border-r border-black font-mono text-xs">
                                    <Badge variant="secondary" className="bg-white border border-black text-black rounded-none shadow-sm">
                                        {comp.audience_size}
                                    </Badge>
                                </TableCell>
                                <TableCell className="border-r border-black font-mono text-xs font-bold text-green-700">
                                    {comp.engagement_rate}
                                </TableCell>
                                <TableCell className="border-r border-black text-xs font-medium">
                                    {comp.price_positioning}
                                </TableCell>
                                <TableCell className="border-r border-black text-xs italic bg-blue-50/50">
                                    {comp.differential}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground w-[200px]">
                                    {comp.target_audience}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <div className="bg-yellow-100 p-2 border-t-2 border-black flex items-center gap-2 text-xs font-bold uppercase justify-center">
                <Info className="h-4 w-4" />
                Matriz comparativa baseada em dados públicos
            </div>
        </Card>
    )
}
