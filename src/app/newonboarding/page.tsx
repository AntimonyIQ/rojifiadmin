import { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPagination, IResponse, ISender } from "@/interface/interface";
import Defaults from "@/defaults/defaults";
import { session, SessionData } from "@/session/session";
import { Status } from "@/enums/enums";

// Import our new stage components
import StageOneFormValidation from './StageOneFormValidation';
import StageTwoDocumentReview from './StageTwoDocumentReview';
import StageThreeDirectorsShareholders from './StageThreeDirectorsShareholders';
import StageFourFinalReview from './StageFourFinalReview';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, X, Loader2, Eye, FileText, Send, Filter, TrendingUp, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function NewOnboardingPage() {
    const [value, setValue] = useState<string>("list");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedSender, setSelectedSender] = useState<ISender | null>(null);
    const [selectedAction, setSelectedAction] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [senders, setSenders] = useState<Array<ISender>>([]);
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [pagination, setPagination] = useState<IPagination>({
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 10,
    });

    // Filters
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterCountry, setFilterCountry] = useState<string>("all");
    const [filterRisk, setFilterRisk] = useState<string>("all");

    // 4-Stage Validation Modal States
    const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);
    const [currentStage, setCurrentStage] = useState<number>(1);
    const [validationLoading, setValidationLoading] = useState<boolean>(false);
    const [documentModalOpen, setDocumentModalOpen] = useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] = useState<{
        type: string;
        url: string;
        verified: boolean;
        isRaw?: boolean;
        blobUrl?: string;
        isLoading?: boolean;
        error?: string;
        fileExtension?: string;
    } | null>(null);
    const [editableFormData, setEditableFormData] = useState<Partial<ISender>>({});

    const sd: SessionData = session.getUserData();

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchSenders();
    }, [pagination.page, pagination.limit, debouncedSearch]);

    // Cleanup blob URLs when document modal is closed
    useEffect(() => {
        return () => {
            if (selectedDocument?.blobUrl) {
                URL.revokeObjectURL(selectedDocument.blobUrl);
            }
        };
    }, [selectedDocument?.blobUrl]);

    // Cleanup blob URL when modal is closed
    useEffect(() => {
        if (!documentModalOpen && selectedDocument?.blobUrl) {
            URL.revokeObjectURL(selectedDocument.blobUrl);
            setSelectedDocument(prev => prev ? { ...prev, blobUrl: undefined } : null);
        }
    }, [documentModalOpen]);

    const fetchSenders = async () => {
        try {
            setLoading(true)

            Defaults.LOGIN_STATUS();

            const searchParam = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : "";
            const url: string = `${Defaults.API_BASE_URL}/admin/sender/list?page=${pagination.page}&limit=${pagination.limit}${searchParam}&businessVerificationCompleted=true`;

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    ...Defaults.HEADERS,
                    "Content-Type": "application/json",
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
            });
            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                if (!data.handshake) throw new Error('Unable to process login response right now, please try again.');
                const parseData: Array<ISender> = Defaults.PARSE_DATA(data.data, sd.client.privateKey, data.handshake);
                console.log("Fetched access requests:", parseData);
                setSenders(parseData);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            }
        } catch (error: any) {
            console.error("Error fetching senders:", error)
        } finally {
            setLoading(false)
        }
    }

    // Helper function to open validation modal
    const openValidationModal = (sender: ISender) => {
        setSelectedSender(sender);
        setEditableFormData(sender);
        setCurrentStage(1);
        setIsValidationModalOpen(true);
    };

    // Helper function to proceed to next stage
    const proceedToNextStage = () => {
        if (currentStage < 4) {
            setCurrentStage(currentStage + 1);
        }
    };

    // Helper function to go back to previous stage
    const goToPreviousStage = () => {
        if (currentStage > 1) {
            setCurrentStage(currentStage - 1);
        }
    };

    // Helper function to handle document viewing
    const viewDocument = async (document: any) => {
        const isCloudinaryRaw = /\/raw\/upload\//.test(document.url);

        // Extract file extension from document name or URL
        const fileName = document.name || document.which || 'document';
        const urlParts = document.url.split('/').pop()?.split('.');
        const fileExt = fileName.includes('.')
            ? fileName.split('.').pop()?.toLowerCase()
            : urlParts && urlParts.length > 1
                ? urlParts.pop()?.toLowerCase()
                : 'pdf'; // default to pdf for raw uploads

        // Set initial state
        setSelectedDocument({
            type: fileName,
            url: document.url,
            verified: document.kycVerified,
            isRaw: isCloudinaryRaw,
            fileExtension: fileExt,
            isLoading: isCloudinaryRaw && fileExt === 'pdf', // Only show loading for PDFs that need blob fetch
            blobUrl: undefined,
            error: undefined
        });
        setDocumentModalOpen(true);

        // For PDFs from raw uploads, fetch as blob for inline viewing
        if (isCloudinaryRaw && fileExt === 'pdf') {
            try {
                console.log('Fetching PDF from:', document.url);

                const response = await fetch(document.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/pdf',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
                }

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                setSelectedDocument(prev => prev ? {
                    ...prev,
                    blobUrl: blobUrl,
                    isLoading: false,
                    error: undefined
                } : null);

            } catch (error) {
                console.error('Error fetching PDF:', error);
                setSelectedDocument(prev => prev ? {
                    ...prev,
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Failed to load document'
                } : null);
            }
        }
    }; const handleFormInputChange = (field: keyof ISender, value: any) => {
        setEditableFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Helper function to submit to Bank
    const submitToBank = async () => {
        try {
            setValidationLoading(true);
            // TODO: Implement API call to submit to Bank
            console.log('Submitting to Bank:', selectedSender);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsValidationModalOpen(false);
            setCurrentStage(1);
        } catch (error) {
            console.error('Error submitting to Bank:', error);
        } finally {
            setValidationLoading(false);
        }
    };

    // Derived statistics & filter option sets
    const stats = useMemo(() => {
        const total = senders.length;
        const active = senders.filter(s => s.status === 'active').length;
        const inReview = senders.filter(s => s.status === 'in-review' || s.affiliationStatus === 'pending').length;
        const suspended = senders.filter(s => s.status === 'suspended').length;
        return { total, active, inReview, suspended };
    }, [senders]);

    const countryOptions = useMemo(() => Array.from(new Set(senders.map(s => s.country).filter(Boolean))) as string[], [senders]);
    const riskOptions = useMemo(() => Array.from(new Set(senders.map(s => (s as any).riskLevel).filter(Boolean))) as string[], [senders]);

    // Apply client-side filtering (server search still applies for search input)
    const displayedSenders = useMemo(() => {
        return senders.filter(s => {
            const statusMatch = filterStatus === 'all' || s.status === filterStatus || s.affiliationStatus === filterStatus;
            const countryMatch = filterCountry === 'all' || s.country === filterCountry;
            const riskMatch = filterRisk === 'all' || (s as any).riskLevel === filterRisk;
            return statusMatch && countryMatch && riskMatch;
        });
    }, [senders, filterStatus, filterCountry, filterRisk]);

    const clearFilters = () => {
        setFilterStatus('all');
        setFilterCountry('all');
        setFilterRisk('all');
    }

    return (
        <div className="space-y-6 p-4">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">New Onboarding</h1>
                <p className="text-sm text-muted-foreground">Manage new onboarding businesses and their onboarding status</p>
            </header>

            <div className="bg-card p-4 rounded-md">
                <Tabs value={value} onValueChange={(v) => setValue(v)}>
                    <TabsList>
                        <TabsTrigger value="list">All Onboarding</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list">
                        <div className="space-y-3">
                            {/* Summary Cards */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 w-full">
                                <Card className="border shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Total Onboarding</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold tabular-nums">{stats.total}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Across all statuses</p>
                                    </CardContent>
                                </Card>
                                <Card className="border shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /> Active</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold tabular-nums">{stats.active}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Currently live</p>
                                    </CardContent>
                                </Card>
                                <Card className="border shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2"><Loader2 className="h-4 w-4 text-amber-500" /> In Review</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold tabular-nums">{stats.inReview}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Pending validation</p>
                                    </CardContent>
                                </Card>
                                <Card className="border shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2"><X className="h-4 w-4 text-red-600" /> Suspended</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold tabular-nums">{stats.suspended}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Access restricted</p>
                                    </CardContent>
                                </Card>
                                <Card className="border shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> All Onboarding + Sender</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold tabular-nums">{stats.total}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Across all statuses</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Filters & Search */}
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between mt-2">
                                <div className="flex flex-col sm:flex-row sm:items-end gap-3 w-full">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs uppercase tracking-wide">Search</Label>
                                        <div className="relative">
                                            <Input
                                                placeholder="Search new onboarding..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="pl-8 w-full sm:w-64"
                                            />
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs uppercase tracking-wide">Status</Label>
                                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                                            <SelectTrigger className="w-[160px]">
                                                <SelectValue placeholder="All Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="in-review">In Review</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="suspended">Suspended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs uppercase tracking-wide">Country</Label>
                                        <Select value={filterCountry} onValueChange={setFilterCountry}>
                                            <SelectTrigger className="w-[160px]">
                                                <SelectValue placeholder="All Countries" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                {countryOptions.map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {riskOptions.length > 0 && (
                                        <div className="flex flex-col gap-1">
                                            <Label className="text-xs uppercase tracking-wide">Risk</Label>
                                            <Select value={filterRisk} onValueChange={setFilterRisk}>
                                                <SelectTrigger className="w-[140px]">
                                                    <SelectValue placeholder="All Risk" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    {riskOptions.map(r => (
                                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center gap-1">
                                        <Filter className="h-4 w-4" /> Reset
                                    </Button>
                                    <Button variant="outline" size="sm" className="btn btn-sm">New Onboarding</Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium">New Onboarding</h2>
                                <div className="text-sm text-muted-foreground">Showing {displayedSenders.length} of {senders.length}</div>
                            </div>

                            <div className="mt-4 overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Business Name</TableHead>
                                            <TableHead>Country</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date Added</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-6 text-sm text-muted-foreground">
                                                    <div className="flex items-center justify-center gap-2 h-40">
                                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                                        <span>Loading senders...</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {!loading && displayedSenders.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-6 text-sm text-muted-foreground">No senders found.</TableCell>
                                            </TableRow>
                                        )}

                                        {!loading && displayedSenders.map((s: ISender, idx: number) => (
                                            <TableRow key={s._id || idx}>
                                                <TableCell className="font-medium">{s.businessName || "-"}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <img src={s.countryflag} alt="" className="h-5 w-5 rounded-full" />
                                                        <span>{s.country || "-"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{s.email || "-"}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            s.status === 'active' ? 'default' :
                                                                s.status === 'in-review' ? 'secondary' :
                                                                    s.status === 'suspended' ? 'destructive' :
                                                                        s.affiliationStatus === 'live' ? 'default' :
                                                                            s.affiliationStatus === 'pending' ? 'secondary' :
                                                                                'outline'
                                                        }
                                                        className="capitalize"
                                                    >
                                                        {s.status || s.affiliationStatus || 'unapproved'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US') : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-end">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className="btn btn-ghost btn-sm" aria-label="Actions">
                                                                    <MoreHorizontal size={16} />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem onSelect={() => openValidationModal(s)}>
                                                                    <Eye className="mr-2" size={14} /> View & Validate
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => { setSelectedSender(s); setSelectedAction('approve'); setIsDialogOpen(true); }}>
                                                                    <Eye className="mr-2" size={14} /> Review
                                                                </DropdownMenuItem>
                                                                {/**
                                                                 * 
                                                                <DropdownMenuItem className="text-red-500" onSelect={() => { setSelectedSender(s); setSelectedAction('request_info'); setIsDialogOpen(true); }}>
                                                                    <X className="mr-2" size={14} /> Suspend
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => { setSelectedSender(s); setSelectedAction('reject'); setIsDialogOpen(true); }}>
                                                                    <X className="mr-2" size={14} /> Archive
                                                                </DropdownMenuItem>
                                                                 * 
                                                                 */}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={pagination.page <= 1}
                                        >
                                            Previous
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                const pageNum = pagination.page <= 3 ? i + 1 :
                                                    pagination.page >= pagination.totalPages - 2 ? pagination.totalPages - 4 + i :
                                                        pagination.page - 2 + i;

                                                if (pageNum < 1 || pageNum > pagination.totalPages) return null;

                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={pagination.page === pageNum ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={pagination.page >= pagination.totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Action confirmation dialog */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{selectedAction ? selectedAction.replace('_', ' ').toUpperCase() : 'Action'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-2">
                                        <p className="text-sm text-muted-foreground">Confirm <strong>{selectedAction}</strong> for sender <strong>{selectedSender?.businessName || selectedSender?._id}</strong>.</p>
                                    </div>
                                    <DialogFooter>
                                        <div className="flex gap-2">
                                            <button className="btn btn-sm" onClick={() => setIsDialogOpen(false)}>Cancel</button>
                                            <button className="btn btn-sm btn-primary" onClick={async () => {
                                                // TODO: call API to perform action
                                                console.log('Perform action', selectedAction, 'for', selectedSender);
                                                setIsDialogOpen(false);
                                            }}>Confirm</button>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* 4-Stage Validation Modal */}
                            <Dialog open={isValidationModalOpen} onOpenChange={setIsValidationModalOpen}>
                                <DialogContent className="max-w-[80%] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            New Onboarding Validation - {selectedSender?.businessName}
                                        </DialogTitle>
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">Progress</span>
                                                <span className="text-sm text-muted-foreground">
                                                    Stage {currentStage} of 4
                                                </span>
                                            </div>
                                            <Progress value={(currentStage / 4) * 100} className="w-full" />
                                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                                <span className={currentStage >= 1 ? "text-primary font-medium" : ""}>
                                                    Form Validation
                                                </span>
                                                <span className={currentStage >= 2 ? "text-primary font-medium" : ""}>
                                                    Document Review
                                                </span>
                                                <span className={currentStage >= 3 ? "text-primary font-medium" : ""}>
                                                    Directors & Shareholders
                                                </span>
                                                <span className={currentStage >= 4 ? "text-primary font-medium" : ""}>
                                                    Final Review
                                                </span>
                                            </div>
                                        </div>
                                    </DialogHeader>

                                    <div className="mt-6">
                                        {/* Stage 1: Form Input Validation */}
                                        {currentStage === 1 && (
                                            <StageOneFormValidation
                                                editableFormData={editableFormData}
                                                handleFormInputChange={handleFormInputChange}
                                            />
                                        )}

                                        {/* Stage 2: Document Review */}
                                        {currentStage === 2 && (
                                            <StageTwoDocumentReview
                                                selectedSender={selectedSender}
                                                viewDocument={viewDocument}
                                            />
                                        )}

                                        {/* Stage 3: Directors & Shareholders */}
                                        {currentStage === 3 && (
                                            <StageThreeDirectorsShareholders
                                                selectedSender={selectedSender}
                                                viewDocument={viewDocument}
                                            />
                                        )}

                                        {/* Stage 4: Final Review */}
                                        {currentStage === 4 && (
                                            <StageFourFinalReview
                                                selectedSender={selectedSender}
                                                editableFormData={editableFormData}
                                            />
                                        )}
                                    </div>

                                    <DialogFooter className="flex justify-between">
                                        <div className="flex gap-2">
                                            {currentStage > 1 && (
                                                <Button variant="outline" onClick={goToPreviousStage}>
                                                    Previous
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => setIsValidationModalOpen(false)}>
                                                Cancel
                                            </Button>
                                            {currentStage < 4 ? (
                                                <Button onClick={proceedToNextStage}>
                                                    Next Stage
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={submitToBank}
                                                    disabled={validationLoading}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {validationLoading ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Submit to Bank
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Document Viewer Modal */}
                            <Dialog open={documentModalOpen} onOpenChange={setDocumentModalOpen}>
                                <DialogContent className="max-w-6xl max-h-[95vh]">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center justify-between">
                                            <span>Document Viewer - {selectedDocument?.type}</span>
                                            <div className="flex items-center gap-2 pr-5">
                                                <Badge variant={selectedDocument?.verified ? "default" : "secondary"}>
                                                    {selectedDocument?.verified ? 'Verified' : 'Pending'}
                                                </Badge>
                                            </div>
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="flex-1 min-h-[70vh] bg-gray-100 rounded-lg flex items-center justify-center">
                                        {selectedDocument?.isLoading ? (
                                            // Loading state for PDFs being fetched
                                            <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                                                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-500" />
                                                <p className="text-lg font-medium text-gray-700 mb-2">Loading Document...</p>
                                                <p className="text-sm text-gray-500">Fetching PDF for inline viewing</p>
                                            </div>
                                        ) : selectedDocument?.error ? (
                                            // Error state
                                            <div className="text-center text-red-500 flex flex-col items-center justify-center h-full">
                                                <X className="h-12 w-12 mx-auto mb-4 text-red-400" />
                                                <p className="text-lg font-medium text-gray-700 mb-2">Failed to Load Document</p>
                                                <p className="text-sm text-gray-500 mb-4">{selectedDocument.error}</p>
                                                <Button
                                                    onClick={() => window.open(selectedDocument.url, '_blank')}
                                                    variant="outline"
                                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Try Original Link
                                                </Button>
                                            </div>
                                        ) : selectedDocument?.url ? (
                                            (() => {
                                                const ext = selectedDocument.fileExtension;

                                                // For images - display directly
                                                if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) {
                                                    return (
                                                        <iframe
                                                            src={selectedDocument.url}
                                                            className="w-full h-[70vh] border-0 rounded"
                                                            title="Image Viewer"
                                                            onError={(e) => {
                                                                console.error('Image viewer error:', e);
                                                                setSelectedDocument(prev => prev ? {
                                                                    ...prev,
                                                                    error: 'Unable to display image preview'
                                                                } : null);
                                                            }}
                                                        />
                                                    );
                                                }

                                                // For PDFs and Office documents - use Google Docs viewer
                                                if (ext === "pdf" || ext === "doc" || ext === "docx" || ext === "ppt" || ext === "pptx" || ext === "xls" || ext === "xlsx") {
                                                    const viewer = `https://docs.google.com/gview?url=${encodeURIComponent(selectedDocument.url)}&embedded=true`;
                                                    return (
                                                        <iframe
                                                            src={viewer}
                                                            className="w-full h-[70vh] border-0 rounded"
                                                            title={selectedDocument.type ?? "Document Preview"}
                                                            onError={(e) => {
                                                                console.error('Google Docs viewer error:', e);
                                                                setSelectedDocument(prev => prev ? {
                                                                    ...prev,
                                                                    error: 'Google Docs viewer failed to load this document. The file may not be publicly accessible.'
                                                                } : null);
                                                            }}
                                                        />
                                                    );
                                                }

                                                // For unsupported file types
                                                return (
                                                    <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                                                        <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                                        <p className="text-lg font-medium text-gray-700 mb-2">Preview Not Available</p>
                                                        <p className="text-sm text-gray-500 mb-4">
                                                            This file type ({ext?.toUpperCase() || 'Unknown'}) cannot be previewed inline
                                                        </p>
                                                        <Button
                                                            onClick={() => window.open(selectedDocument.url, '_blank')}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Open in New Tab
                                                        </Button>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                <FileText className="h-12 w-12 mx-auto mb-2" />
                                                <p className="text-lg font-medium">Document not available</p>
                                                <p className="text-sm text-gray-400 mt-1">No document URL provided</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Fallback message for unsupported files */}
                                    {selectedDocument?.url && (
                                        <div className="text-xs text-gray-500 text-center py-2 bg-gray-50 rounded">
                                            <p>
                                                If the document doesn't display properly above, click "Open Original" to view it in a new tab.
                                                Supported formats: PDF, images (JPG, PNG, GIF), and other browser-compatible files.
                                            </p>
                                        </div>
                                    )}

                                    <DialogFooter className="flex justify-between">
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => setDocumentModalOpen(false)}>
                                                Close
                                            </Button>
                                            {selectedDocument?.url && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        // Copy document URL to clipboard
                                                        navigator.clipboard.writeText(selectedDocument.url);
                                                        alert('Document URL copied to clipboard');
                                                    }}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Copy URL
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    // TODO: Implement reject/flag document
                                                    console.log('Flagging document as problematic:', selectedDocument);
                                                    alert('Document flagged for review');
                                                }}
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Flag Issue
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    // TODO: Implement document verification API call
                                                    console.log('Marking document as verified:', selectedDocument);
                                                    alert('Document marked as verified');
                                                    setDocumentModalOpen(false);
                                                }}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <Check className="mr-2 h-4 w-4" />
                                                Mark as Verified
                                            </Button>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </TabsContent>

                    <TabsContent value="dashboard">
                        <div className="space-y-3">
                            <h2 className="text-lg font-medium">Dashboard</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 rounded border bg-background">Summary card 1 (placeholder)</div>
                                <div className="p-4 rounded border bg-background">Summary card 2 (placeholder)</div>
                                <div className="p-4 rounded border bg-background">Summary card 3 (placeholder)</div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="admin">
                        <div className="space-y-3">
                            <h2 className="text-lg font-medium">Admin</h2>
                            <div className="p-4 rounded border bg-background text-sm text-muted-foreground">
                                Admin controls and settings for senders go here.
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}