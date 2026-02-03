"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, getDay, parseISO } from "date-fns"
import { useStore } from "@/store/useStore"
import { cn, getEmbedUrl } from "@/lib/utils"
import { ChevronLeft, ChevronRight, GripVertical, Plus, MoreHorizontal, Pencil, Trash, Eye, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMarker, getMarkers, updateMarker, deleteMarker, Marker, createCalendarEvent, getCalendarEvents, deleteCalendarEvent, updateEventRecurrence } from "@/app/actions/calendar"
import { toast } from "sonner"
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Database } from "@/lib/supabase/types"

const MARKER_COLORS = [
    "#FEF3C7", // Amber (Yellow)
    "#FEE2E2", // Red
    "#DCFCE7", // Green
    "#DBEAFE", // Blue
    "#F3E8FF", // Purple
    "#FFEDD5", // Orange
    "#F1F5F9", // Slate
    "#ECFCCB", // Lime
]

type CalendarEvent = Awaited<ReturnType<typeof getCalendarEvents>>[number]
type ContentItem = Database['public']['Tables']['content_items']['Row']

function DraggablePost({ content, onPlay }: { content: ContentItem, onPlay: (url: string) => void }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `post-source-${content.id}`,
        data: { content, type: 'post-source' }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
                "group relative aspect-[9/16] rounded-md overflow-hidden bg-black shadow-sm ring-1 ring-border hover:ring-primary/50 transition-all cursor-grab active:cursor-grabbing select-none",
                isDragging ? "opacity-30 start-dragging" : "opacity-100"
            )}
        >
            {/* Video Cover (Iframe Hack) */}
            <div className="w-full h-full pointer-events-none relative">
                {content.url ? (
                    <div className="absolute inset-0 flex items-center justify-center transform scale-[1.7]">
                        <iframe
                            src={getEmbedUrl(content.url)}
                            className="w-full h-full object-cover"
                            frameBorder="0"
                            scrolling="no"
                            allow="encrypted-media"
                            tabIndex={-1}
                        />
                    </div>
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">Sem vídeo</span>
                    </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="icon"
                    className="rounded-full w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white border-2 border-white/50"
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        // Prevent drag start on button
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (content.url) onPlay(content.url);
                    }}
                >
                    <Play className="h-5 w-5 ml-0.5 fill-white" />
                </Button>
            </div>

            {/* Platform Badge */}
            <div className="absolute top-2 left-2 pointer-events-none">
                <div className={cn(
                    "text-[8px] uppercase font-bold px-1.5 py-0.5 rounded text-white backdrop-blur-md shadow-sm",
                    content.platform === 'tiktok' ? "bg-black/80" : "bg-pink-600/80"
                )}>
                    {content.platform === 'tiktok' ? 'TikTok' : 'Insta'}
                </div>
            </div>

            {/* Title on bottom (Minimal) */}
            <div className="absolute bottom-0 left-0 right-0 p-2 pointer-events-none">
                <p className="text-[9px] text-white/90 line-clamp-2 font-medium leading-tight drop-shadow-md">
                    {content.title}
                </p>
            </div>
        </div>
    )
}

