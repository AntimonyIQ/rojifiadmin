import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Reply, Download, Archive, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { IContactUs, IPagination, IResponse } from "@/interface/interface";
import { session, SessionData } from "@/session/session";
import Defaults from "@/defaults/defaults";
import { Status } from "@/enums/enums";
import { toast } from "@/hooks/use-toast";

export default function ContactMessagesPage() {
    const [contactMessages, setContactMessages] = useState<IContactUs[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<IContactUs | null>(null);
    const [responseText, setResponseText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [pagination, setPagination] = useState<IPagination>({
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 0,
    });
    const sd: SessionData = session.getUserData();

    // Fetch newsletters with filters and pagination
    useEffect(() => {
        fetchContactMessages();
    }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

    const fetchContactMessages = async () => {
        try {
            setLoading(true);
            Defaults.LOGIN_STATUS();

            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            if (searchTerm) params.append('search', searchTerm);
            if (statusFilter === 'agreed') {
                params.append('agreement', 'true');
            } else if (statusFilter === 'not-agreed') {
                params.append('agreement', 'false');
            }

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/contactus?${params}`, {
                method: 'GET',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                if (!data.handshake) throw new Error('Unable to process response');
                const parseData: Array<IContactUs> = Defaults.PARSE_DATA(data.data, sd.client.privateKey, data.handshake);
                setContactMessages(parseData);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            }
        } catch (error: any) {
            toast({
                title: "Error fetching contact messages",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const archiveContactMessage = async (id: string) => {
        try {
            setLoadingStates(prev => ({ ...prev, [id]: true }));
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/contactus/archive/${id}`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Archived successfully",
                    description: `You have archived the contact message.`,
                    variant: "default",
                });
                await fetchContactMessages();
            }
        } catch (error: any) {
            toast({
                title: "Error archiving",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: false }));
        }
    }

    const respondToContactMessage = async (id: string, message: string) => {
        try {
            setLoadingStates(prev => ({ ...prev, [id]: true }));
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/contactus/${id}`, {
                method: 'PUT',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({ message }),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Response sent successfully",
                    description: `You have responded to the contact message.`,
                    variant: "default",
                });
                setResponseText("");
                setSelectedMessage(null);
                await fetchContactMessages();
            }
        } catch (error: any) {
            toast({
                title: "Error responding to contact message",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: false }));
        }
    }

    const handleRespond = async (message: IContactUs) => {
        if (!responseText.trim() || !message._id) return;
        await respondToContactMessage(message._id, responseText);
    };

    const handleArchive = async (message: IContactUs) => {
        if (!message._id) return;
        await archiveContactMessage(message._id);
    };

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit: string) => {
        setPagination(prev => ({ ...prev, limit: parseInt(newLimit), page: 1 }));
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "N/A";
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Contact Messages</h1>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Export contact messages to CSV</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Messages
                            </CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pagination.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Responded
                            </CardTitle>
                            <Reply className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {contactMessages.filter(m => m.responded).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <Eye className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {contactMessages.filter(m => !m.responded && !m.archived).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Archived
                            </CardTitle>
                            <Archive className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">
                                {contactMessages.filter(m => m.archived).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search by name, email, business..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-full sm:w-48">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by agreement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Messages</SelectItem>
                                        <SelectItem value="agreed">Agreed to Terms</SelectItem>
                                        <SelectItem value="not-agreed">Not Agreed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full sm:w-32">
                                <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10 per page</SelectItem>
                                        <SelectItem value="25">25 per page</SelectItem>
                                        <SelectItem value="50">50 per page</SelectItem>
                                        <SelectItem value="100">100 per page</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Business</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Agreement</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Responded At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    contactMessages.map((message, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {`${message.firstname} ${message.lastname}`}
                                            </TableCell>
                                            <TableCell>{message.businessName}</TableCell>
                                            <TableCell>{message.email}</TableCell>
                                            <TableCell>
                                                {`${message.phoneCode} ${message.phoneNumber}`}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={message.agreement ? "default" : "secondary"}>
                                                    {message.agreement ? "Agreed" : "Not Agreed"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        message.responded
                                                            ? "default"
                                                            : message.archived
                                                                ? "secondary"
                                                                : "destructive"
                                                    }
                                                >
                                                    {message.responded
                                                        ? "Responded"
                                                        : message.archived
                                                            ? "Archived"
                                                            : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(message.respondedAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setSelectedMessage(message)}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>View message details</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>Message Details</DialogTitle>
                                                                <DialogDescription>
                                                                    Contact message from {selectedMessage?.firstname} {selectedMessage?.lastname}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            {selectedMessage && (
                                                                <div className="space-y-4">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="font-semibold">Name:</label>
                                                                            <p>{`${selectedMessage.firstname} ${selectedMessage.lastname}`}</p>
                                                                        </div>
                                                                        <div>
                                                                            <label className="font-semibold">Email:</label>
                                                                            <p>{selectedMessage.email}</p>
                                                                        </div>
                                                                        <div>
                                                                            <label className="font-semibold">Business:</label>
                                                                            <p>{selectedMessage.businessName}</p>
                                                                        </div>
                                                                        <div>
                                                                            <label className="font-semibold">Website:</label>
                                                                            <p>{selectedMessage.businessWebsite}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="font-semibold">Message:</label>
                                                                        <p className="text-sm text-gray-600 mt-1">{selectedMessage.message}</p>
                                                                    </div>
                                                                    {selectedMessage.responded && (
                                                                        <div>
                                                                            <label className="font-semibold">Previous Response:</label>
                                                                            <p className="text-sm text-gray-600 mt-1">{selectedMessage.responseMessage}</p>
                                                                        </div>
                                                                    )}
                                                                    {!selectedMessage.responded && (
                                                                        <div className="space-y-2">
                                                                            <label className="font-semibold">Your Response:</label>
                                                                            <Textarea
                                                                                value={responseText}
                                                                                onChange={(e) => setResponseText(e.target.value)}
                                                                                placeholder="Type your response here..."
                                                                                rows={4}
                                                                            />
                                                                            <Button
                                                                                onClick={() => handleRespond(selectedMessage)}
                                                                                disabled={!responseText.trim() || loadingStates[selectedMessage._id || '']}
                                                                            >
                                                                                {loadingStates[selectedMessage._id || ''] ? (
                                                                                    <>
                                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                        Sending...
                                                                                    </>
                                                                                ) : (
                                                                                    "Send Response"
                                                                                )}
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>
                                                    {!message.responded && (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="text-blue-600 hover:text-blue-700"
                                                                            onClick={() => setSelectedMessage(message)}
                                                                        >
                                                                            <Reply className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Reply to message</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </DialogTrigger>
                                                        </Dialog>
                                                    )}
                                                    {!message.archived && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-gray-600 hover:text-gray-700"
                                                                    onClick={() => handleArchive(message)}
                                                                    disabled={loadingStates[message._id || '']}
                                                                >
                                                                    {loadingStates[message._id || ''] ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Archive className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Archive message</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {contactMessages.length === 0 && !loading && (
                            <div className="text-center py-8 text-muted-foreground">
                                No contact messages found matching your criteria.
                            </div>
                        )}
                    </CardContent>

                    <div className="border-t px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total messages)
                            </div>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page <= 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Go to previous page</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Go to next page</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </TooltipProvider>
    );
}
