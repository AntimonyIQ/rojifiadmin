import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Search, Download, Plus, Mail, UserX, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { INewsLetter, IPagination, IResponse } from "@/interface/interface";
import { toast } from "@/hooks/use-toast";
import Defaults from "@/defaults/defaults";
import { session, SessionData } from "@/session/session";
import { Status } from "@/enums/enums";

export default function NewslettersPage() {
    const [newsletters, setNewsletters] = useState<INewsLetter[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [newEmail, setNewEmail] = useState("");
    const [addingSubscriber, setAddingSubscriber] = useState(false);
    const [pagination, setPagination] = useState<IPagination>({
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 0,
    });
    const sd: SessionData = session.getUserData();

    // Fetch newsletters with filters and pagination
    useEffect(() => {
        fetchNewsletters();
    }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

    const fetchNewsletters = async () => {
        try {
            setLoading(true);

            Defaults.LOGIN_STATUS();

            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            if (searchTerm) params.append('search', searchTerm);
            if (statusFilter !== 'all') {
                params.append('canceled', statusFilter === 'unsubscribed' ? 'true' : 'false');
            }

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/newsletter?${params}`, {
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
                const parseData: Array<INewsLetter> = Defaults.PARSE_DATA(data.data, sd.client.privateKey, data.handshake);
                setNewsletters(parseData);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            }
        } catch (error: any) {
            toast({
                title: "Error fetching newsletters",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const unsubscribeNewsLetter = async (email: string) => {
        try {
            setLoadingStates(prev => ({ ...prev, [email]: true }));
            const res = await fetch(`${Defaults.API_BASE_URL}/newsletter/unsubscribe`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({ email }),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Unsubscribed successfully",
                    description: `You have unsubscribed ${email} from the newsletter.`,
                    variant: "default",
                });
                await fetchNewsletters();
            }
        } catch (error: any) {
            toast({
                title: "Error unsubscribing",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [email]: false }));
        }
    }

    const resubscribeNewsLetter = async (email: string) => {
        try {
            setLoadingStates(prev => ({ ...prev, [email]: true }));
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/newsletter/resubscribe`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({ email }),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Resubscribed successfully",
                    description: `You have resubscribed ${email} to the newsletter.`,
                    variant: "default",
                });
                await fetchNewsletters();
            }
        } catch (error: any) {
            toast({
                title: "Error resubscribing",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [email]: false }));
        }
    }

    const handleAddSubscriber = async () => {
        if (!newEmail || newsletters.find(n => n.email === newEmail)) return;

        try {
            setAddingSubscriber(true);
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({ email: newEmail }),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Subscriber added successfully",
                    description: `${newEmail} has been added to the newsletter.`,
                    variant: "default",
                });
                setNewEmail("");
                await fetchNewsletters();
            }
        } catch (error: any) {
            toast({
                title: "Error adding subscriber",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setAddingSubscriber(false);
        }
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

    const activeSubscribers = newsletters.filter(n => !n.canceled).length;
    const totalSubscribers = newsletters.length;

    const formatDate = (date: Date) => {
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
                    <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
                    <div className="flex gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Subscriber
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Manually add a new email subscriber</p>
                                    </TooltipContent>
                                </Tooltip>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Subscriber</DialogTitle>
                                    <DialogDescription>
                                        Manually add a new email subscriber to the newsletter.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <Input
                                        type="email"
                                        placeholder="Enter email address"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                    <Button
                                        onClick={handleAddSubscriber}
                                        disabled={!newEmail || !!newsletters.find(n => n.email === newEmail) || addingSubscriber}
                                        className="w-full"
                                    >
                                        {addingSubscriber ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            "Add Subscriber"
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Export subscriber list to CSV</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Subscribers
                            </CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalSubscribers}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Subscribers
                            </CardTitle>
                            <Mail className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{activeSubscribers}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Unsubscribed
                            </CardTitle>
                            <UserX className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{totalSubscribers - activeSubscribers}</div>
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
                                        placeholder="Search by email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-full sm:w-48">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Subscribers</SelectItem>
                                        <SelectItem value="active">Active Only</SelectItem>
                                        <SelectItem value="unsubscribed">Unsubscribed Only</SelectItem>
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
                        <CardTitle>Subscribers List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Subscribed Date</TableHead>
                                    <TableHead>Canceled Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    newsletters.map((newsletter) => (
                                        <TableRow key={newsletter.email}>
                                            <TableCell className="font-medium">{newsletter.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={newsletter.canceled ? "destructive" : "default"}>
                                                    {newsletter.canceled ? "Unsubscribed" : "Active"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(newsletter.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                {newsletter.canceledAt ? formatDate(newsletter.canceledAt) : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {newsletter.canceled ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => resubscribeNewsLetter(newsletter.email)}
                                                                disabled={loadingStates[newsletter.email]}
                                                            >
                                                                {loadingStates[newsletter.email] ? (
                                                                    <>
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        Resubscribing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Mail className="mr-2 h-4 w-4" />
                                                                        Resubscribe
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Resubscribe user to newsletter</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => unsubscribeNewsLetter(newsletter.email)}
                                                                disabled={loadingStates[newsletter.email]}
                                                            >
                                                                {loadingStates[newsletter.email] ? (
                                                                    <>
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        Unsubscribing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <UserX className="mr-2 h-4 w-4" />
                                                                        Unsubscribe
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Unsubscribe user from newsletter</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {newsletters.length === 0 && !loading && (
                            <div className="text-center py-8 text-muted-foreground">
                                No subscribers found matching your criteria.
                            </div>
                        )}
                    </CardContent>

                    <div className="border-t px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total subscribers)
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
