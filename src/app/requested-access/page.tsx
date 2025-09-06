import React, { useState, useEffect } from "react";
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
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Check, X, Download, Search, Loader2, ChevronLeft, ChevronRight, UserPlus, ChevronDown, ChevronUp, Monitor, Smartphone, Globe } from "lucide-react";
import { IPagination, IResponse, IRequestAccess } from "@/interface/interface";
import { session, SessionData } from "@/session/session";
import Defaults from "@/defaults/defaults";
import { Status } from "@/enums/enums";
import { toast } from "@/hooks/use-toast";

export default function RequestedAccessPage() {
    const [requestedAccess, setRequestedAccess] = useState<IRequestAccess[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<IRequestAccess | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: { approve: boolean; reject: boolean } }>({});
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
        fetchRequestAccess();
    }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

    const fetchRequestAccess = async () => {
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

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/requestaccess/list?${params}`, {
                method: 'GET',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                }
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                if (!data.handshake) throw new Error('Unable to process response');
                const parseData: Array<IRequestAccess> = Defaults.PARSE_DATA(data.data, sd.client.privateKey, data.handshake);
                setRequestedAccess(parseData);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            }
        } catch (error: any) {
            toast({
                title: "Error fetching access requests",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const approveRequestedAccess = async (id: string) => {
        try {
            setLoadingStates(prev => ({
                ...prev,
                [id]: {
                    approve: true,
                    reject: prev[id]?.reject || false
                }
            }));
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/requestaccess/approve/${id}`, {
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
                toast({
                    title: "Approved successfully",
                    description: `You have approved the access request.`,
                    variant: "default",
                });
                await fetchRequestAccess();
            }
        } catch (error: any) {
            toast({
                title: "Error approving",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoadingStates(prev => ({
                ...prev,
                [id]: {
                    approve: false,
                    reject: prev[id]?.reject || false
                }
            }));
        }
    }

    const rejectRequestedAccess = async (id: string) => {
        try {
            setLoadingStates(prev => ({
                ...prev,
                [id]: {
                    approve: prev[id]?.approve || false,
                    reject: true
                }
            }));
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/requestaccess/reject/${id}`, {
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
                toast({
                    title: "Rejected successfully",
                    description: `You have rejected the access request.`,
                    variant: "default",
                });
                await fetchRequestAccess();
            }
        } catch (error: any) {
            toast({
                title: "Error rejecting",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoadingStates(prev => ({
                ...prev,
                [id]: {
                    approve: prev[id]?.approve || false,
                    reject: false
                }
            }));
        }
    }

    const handleApprove = async (request: IRequestAccess) => {
        if (!request._id) return;
        await approveRequestedAccess(request._id);
        setModalOpen(false); // Close modal after successful action
        setSelectedRequest(null);
    };

    const handleReject = async (request: IRequestAccess) => {
        if (!request._id) return;
        await rejectRequestedAccess(request._id);
        setModalOpen(false); // Close modal after successful action
        setSelectedRequest(null);
    };

    const openModal = (request: IRequestAccess) => {
        setSelectedRequest(request);
        setModalOpen(true);
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
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

    const renderMetadataValue = (_key: string, value: any): React.ReactNode => {
        if (value === null || value === undefined) return "N/A";

        if (typeof value === 'object') {
            return (
                <div className="ml-4 space-y-2">
                    {Object.entries(value).map(([subKey, subValue]) => (
                        <div key={subKey} className="flex flex-col space-y-1">
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{subKey}:</span>
                            <span className="text-sm">{renderMetadataValue(subKey, subValue)}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof value === 'boolean') return value ? "Yes" : "No";
        if (typeof value === 'string' && value.length > 50) {
            return (
                <div className="text-sm bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto">
                    {value}
                </div>
            );
        }

        return String(value);
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType?.toLowerCase()) {
            case 'mobile': return <Smartphone className="h-4 w-4" />;
            case 'tablet': return <Monitor className="h-4 w-4" />;
            default: return <Monitor className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <TooltipProvider>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Requested Access</h1>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Export access requests to CSV</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                                <UserPlus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">-</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                <UserPlus className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">-</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                                <Check className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">-</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                                <X className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">-</div>
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
                                            <SelectItem value="all">All Requests</SelectItem>
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
                            <CardTitle>Access Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TooltipProvider>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Requested Access</h1>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Export access requests to CSV</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pagination.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <UserPlus className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {requestedAccess.filter(r => !r.approved && !r.deleted).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <Check className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {requestedAccess.filter(r => r.approved).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            <X className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {requestedAccess.filter(r => r.deleted).length}
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
                                        <SelectItem value="all">All Requests</SelectItem>
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
                        <CardTitle>Access Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Business</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Weekly Volume</TableHead>
                                    <TableHead>Agreement</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                                                Loading access requests...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    requestedAccess.map((request) => (
                                        <TableRow key={request._id}>
                                            <TableCell>
                                                {`${request.firstname} ${request.lastname}`}
                                            </TableCell>
                                            <TableCell>{request.businessName}</TableCell>
                                            <TableCell>{request.email}</TableCell>
                                            <TableCell>
                                                {formatCurrency(request.weeklyVolume)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={request.agreement ? "default" : "secondary"}>
                                                    {request.agreement ? "Agreed" : "Not Agreed"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        request.approved
                                                            ? "default"
                                                            : request.deleted
                                                                ? "destructive"
                                                                : "secondary"
                                                    }
                                                >
                                                    {request.approved
                                                        ? "Approved"
                                                        : request.deleted
                                                            ? "Rejected"
                                                            : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                                                        <DialogTrigger asChild>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => openModal(request)}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>View request details</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>Request Details</DialogTitle>
                                                                <DialogDescription>
                                                                    Full details of the access request
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            {selectedRequest && (
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="font-semibold">Full Name:</label>
                                                                        <p>{`${selectedRequest.firstname} ${selectedRequest.middlename} ${selectedRequest.lastname}`}</p>
                                                                    </div>
                                                                    <div>
                                                                        <label className="font-semibold">Email:</label>
                                                                        <p>{selectedRequest.email}</p>
                                                                    </div>
                                                                    <div>
                                                                        <label className="font-semibold">Business:</label>
                                                                        <p>{selectedRequest.businessName}</p>
                                                                    </div>
                                                                    <div>
                                                                        <label className="font-semibold">Website:</label>
                                                                        <p>{selectedRequest.businessWebsite}</p>
                                                                    </div>
                                                                    <div>
                                                                        <label className="font-semibold">Phone:</label>
                                                                        <p>{`${selectedRequest.phoneCode} ${selectedRequest.phoneNumber}`}</p>
                                                                    </div>
                                                                    <div>
                                                                        <label className="font-semibold">Weekly Volume:</label>
                                                                        <p>{formatCurrency(selectedRequest.weeklyVolume)}</p>
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <label className="font-semibold">Address:</label>
                                                                        <p>{`${selectedRequest.address}, ${selectedRequest.city}, ${selectedRequest.state}, ${selectedRequest.country} ${selectedRequest.postalCode}`}</p>
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <label className="font-semibold">Message:</label>
                                                                        <p className="text-sm text-gray-600">{selectedRequest.message}</p>
                                                                    </div>

                                                                    {/* Metadata Section */}
                                                                    {selectedRequest.metadata && (
                                                                        <div className="col-span-2 border-t pt-4">
                                                                            <div className="flex items-center justify-between mb-3">
                                                                                <label className="font-semibold flex items-center">
                                                                                    <Globe className="h-4 w-4 mr-2" />
                                                                                    Technical Information
                                                                                </label>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => setShowMetadata(!showMetadata)}
                                                                                >
                                                                                    {showMetadata ? (
                                                                                        <>
                                                                                            <ChevronUp className="h-4 w-4 mr-1" />
                                                                                            Hide Details
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <ChevronDown className="h-4 w-4 mr-1" />
                                                                                            Show Details
                                                                                        </>
                                                                                    )}
                                                                                </Button>
                                                                            </div>

                                                                            {showMetadata && (
                                                                                <div className="bg-gray-50 p-4 rounded-lg space-y-4 max-h-96 overflow-y-auto">
                                                                                    {/* Location Information */}
                                                                                    {selectedRequest.metadata.location && (
                                                                                        <div className="bg-white p-3 rounded border">
                                                                                            <h4 className="font-medium text-green-700 mb-2 flex items-center">
                                                                                                <Globe className="h-4 w-4 mr-2" />
                                                                                                Location Information
                                                                                            </h4>
                                                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                                                <div><strong>IP Address:</strong> {selectedRequest.metadata.location.ip || "N/A"}</div>
                                                                                                <div><strong>City:</strong> {selectedRequest.metadata.location.city || "N/A"}</div>
                                                                                                <div><strong>Region:</strong> {selectedRequest.metadata.location.region || "N/A"}</div>
                                                                                                <div><strong>Country:</strong> {selectedRequest.metadata.location.country_name || "N/A"}</div>
                                                                                                <div><strong>Timezone:</strong> {selectedRequest.metadata.location.timezone || "N/A"}</div>
                                                                                                <div><strong>ISP:</strong> {selectedRequest.metadata.location.org || "N/A"}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                    {/* Device Information */}
                                                                                    {selectedRequest.metadata.device && (
                                                                                        <div className="bg-white p-3 rounded border">
                                                                                            <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                                                                                                {getDeviceIcon(selectedRequest.metadata.device.device?.type)}
                                                                                                <span className="ml-2">Device Information</span>
                                                                                            </h4>
                                                                                            <div className="space-y-2 text-sm">
                                                                                                <div><strong>Device Type:</strong> {selectedRequest.metadata.device.device?.type || "N/A"}</div>
                                                                                                <div><strong>Platform:</strong> {selectedRequest.metadata.device.device?.platform || "N/A"}</div>
                                                                                                <div><strong>Operating System:</strong> {selectedRequest.metadata.device.system?.os || "N/A"}</div>
                                                                                                <div><strong>Browser:</strong> {selectedRequest.metadata.device.browser?.name || "N/A"} {selectedRequest.metadata.device.browser?.version || ""}</div>
                                                                                                <div><strong>Language:</strong> {selectedRequest.metadata.device.browser?.language || "N/A"}</div>
                                                                                                <div><strong>Screen Resolution:</strong> {selectedRequest.metadata.device.device?.screen ? `${selectedRequest.metadata.device.device.screen.width}x${selectedRequest.metadata.device.device.screen.height}` : "N/A"}</div>
                                                                                                <div><strong>Timezone:</strong> {selectedRequest.metadata.device.system?.timezone || "N/A"}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                    {/* Submission Information */}
                                                                                    {selectedRequest.metadata.submission && (
                                                                                        <div className="bg-white p-3 rounded border">
                                                                                            <h4 className="font-medium text-purple-700 mb-2">Submission Details</h4>
                                                                                            <div className="space-y-2 text-sm">
                                                                                                <div><strong>Timestamp:</strong> {selectedRequest.metadata.submission.timestamp ? new Date(selectedRequest.metadata.submission.timestamp).toLocaleString() : "N/A"}</div>
                                                                                                <div><strong>Referrer:</strong> {selectedRequest.metadata.submission.referrer || "Direct"}</div>
                                                                                                <div><strong>Page URL:</strong> {selectedRequest.metadata.submission.url || "N/A"}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                    {/* Raw Metadata (fallback for any additional data) */}
                                                                                    <details className="bg-white p-3 rounded border">
                                                                                        <summary className="font-medium text-gray-700 cursor-pointer">Raw Metadata (Technical)</summary>
                                                                                        <div className="mt-2 space-y-2">
                                                                                            {Object.entries(selectedRequest.metadata).map(([key, value]) => (
                                                                                                <div key={key} className="border-l-2 border-gray-200 pl-3">
                                                                                                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{key}:</span>
                                                                                                    <div className="mt-1">{renderMetadataValue(key, value)}</div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </details>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    {!selectedRequest.approved && !selectedRequest.deleted && (
                                                                        <div className="col-span-2 flex gap-2 mt-4 pt-4 border-t">
                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger asChild>
                                                                                    <Button
                                                                                        variant="default"
                                                                                        className="text-white bg-green-600 hover:bg-green-700"
                                                                                        disabled={loadingStates[selectedRequest._id]?.approve || loadingStates[selectedRequest._id]?.reject}
                                                                                    >
                                                                                        {loadingStates[selectedRequest._id]?.approve ? (
                                                                                            <>
                                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                                Approving...
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Check className="mr-2 h-4 w-4" />
                                                                                                Approve Request
                                                                                            </>
                                                                                        )}
                                                                                    </Button>
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent>
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>Approve Access Request</AlertDialogTitle>
                                                                                        <AlertDialogDescription>
                                                                                            Are you sure you want to approve this access request for <strong>{selectedRequest.firstname} {selectedRequest.lastname}</strong> from <strong>{selectedRequest.businessName}</strong>?
                                                                                            This will grant them access to the platform and send them an approval email.
                                                                                        </AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                        <AlertDialogAction
                                                                                            onClick={() => handleApprove(selectedRequest)}
                                                                                            className="bg-green-600 hover:bg-green-700"
                                                                                        >
                                                                                            Yes, Approve
                                                                                        </AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>

                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger asChild>
                                                                                    <Button
                                                                                        variant="destructive"
                                                                                        disabled={loadingStates[selectedRequest._id]?.approve || loadingStates[selectedRequest._id]?.reject}
                                                                                    >
                                                                                        {loadingStates[selectedRequest._id]?.reject ? (
                                                                                            <>
                                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                                Rejecting...
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <X className="mr-2 h-4 w-4" />
                                                                                                Reject Request
                                                                                            </>
                                                                                        )}
                                                                                    </Button>
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent>
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>Reject Access Request</AlertDialogTitle>
                                                                                        <AlertDialogDescription>
                                                                                            Are you sure you want to reject this access request for <strong>{selectedRequest.firstname} {selectedRequest.lastname}</strong> from <strong>{selectedRequest.businessName}</strong>?
                                                                                            This action cannot be undone and they will not receive access to the platform.
                                                                                        </AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                        <AlertDialogAction
                                                                                            onClick={() => handleReject(selectedRequest)}
                                                                                            className="bg-red-600 hover:bg-red-700"
                                                                                        >
                                                                                            Yes, Reject
                                                                                        </AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </div>
                                                                    )}
                                                                    {selectedRequest.approved && (
                                                                        <div className="col-span-2 mt-4 pt-4 border-t">
                                                                            <div className="flex items-center text-green-600">
                                                                                <Check className="mr-2 h-4 w-4" />
                                                                                <span className="font-semibold">This request has been approved</span>
                                                                            </div>
                                                                            {selectedRequest.approvedAt && (
                                                                                <div className="text-sm text-gray-500 mt-1 space-y-1">
                                                                                    <p><strong>Approved On:</strong> {formatDate(selectedRequest.approvedAt)}</p>
                                                                                    <p><strong>Approved By:</strong> {selectedRequest.approvedBy ? `${selectedRequest.approvedBy.firstname} ${selectedRequest.approvedBy.lastname} (${selectedRequest.approvedBy.email})` : "N/A"}</p>
                                                                                </div>
                                                                            )}
                                                                            <div className="mt-3">
                                                                                <AlertDialog>
                                                                                    <AlertDialogTrigger asChild>
                                                                                        <Button
                                                                                            variant="destructive"
                                                                                            size="sm"
                                                                                            disabled={loadingStates[selectedRequest._id]?.approve || loadingStates[selectedRequest._id]?.reject}
                                                                                        >
                                                                                            {loadingStates[selectedRequest._id]?.reject ? (
                                                                                                <>
                                                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                                    Rejecting...
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <X className="mr-2 h-4 w-4" />
                                                                                                    Reject Request
                                                                                                </>
                                                                                            )}
                                                                                        </Button>
                                                                                    </AlertDialogTrigger>
                                                                                    <AlertDialogContent>
                                                                                        <AlertDialogHeader>
                                                                                            <AlertDialogTitle>Reject Approved Request</AlertDialogTitle>
                                                                                            <AlertDialogDescription>
                                                                                                Are you sure you want to reject this previously approved request for <strong>{selectedRequest.firstname} {selectedRequest.lastname}</strong> from <strong>{selectedRequest.businessName}</strong>?
                                                                                                This will revoke their access and they will no longer be able to use the platform.
                                                                                            </AlertDialogDescription>
                                                                                        </AlertDialogHeader>
                                                                                        <AlertDialogFooter>
                                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                            <AlertDialogAction
                                                                                                onClick={() => handleReject(selectedRequest)}
                                                                                                className="bg-red-600 hover:bg-red-700"
                                                                                            >
                                                                                                Yes, Reject
                                                                                            </AlertDialogAction>
                                                                                        </AlertDialogFooter>
                                                                                    </AlertDialogContent>
                                                                                </AlertDialog>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {selectedRequest.deleted && (
                                                                        <div className="col-span-2 mt-4 pt-4 border-t">
                                                                            <div className="flex items-center text-red-600">
                                                                                <X className="mr-2 h-4 w-4" />
                                                                                <span className="font-semibold">This request has been rejected</span>
                                                                            </div>
                                                                            {selectedRequest.deletedAt && (
                                                                                <p className="text-sm text-gray-500 mt-1">
                                                                                    Rejected on {formatDate(selectedRequest.deletedAt)}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {!loading && requestedAccess.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No access requests found matching your criteria.
                            </div>
                        )}
                    </CardContent>

                    <div className="border-t px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total requests)
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
