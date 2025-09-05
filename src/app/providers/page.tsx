import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Search,
    Eye,
    ChevronLeft,
    ChevronRight,
    Download,
    Building,
    Wallet,
    Activity,
    TrendingUp,
    Loader2,
    Settings,
    ToggleLeft,
    ToggleRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { IProvider, IResponse, IPagination } from "@/interface/interface";
import { Status } from "@/enums/enums";
import { session, SessionData } from "@/session/session";
import Defaults from "@/defaults/defaults";

export default function ProvidersPage() {
    const [providers, setProviders] = useState<IProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState<IProvider | null>(null);
    const [editingProvider, setEditingProvider] = useState<IProvider | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [engineFilter, setEngineFilter] = useState<string>("all");
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
    const [settingsFormData, setSettingsFormData] = useState({
        rojifiFee: 0,
        cryptofee: 0,
        sellrate: 0,
        buyrate: 0,
        price: 0,
        threshold: 0,
        tier0: 0,
        tier1: 0,
        tier2: 0,
        tier3: 0,
        tier4: 0,
        engine: "MANUAL" as string,
        active: false
    });
    const [pagination, setPagination] = useState<IPagination>({
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 0,
    });
    const sd: SessionData = session.getUserData();

    // Fetch providers with filters and pagination
    useEffect(() => {
        fetchProviders();
    }, [pagination.page, pagination.limit, searchTerm, statusFilter, engineFilter]);

    const fetchProviders = async () => {
        try {
            setLoading(true);
            Defaults.LOGIN_STATUS();

            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            if (searchTerm) params.append('search', searchTerm);
            if (statusFilter !== 'all') {
                params.append('active', statusFilter === 'active' ? 'true' : 'false');
            }
            if (engineFilter !== 'all') {
                params.append('engine', engineFilter);
            }

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/provider/list?${params}`, {
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
                const parseData: Array<IProvider> = Defaults.PARSE_DATA(data.data, sd.client.privateKey, data.handshake);
                setProviders(parseData);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            }
        } catch (error: any) {
            toast({
                title: "Error fetching providers",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const toggleProviderStatus = async (providerId: string, currentStatus: boolean) => {
        try {
            setLoadingStates(prev => ({ ...prev, [providerId]: true }));
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/provider/${providerId}/toggle`, {
                method: 'PATCH',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({ active: !currentStatus }),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Provider status updated",
                    description: `Provider has been ${!currentStatus ? 'activated' : 'deactivated'}.`,
                    variant: "default",
                });
                await fetchProviders();
            }
        } catch (error: any) {
            toast({
                title: "Error updating provider status",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [providerId]: false }));
        }
    }

    const bulkDeactivateProviders = async () => {
        try {
            const activeProviderIds = providers
                .filter(p => p.active && p._id)
                .map(p => p._id);

            if (activeProviderIds.length === 0) {
                toast({
                    title: "No active providers",
                    description: "There are no active providers to deactivate.",
                    variant: "destructive",
                });
                return;
            }

            setLoading(true);
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/provider/bulk-deactivate`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({ providerIds: activeProviderIds }),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Bulk deactivation successful",
                    description: `${activeProviderIds.length} providers have been deactivated.`,
                    variant: "default",
                });
                await fetchProviders();
            }
        } catch (error: any) {
            toast({
                title: "Error deactivating providers",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const updateProviderSettings = async (providerId: string, formData: any) => {
        try {
            setLoadingStates(prev => ({ ...prev, [providerId]: true }));

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/provider/${providerId}`, {
                method: 'PUT',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify(formData),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Provider settings updated",
                    description: "Provider settings have been updated successfully.",
                    variant: "default",
                });
                await fetchProviders();
                setEditingProvider(null);
            }
        } catch (error: any) {
            toast({
                title: "Error updating provider settings",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [providerId]: false }));
        }
    };

    const openSettingsModal = (provider: IProvider) => {
        setEditingProvider(provider);
        setSettingsFormData({
            rojifiFee: provider.rojifiFee,
            cryptofee: provider.cryptofee,
            sellrate: provider.sellrate,
            buyrate: provider.buyrate,
            price: provider.price,
            threshold: provider.threshold,
            tier0: provider.tier0,
            tier1: provider.tier1,
            tier2: provider.tier2,
            tier3: provider.tier3,
            tier4: provider.tier4,
            engine: provider.engine,
            active: provider.active
        });
    };

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProvider) {
            updateProviderSettings(editingProvider._id || editingProvider.walletId, settingsFormData);
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

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === 'NGN' ? 'NGN' : 'USD',
            minimumFractionDigits: 2,
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

    const activeProviders = Array.isArray(providers) ? providers.filter(p => p.active).length : 0;
    const totalBalance = Array.isArray(providers) ? providers.reduce((sum, p) => sum + p.balance, 0) : 0;
    const totalVolume = Array.isArray(providers) ? providers.reduce((sum, p) => sum + (p.threshold || 0), 0) : 0;

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Providers Management</h1>
                    <div className="flex gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={bulkDeactivateProviders}
                                    disabled={loading || activeProviders === 0}
                                >
                                    <ToggleLeft className="h-4 w-4 mr-2" />
                                    Deactivate All
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Deactivate all active providers at once</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Export providers data to CSV</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Providers
                            </CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pagination.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Providers
                            </CardTitle>
                            <Activity className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{activeProviders}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Balance
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatCurrency(totalBalance, 'USD')}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Threshold
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {formatCurrency(totalVolume, 'USD')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
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
                                        placeholder="Search by wallet ID, currency, name..."
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
                                        <SelectItem value="all">All Providers</SelectItem>
                                        <SelectItem value="active">Active Only</SelectItem>
                                        <SelectItem value="inactive">Inactive Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full sm:w-48">
                                <Select value={engineFilter} onValueChange={setEngineFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by engine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Engines</SelectItem>
                                        <SelectItem value="BITCOIN">Bitcoin</SelectItem>
                                        <SelectItem value="ETHEREUM">Ethereum</SelectItem>
                                        <SelectItem value="TRON">Tron</SelectItem>
                                        <SelectItem value="BINANCE">Binance</SelectItem>
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

                {/* Providers Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Providers List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Wallet ID</TableHead>
                                    <TableHead>Currency</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Balance</TableHead>
                                    <TableHead>Engine</TableHead>
                                    <TableHead>Buy Rate</TableHead>
                                    <TableHead>Sell Rate</TableHead>
                                    <TableHead>Threshold</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    Array.isArray(providers) && providers.map((provider) => (
                                        <TableRow key={provider.walletId}>
                                            <TableCell className="font-medium font-mono text-xs">
                                                {provider.walletId}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={provider.icon}
                                                        alt={provider.currency}
                                                        className="w-6 h-6 rounded-full"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/default-coin.png';
                                                        }}
                                                    />
                                                    <span className="font-medium">{provider.currency}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {provider.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono">
                                                {formatCurrency(provider.balance, provider.currency)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {provider.engine}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono text-green-600">
                                                {provider.buyrate.toFixed(4)}
                                            </TableCell>
                                            <TableCell className="font-mono text-red-600">
                                                {provider.sellrate.toFixed(4)}
                                            </TableCell>
                                            <TableCell className="font-mono">
                                                {formatCurrency(provider.threshold, provider.currency)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={provider.active ? "default" : "secondary"}
                                                        className={provider.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                                                    >
                                                        {provider.active ? "Active" : "Inactive"}
                                                    </Badge>
                                                    <Badge
                                                        variant={provider.status === 'active' ? "default" : "destructive"}
                                                    >
                                                        {provider.status}
                                                    </Badge>
                                                </div>
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
                                                                        onClick={() => setSelectedProvider(provider)}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>View provider details</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle>Provider Details</DialogTitle>
                                                                <DialogDescription>
                                                                    Detailed information for provider {selectedProvider?.walletId}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            {selectedProvider && (
                                                                <div className="space-y-6">
                                                                    {/* Wallet Information */}
                                                                    <div>
                                                                        <h4 className="font-semibold mb-3">Wallet Information</h4>
                                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                                            <div><strong>Wallet ID:</strong> {selectedProvider.walletId}</div>
                                                                            <div><strong>Currency:</strong> {selectedProvider.currency}</div>
                                                                            <div><strong>Type:</strong> {selectedProvider.type}</div>
                                                                            <div><strong>Status:</strong> {selectedProvider.status}</div>
                                                                            <div><strong>Balance:</strong> {formatCurrency(selectedProvider.balance, selectedProvider.currency)}</div>
                                                                            <div><strong>Pending Balance:</strong> {formatCurrency(selectedProvider.pending_payment_balance, selectedProvider.currency)}</div>
                                                                            <div><strong>Primary:</strong> {selectedProvider.isPrimary ? 'Yes' : 'No'}</div>
                                                                            <div><strong>Activated:</strong> {selectedProvider.activated ? 'Yes' : 'No'}</div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Provider Specific */}
                                                                    <div>
                                                                        <h4 className="font-semibold mb-3">Provider Settings</h4>
                                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                                            <div><strong>Engine:</strong> {selectedProvider.engine}</div>
                                                                            <div><strong>Active:</strong> {selectedProvider.active ? 'Yes' : 'No'}</div>
                                                                            <div><strong>Buy Rate:</strong> {selectedProvider.buyrate}</div>
                                                                            <div><strong>Sell Rate:</strong> {selectedProvider.sellrate}</div>
                                                                            <div><strong>WX Fee:</strong> {selectedProvider.wxfee}%</div>
                                                                            <div><strong>Rojifi Fee:</strong> {selectedProvider.rojifiFee}%</div>
                                                                            <div><strong>Crypto Fee:</strong> {selectedProvider.cryptofee}%</div>
                                                                            <div><strong>Price:</strong> {formatCurrency(selectedProvider.price, selectedProvider.currency)}</div>
                                                                            <div><strong>Threshold:</strong> {formatCurrency(selectedProvider.threshold, selectedProvider.currency)}</div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Tier Limits */}
                                                                    <div>
                                                                        <h4 className="font-semibold mb-3">Tier Limits</h4>
                                                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                                                            <div><strong>Tier 0:</strong> {formatCurrency(selectedProvider.tier0, selectedProvider.currency)}</div>
                                                                            <div><strong>Tier 1:</strong> {formatCurrency(selectedProvider.tier1, selectedProvider.currency)}</div>
                                                                            <div><strong>Tier 2:</strong> {formatCurrency(selectedProvider.tier2, selectedProvider.currency)}</div>
                                                                            <div><strong>Tier 3:</strong> {formatCurrency(selectedProvider.tier3, selectedProvider.currency)}</div>
                                                                            <div><strong>Tier 4:</strong> {formatCurrency(selectedProvider.tier4, selectedProvider.currency)}</div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Unique Fees */}
                                                                    {selectedProvider.uniqueFee && selectedProvider.uniqueFee.length > 0 && (
                                                                        <div>
                                                                            <h4 className="font-semibold mb-3">Unique Fees</h4>
                                                                            <div className="space-y-2">
                                                                                {selectedProvider.uniqueFee.map((fee, index) => (
                                                                                    <div key={index} className="flex justify-between text-sm">
                                                                                        <span>{fee.currency}:</span>
                                                                                        <span>{formatCurrency(fee.amount, fee.currency)}</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Timestamps */}
                                                                    <div>
                                                                        <h4 className="font-semibold mb-3">Timestamps</h4>
                                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                                            <div><strong>Created:</strong> {formatDate(selectedProvider.createdAt)}</div>
                                                                            <div><strong>Updated:</strong> {formatDate(selectedProvider.updatedAt)}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => toggleProviderStatus(provider._id || provider.walletId, provider.active)}
                                                                disabled={loadingStates[provider._id || provider.walletId]}
                                                            >
                                                                {loadingStates[provider._id || provider.walletId] ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : provider.active ? (
                                                                    <ToggleRight className="h-4 w-4 text-green-600" />
                                                                ) : (
                                                                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{provider.active ? 'Deactivate' : 'Activate'} provider</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => openSettingsModal(provider)}
                                                                    >
                                                                        <Settings className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Provider Settings</DialogTitle>
                                                                        <DialogDescription>
                                                                            Update rates, fees, and other provider settings for {provider.walletId}
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    {editingProvider && (
                                                                        <form onSubmit={handleSettingsSubmit} className="space-y-6">
                                                                            {/* Rates Section */}
                                                                            <div>
                                                                                <h4 className="font-semibold mb-3">Exchange Rates</h4>
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Buy Rate</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.0001"
                                                                                            value={settingsFormData.buyrate}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                buyrate: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Buy rate"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Sell Rate</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.0001"
                                                                                            value={settingsFormData.sellrate}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                sellrate: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Sell rate"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Current Price</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.01"
                                                                                            value={settingsFormData.price}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                price: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Current price"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Threshold</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.01"
                                                                                            value={settingsFormData.threshold}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                threshold: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Threshold amount"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Fees Section */}
                                                                            <div>
                                                                                <h4 className="font-semibold mb-3">Fees</h4>
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Rojifi Fee (%)</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.01"
                                                                                            value={settingsFormData.rojifiFee}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                rojifiFee: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Rojifi fee percentage"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Crypto Fee (%)</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.01"
                                                                                            value={settingsFormData.cryptofee}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                cryptofee: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Crypto fee percentage"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Tier Limits Section */}
                                                                            <div>
                                                                                <h4 className="font-semibold mb-3">Tier Limits</h4>
                                                                                <div className="grid grid-cols-3 gap-4">
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Tier 0</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.01"
                                                                                            value={settingsFormData.tier0}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                tier0: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Tier 0 limit"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Tier 1</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.01"
                                                                                            value={settingsFormData.tier1}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                tier1: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Tier 1 limit"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Tier 2</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.01"
                                                                                            value={settingsFormData.tier2}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                tier2: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Tier 2 limit"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Tier 3</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.01"
                                                                                            value={settingsFormData.tier3}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                tier3: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Tier 3 limit"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Tier 4</label>
                                                                                        <Input
                                                                                            type="number"
                                                                                            step="0.01"
                                                                                            value={settingsFormData.tier4}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                tier4: parseFloat(e.target.value) || 0
                                                                                            }))}
                                                                                            placeholder="Tier 4 limit"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Engine and Status Section */}
                                                                            <div>
                                                                                <h4 className="font-semibold mb-3">Configuration</h4>
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Engine</label>
                                                                                        <Select value={settingsFormData.engine} onValueChange={(value) => setSettingsFormData(prev => ({ ...prev, engine: value }))}>
                                                                                            <SelectTrigger>
                                                                                                <SelectValue placeholder="Select engine" />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent>
                                                                                                <SelectItem value="MANUAL">Manual</SelectItem>
                                                                                                <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                                                                                                <SelectItem value="BITCOIN">Bitcoin</SelectItem>
                                                                                                <SelectItem value="ETHEREUM">Ethereum</SelectItem>
                                                                                                <SelectItem value="TRON">Tron</SelectItem>
                                                                                                <SelectItem value="BINANCE">Binance</SelectItem>
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2 mt-6">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="active"
                                                                                            checked={settingsFormData.active}
                                                                                            onChange={(e) => setSettingsFormData(prev => ({
                                                                                                ...prev,
                                                                                                active: e.target.checked
                                                                                            }))}
                                                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                                                        />
                                                                                        <label htmlFor="active" className="text-sm font-medium">
                                                                                            Active Provider
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Form Actions */}
                                                                            <div className="flex justify-end space-x-2 pt-4 border-t">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    onClick={() => setEditingProvider(null)}
                                                                                >
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button
                                                                                    type="submit"
                                                                                    disabled={loadingStates[editingProvider._id || editingProvider.walletId]}
                                                                                >
                                                                                    {loadingStates[editingProvider._id || editingProvider.walletId] ? (
                                                                                        <>
                                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                            Updating...
                                                                                        </>
                                                                                    ) : (
                                                                                        'Update Provider'
                                                                                    )}
                                                                                </Button>
                                                                            </div>
                                                                        </form>
                                                                    )}
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Configure provider settings</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {(!Array.isArray(providers) || providers.length === 0) && !loading && (
                            <div className="text-center py-8 text-muted-foreground">
                                No providers found matching your criteria.
                            </div>
                        )}
                    </CardContent>

                    {/* Pagination */}
                    <div className="border-t px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total providers)
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