function DraggableMarker({ marker, onClick, onEdit, onDelete }: { marker: Marker, onClick?: () => void, onEdit: (m: Marker) => void, onDelete: (id: number) => void }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `marker-source-${marker.id}`,
        data: { marker, type: 'marker-source' }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
                "aspect-square w-full rounded-md p-2 flex flex-col items-center justify-center text-center shadow-sm relative group transition-all cursor-grab active:cursor-grabbing",
                isDragging ? "opacity-30" : "opacity-100"
            )}
            style={{ backgroundColor: marker.color }}
            title={marker.description || ''}
            onClick={onClick}
        >
            <span className="text-xs font-semibold text-slate-800 line-clamp-3 leading-tight break-words w-full pointer-events-none">
                {marker.name}
            </span>

            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={(e) => e.stopPropagation()}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-white/50 hover:bg-white/80 text-slate-700">
                            <MoreHorizontal className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(marker)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(marker.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

function CalendarDay({ day, currentDate, events, onDeleteEvent, onEditEvent, onPlayVideo }: {
    day: Date,
    currentDate: Date,
    events: CalendarEvent[],
    onDeleteEvent: (id: string) => void,
    onEditEvent: (event: CalendarEvent) => void,
    onPlayVideo: (url: string) => void
}) {
    const dateStr = format(day, 'yyyy-MM-dd');
    const { setNodeRef, isOver } = useDroppable({
        id: dateStr,
        data: { date: day }
    });

    const isToday = isSameDay(day, new Date());
    const isCurrentMonth = isSameMonth(day, currentDate);

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "p-2 min-h-[100px] transition-colors relative group flex flex-col items-start gap-1",
                !isCurrentMonth && "bg-muted/10",
                isOver && "bg-primary/10 ring-2 ring-inset ring-primary/20",
                isToday && "bg-blue-50/50 dark:bg-blue-900/10"
            )}
        >
            <span className={cn(
                "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full shrink-0",
                isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
                !isCurrentMonth && !isToday && "opacity-50"
            )}>
                {format(day, 'd')}
            </span>

            <div className="flex flex-col gap-1 w-full flex-1">
                {events.map(event => (
                    <div
                        key={event.id}
                        className="text-[10px] p-1.5 rounded shadow-sm relative group/event transition-all hover:scale-[1.02] cursor-default flex items-center justify-between gap-1 overflow-hidden"
                        style={{ backgroundColor: event.marker?.color || (event.content_item ? '#f1f5f9' : '#fff') }}
                        title={event.marker?.description || event.content_item?.title || ''}
                    >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            {/* Color indicator for posts */}
                            {event.content_item && (
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0",
                                    event.content_item.platform === 'tiktok' ? "bg-black" : "bg-pink-600"
                                )} />
                            )}

                            <p className="font-semibold text-slate-800 line-clamp-1 leading-tight truncate">
                                {event.content_item?.title || event.marker?.name || 'Evento'}
                            </p>
                        </div>

                        <div className="flex gap-0.5 opacity-0 group-hover/event:opacity-100 transition-opacity">
                            {event.content_item?.url && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPlayVideo(event.content_item!.url!);
                                    }}
                                    className="bg-black/80 hover:bg-black text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm hover:scale-110"
                                    title="Ver vídeo"
                                >
                                    <Eye className="h-2 w-2" />
                                </button>
                            )}

                            {!event.content_item && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditEvent(event);
                                    }}
                                    className="bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center shadow-sm hover:scale-110"
                                    title="Editar recorrência"
                                >
                                    <Pencil className="h-2 w-2" />
                                </button>
                            )}

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteEvent(event.id);
                                }}
                                className="bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center shadow-sm hover:scale-110"
                                title="Excluir"
                            >
                                <span className="h-3 w-3 flex items-center justify-center text-[10px]">&times;</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function CalendarPage() {
    const { getActiveClient, addToCalendar } = useStore()
    const activeClient = getActiveClient()
    const [currentDate, setCurrentDate] = useState(new Date())

    // Markers State
    const [markers, setMarkers] = useState<Marker[]>([])
    const [isCreateMarkerOpen, setIsCreateMarkerOpen] = useState(false)
    const [newMarkerName, setNewMarkerName] = useState("")
    const [newMarkerDesc, setNewMarkerDesc] = useState("")

    const [isEditMarkerOpen, setIsEditMarkerOpen] = useState(false)
    const [editingMarker, setEditingMarker] = useState<Marker | null>(null)
    const [editMarkerName, setEditMarkerName] = useState("")
    const [editMarkerDesc, setEditMarkerDesc] = useState("")

    // Calendar Events State
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
    const [activeDragItem, setActiveDragItem] = useState<{ type: string, data: any } | null>(null)

    // Event Recurrence Edit State
    const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
    const [editEventWeeks, setEditEventWeeks] = useState(1)

    // Delete Confirmation State
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null)

    // Video Playback State
    const [videoUrl, setVideoUrl] = useState<string | null>(null)

    // Fallback if no client selected
    const savedContent = activeClient?.savedContent || []

    useEffect(() => {
        if (activeClient) {
            getMarkers(activeClient.id).then(setMarkers)
            getCalendarEvents(activeClient.id).then(setCalendarEvents)
        }
    }, [activeClient])

    const getRandomColor = () => MARKER_COLORS[Math.floor(Math.random() * MARKER_COLORS.length)]

    const handleCreateMarker = async () => {
        if (!activeClient || !newMarkerName) return

        const color = getRandomColor()
        const result = await createMarker(activeClient.id, newMarkerName, newMarkerDesc, color)
        if (result.success && result.marker) {
            setMarkers(prev => [result.marker!, ...prev])
            setNewMarkerName("")
            setNewMarkerDesc("")
            setIsCreateMarkerOpen(false)
            toast.success("Marcador criado!")
        } else {
            toast.error("Erro ao criar marcador")
        }
    }

    const handleDeleteMarker = async (id: number) => {
        const result = await deleteMarker(id)
        if (result.success) {
            setMarkers(prev => prev.filter(m => m.id !== id))
            toast.success("Marcador excluído")
        } else {
            toast.error("Erro ao excluir marcador")
        }
    }

    const startEditMarker = (marker: Marker) => {
        setEditingMarker(marker)
        setEditMarkerName(marker.name)
        setEditMarkerDesc(marker.description || "")
        setIsEditMarkerOpen(true)
    }

    const handleUpdateMarker = async () => {
        if (!editingMarker) return

        const result = await updateMarker(editingMarker.id, {
            name: editMarkerName,
            description: editMarkerDesc
        })

        if (result.success && result.marker) {
            setMarkers(prev => prev.map(m => m.id === editingMarker.id ? result.marker! : m))
            setIsEditMarkerOpen(false)
            toast.success("Marcador atualizado")
        } else {
            toast.error("Erro ao atualizar marcador")
        }
    }

    // Drag and Drop Handlers
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const type = active.data.current?.type;

        if (type === 'marker-source') {
            setActiveDragItem({ type, data: active.data.current?.marker });
        } else if (type === 'post-source') {
            setActiveDragItem({ type, data: active.data.current?.content });
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over || !activeClient) return;

        const dateStr = over.id as string;
        if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return;

        // Determine what was dropped
        const type = active.data.current?.type;

        // Construct date at noon local time to avoid timezone issues
        const [year, month, day] = dateStr.split('-').map(Number);
        const localDate = new Date(year, month - 1, day, 12, 0, 0);

        if (type === 'marker-source') {
            const marker = active.data.current?.marker as Marker;

            // Optimistic update
            const tempId = `temp-${Date.now()}`;
            const optimisticEvent: any = {
                id: tempId,
                client_id: activeClient.id,
                scheduled_at: dateStr,
                marker_id: marker.id,
                content_item_id: null,
                status: 'scheduled',
                created_at: new Date().toISOString(),
                notes: null,
                marker: marker,
                content_item: null
            };

            setCalendarEvents(prev => [...prev, optimisticEvent]);

            const result = await createCalendarEvent(activeClient.id, localDate.toISOString(), marker.id);

            if (result.success && result.events) {
                const freshEvents = await getCalendarEvents(activeClient.id) || []
                setCalendarEvents(freshEvents as CalendarEvent[])
                toast.success("Marcador agendado!");
            } else {
                setCalendarEvents(prev => prev.filter(e => e.id !== tempId));
                toast.error("Erro ao agendar marcador");
            }
        } else if (type === 'post-source') {
            const content = active.data.current?.content as ContentItem;

            // Optimistic update
            const tempId = `temp-${Date.now()}`;
            // Optimistic event structure
            const optimisticEvent: any = {
                id: tempId,
                client_id: activeClient.id,
                scheduled_at: dateStr,
                marker_id: null,
                content_item_id: content.id, // This might be legacy numeric ID temporarily
                status: 'scheduled',
                created_at: new Date().toISOString(),
                notes: null,
                marker: null,
                content_item: content
            };

            setCalendarEvents(prev => [...prev, optimisticEvent]);

            // Ensure content exists in content_items (migration)
            const ensured = await ensureContentItem(content.id, {
                title: content.title,
                url: content.url!,
                thumbnail_url: content.thumbnail_url!,
                platform: content.platform,
                client_id: activeClient.id,
                views: content.views || 0,
                likes: content.likes || 0
            });

            if (!ensured.success || !ensured.id) {
                setCalendarEvents(prev => prev.filter(e => e.id !== tempId));
                toast.error("Erro ao migrar conteúdo para agendamento");
                return;
            }

            // Create event with VALID Content Item UUID
            const result = await createCalendarEvent(activeClient.id, localDate.toISOString(), undefined, ensured.id);

            if (result.success && result.events) {
                const freshEvents = await getCalendarEvents(activeClient.id) || []
                setCalendarEvents(freshEvents as CalendarEvent[])
                toast.success("Conteúdo agendado!");
            } else {
                setCalendarEvents(prev => prev.filter(e => e.id !== tempId));
                toast.error("Erro ao agendar conteúdo");
            }
        }
    }

    const handleEditEvent = (event: CalendarEvent) => {
        setEditingEvent(event)
        setEditEventWeeks(1)
        setIsEditEventDialogOpen(true)
    }

    const handleUpdateEventRecurrence = async () => {
        if (!editingEvent || !activeClient) return

        setIsEditEventDialogOpen(false)

        const result = await updateEventRecurrence(editingEvent.id, editEventWeeks)

        if (result.success) {
            const freshEvents = await getCalendarEvents(activeClient.id) || []
            setCalendarEvents(freshEvents as CalendarEvent[])
            toast.success("Recorrência configurada!")
        } else {
            toast.error("Erro ao configurar recorrência")
        }

        setEditingEvent(null)
    }

    const handleDeleteEvent = async (eventId: string) => {
        const eventToDelete = calendarEvents.find(e => e.id === eventId)
        if (!eventToDelete) return

        // If event has recurrence, show confirmation dialog
        if (eventToDelete.recurrence_group_id) {
            setEventToDelete(eventToDelete)
            setIsDeleteConfirmOpen(true)
        } else {
            // Delete immediately for single events
            await performDelete(eventId)
        }
    }

    const performDelete = async (eventId: string) => {
        const prevEvents = [...calendarEvents];
        const eventToDelete = calendarEvents.find(e => e.id === eventId)
        if (!eventToDelete) return

        if (eventToDelete.recurrence_group_id) {
            setCalendarEvents(prev => prev.filter(e => e.recurrence_group_id !== eventToDelete.recurrence_group_id))
        } else {
            setCalendarEvents(prev => prev.filter(e => e.id !== eventId))
        }

        const result = await deleteCalendarEvent(eventId);
        if (!result.success) {
            setCalendarEvents(prevEvents);
            toast.error("Erro ao remover do calendário");
        } else {
            toast.success("Removido do calendário");
        }
    }

    const confirmDelete = async () => {
        if (!eventToDelete) return
        setIsDeleteConfirmOpen(false)
        await performDelete(eventToDelete.id)
        setEventToDelete(null)
    }

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const startDay = getDay(monthStart)
    const paddingDays = Array.from({ length: startDay })

    const nextMonth = () => setCurrentDate(addDays(monthEnd, 1))
    const prevMonth = () => setCurrentDate(addDays(monthStart, -1))

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Calendário editorial</h1>
                        <p className="text-muted-foreground mt-1">
                            {activeClient ? `Planejamento para: ${activeClient.name}` : "Selecione um cliente para planejar."}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-card border rounded-md p-1">
                        <Button variant="ghost" size="icon" onClick={prevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold w-32 text-center select-none">
                            {format(currentDate, 'MMMM yyyy')}
                        </span>
                        <Button variant="ghost" size="icon" onClick={nextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 gap-6 overflow-hidden">
                    {/* Visual Calendar Grid */}
                    <div className="flex-1 bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col">
                        <div className="grid grid-cols-7 border-b bg-muted/30">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                                <div key={day} className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 grid-rows-5 flex-1 divide-x divide-y">
                            {paddingDays.map((_, i) => (
                                <div key={`padding-${i}`} className="bg-muted/5 p-2" />
                            ))}

                            {daysInMonth.map((day) => (
                                <CalendarDay
                                    key={day.toString()}
                                    day={day}
                                    currentDate={currentDate}
                                    events={calendarEvents.filter(e => isSameDay(parseISO(e.scheduled_at), day))}
                                    onDeleteEvent={handleDeleteEvent}
                                    onEditEvent={handleEditEvent}
                                    onPlayVideo={setVideoUrl}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar draggable items */}
                    <div className="w-96 flex flex-col gap-4">
                        <Card className="flex-1 flex flex-col shadow-sm border-dashed">
                            <CardHeader className="py-2 px-4 border-b bg-muted/10">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    Conteúdo agendado
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-auto p-2 bg-muted/5">
                                <Tabs defaultValue="marcadores" className="w-full h-full flex flex-col">
                                    <TabsList className="w-full grid grid-cols-2 mb-2">
                                        <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                                        <TabsTrigger value="marcadores">Marcadores</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="conteudo" className="flex-1 mt-0">
                                        {savedContent.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Nenhum conteúdo salvo.
                                                    <br />
                                                    Vá para Discovery para salvar ideias.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3">
                                                {savedContent.map(content => (
                                                    <DraggablePost key={content.id} content={content} onPlay={setVideoUrl} />
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="marcadores" className="flex-1 mt-0">
                                        <div className="grid grid-cols-3 gap-3 align-start content-start">
                                            <Dialog open={isCreateMarkerOpen} onOpenChange={setIsCreateMarkerOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="aspect-square w-full h-auto flex flex-col items-center justify-center gap-1 border-dashed hover:border-solid bg-transparent">
                                                        <Plus className="h-5 w-5" />
                                                        <span className="text-xs">Novo</span>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Criar novo marcador</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="name">Nome</Label>
                                                            <Input id="name" value={newMarkerName} onChange={(e) => setNewMarkerName(e.target.value)} placeholder="Ex: Urgente, Promoção..." />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="description">Descrição</Label>
                                                            <Textarea id="description" value={newMarkerDesc} onChange={(e) => setNewMarkerDesc(e.target.value)} placeholder="Opcional" />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button onClick={handleCreateMarker}>Criar</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            {markers.map(marker => (
                                                <DraggableMarker
                                                    key={marker.id}
                                                    marker={marker}
                                                    onEdit={startEditMarker}
                                                    onDelete={handleDeleteMarker}
                                                />
                                            ))}

                                            <Dialog open={isEditMarkerOpen} onOpenChange={setIsEditMarkerOpen}>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Editar Marcador</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="edit-name">Nome</Label>
                                                            <Input id="edit-name" value={editMarkerName} onChange={(e) => setEditMarkerName(e.target.value)} />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="edit-description">Descrição</Label>
                                                            <Textarea id="edit-description" value={editMarkerDesc} onChange={(e) => setEditMarkerDesc(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button onClick={handleUpdateMarker}>Salvar</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Este marcador possui recorrência. Tem certeza que deseja excluir <strong>todas as ocorrências</strong> deste marcador?
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Excluir Todas</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditEventDialogOpen} onOpenChange={setIsEditEventDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configurar Recorrência</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Defina por quantas semanas este marcador deve se repetir.
                            </p>
                            <div className="flex items-center gap-2">
                                <Label className="min-w-24">Semanas:</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={editEventWeeks}
                                    onChange={(e) => {
                                        const val = Number(e.target.value)
                                        if (val <= 10 && val >= 1) setEditEventWeeks(val)
                                    }}
                                    className="w-24"
                                />
                                <span className="text-xs text-muted-foreground">(Máx. 10)</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {`Repetir por ${editEventWeeks} semanas neste dia da semana.`}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditEventDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleUpdateEventRecurrence}>Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!videoUrl} onOpenChange={(open) => !open && setVideoUrl(null)}>
                <DialogContent className="max-w-[400px] p-0 overflow-hidden bg-black border-none aspect-[9/16] max-h-[85vh]">
                    {videoUrl && (
                        <div className="w-full h-full relative">
                            {/* Loading State or Iframe */}
                            <iframe
                                src={getEmbedUrl(videoUrl)}
                                className="w-full h-full object-cover"
                                frameBorder="0"
                                scrolling="no"
                                allow="encrypted-media; autoplay"
                                allowFullScreen
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <DragOverlay>
                {activeDragItem ? (
                    activeDragItem.type === 'marker-source' ? (
                        <div
                            className="aspect-square w-24 rounded-md p-2 flex flex-col items-center justify-center text-center shadow-lg ring-2 ring-primary opacity-90"
                            style={{ backgroundColor: activeDragItem.data.color }}
                        >
                            <span className="text-xs font-semibold text-slate-800 line-clamp-3 leading-tight break-words">
                                {activeDragItem.data.name}
                            </span>
                        </div>
                    ) : (
                        <div className="w-32 aspect-[9/16] rounded-md overflow-hidden shadow-lg ring-2 ring-primary opacity-90 relative bg-black">
                            {activeDragItem.data.thumbnail_url && (
                                <img src={activeDragItem.data.thumbnail_url} className="w-full h-full object-cover" />
                            )}
                        </div>
                    )
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
