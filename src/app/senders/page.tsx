import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPagination, IResponse, ISender } from "@/interface/interface";
import Defaults from "@/defaults/defaults";
import { session, SessionData } from "@/session/session";
import { Status, WhichDocument } from "@/enums/enums";

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
import { MoreHorizontal, Check, MessageSquare, X, Loader2, Eye, Edit, FileText, Send, Users, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
// ...existing code... (removed unused Button import)

export default function SendersPage() {
    const [value, setValue] = useState<string>("list");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedSender, setSelectedSender] = useState<ISender | null>(null);
    const [selectedAction, setSelectedAction] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [senders, setSenders] = useState<Array<ISender>>([]);
    const [search, _setSearch] = useState<string>("");
    const [pagination, setPagination] = useState<IPagination>({
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 10,
    });

    // 4-Stage Validation Modal States
    const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);
    const [currentStage, setCurrentStage] = useState<number>(1);
    const [validationLoading, setValidationLoading] = useState<boolean>(false);
    const [documentModalOpen, setDocumentModalOpen] = useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] = useState<{
        type: string;
        url: string;
        verified: boolean;
    } | null>(null);
    const [editableFormData, setEditableFormData] = useState<Partial<ISender>>({});

    const sd: SessionData = session.getUserData();

    useEffect(() => {
        fetchSenders();
    }, [pagination.page, pagination.limit, search]);

    const fetchSenders = async () => {
        try {
            setLoading(true)

            Defaults.LOGIN_STATUS();

            const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
            const url: string = `${Defaults.API_BASE_URL}/admin/sender/list?page=${pagination.page}&limit=${pagination.limit}${searchParam}`;

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

    // Sample directors and shareholders data for testing
    const sampleDirectorsAndShareholders = [
        {
            senderId: "sample123",
            firstName: "John",
            lastName: "Smith",
            middleName: "Michael",
            email: "john.smith@company.com",
            jobTitle: "Chief Executive Officer",
            role: "Director and Shareholder",
            isDirector: true,
            isShareholder: true,
            shareholderPercentage: 45,
            dateOfBirth: new Date("1980-05-15"),
            nationality: "United States",
            phoneCode: "1",
            phoneNumber: "5551234567",
            idType: "passport" as const,
            idNumber: "P123456789",
            issuedCountry: "United States",
            issueDate: new Date("2020-01-15"),
            expiryDate: new Date("2030-01-15"),
            streetAddress: "123 Business Ave",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "United States",
            idDocumentVerified: true,
            proofOfAddressVerified: true
        },
        {
            senderId: "sample123",
            firstName: "Sarah",
            lastName: "Johnson",
            middleName: "Elizabeth",
            email: "sarah.johnson@company.com",
            jobTitle: "Chief Financial Officer",
            role: "Director and Shareholder",
            isDirector: true,
            isShareholder: true,
            shareholderPercentage: 35,
            dateOfBirth: new Date("1985-08-22"),
            nationality: "United Kingdom",
            phoneCode: "44",
            phoneNumber: "7700123456",
            idType: "drivers_license" as const,
            idNumber: "DL987654321",
            issuedCountry: "United Kingdom",
            issueDate: new Date("2021-03-10"),
            expiryDate: new Date("2031-03-10"),
            streetAddress: "456 Finance Street",
            city: "London",
            state: "Greater London",
            postalCode: "SW1A 1AA",
            country: "United Kingdom",
            idDocumentVerified: false,
            proofOfAddressVerified: true
        }
    ];

    // Sample documents for testing
    const sampleDocuments = [
        {
            which: WhichDocument.MEMORANDUM_ARTICLES,
            name: "Memorandum and Articles of Association.pdf",
            type: "application/pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            size: 1024576,
            uploadedAt: new Date(),
            kycVerified: false,
            kycVerifiedAt: null,
            smileIdStatus: "pending" as const,
            smileIdVerifiedAt: null,
            smileIdJobId: null,
            smileIdUploadId: null,
            isRequired: true
        },
        {
            which: WhichDocument.CERTIFICATE_INCORPORATION,
            name: "Certificate of Incorporation.pdf",
            type: "application/pdf",
            url: "https://file-examples.com/storage/fe86dd34ee608e883312ec6/2017/10/file_example_JPG_100kB.jpg",
            size: 2048576,
            uploadedAt: new Date(),
            kycVerified: true,
            kycVerifiedAt: new Date(),
            smileIdStatus: "verified" as const,
            smileIdVerifiedAt: new Date(),
            smileIdJobId: "job_123",
            smileIdUploadId: "upload_456",
            isRequired: true
        },
        {
            which: WhichDocument.INCORPORATION_STATUS,
            name: "Incorporation Status Report.docx",
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            url: "https://calibre-ebook.com/downloads/demos/demo.docx",
            size: 512000,
            uploadedAt: new Date(),
            kycVerified: true,
            kycVerifiedAt: new Date(),
            smileIdStatus: "failed" as const,
            smileIdVerifiedAt: null,
            smileIdJobId: "job_789",
            smileIdUploadId: "upload_101",
            isRequired: true
        },
        {
            which: WhichDocument.PROOF_ADDRESS,
            name: "Proof of Address.pdf",
            type: "application/pdf",
            url: "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf",
            size: 768000,
            uploadedAt: new Date(),
            kycVerified: false,
            kycVerifiedAt: null,
            smileIdStatus: "verified" as const,
            smileIdVerifiedAt: new Date(),
            smileIdJobId: "job_112",
            smileIdUploadId: "upload_113",
            isRequired: true
        }
    ];

    // Helper function to open validation modal
    const openValidationModal = (sender: ISender) => {
        // Add sample directors and shareholders and documents for demonstration
        const senderWithSampleData = {
            ...sender,
            directorsAndShareholders: sender.directorsAndShareholders?.length
                ? sender.directorsAndShareholders
                : sampleDirectorsAndShareholders,
            // Add sample documents if none exist
            documents: sender.documents?.length
                ? sender.documents
                : sampleDocuments
        };
        setSelectedSender(senderWithSampleData);
        setEditableFormData(senderWithSampleData);
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
    const viewDocument = (document: any) => {
        setSelectedDocument({
            type: document.name,
            url: document.url,
            verified: document.kycVerified
        });
        setDocumentModalOpen(true);
    };

    // Helper function to get document by type
    // const getDocumentByType = (documents: any[], documentType: WhichDocument) => {
    //     return documents?.find(doc => doc.which === documentType);
    // };

    // Helper function to handle form input changes
    const handleFormInputChange = (field: keyof ISender, value: any) => {
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

    return (
        <div className="space-y-6 p-4">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Senders</h1>
                <p className="text-sm text-muted-foreground">Manage senders and their onboarding status</p>
            </header>

            <div className="bg-card p-4 rounded-md">
                <Tabs value={value} onValueChange={(v) => setValue(v)}>
                    <TabsList>
                        <TabsTrigger value="list">All Senders</TabsTrigger>
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium">Senders</h2>
                                <div>
                                    <Button variant="outline" className="btn btn-sm">New Sender</Button>
                                </div>
                            </div>

                            <div className="mt-4 overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sender ID</TableHead>
                                            <TableHead>Business</TableHead>
                                            <TableHead>Country</TableHead>
                                            <TableHead>Volume</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-6 text-sm text-muted-foreground">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                                        <span>Loading senders...</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {!loading && senders.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-6 text-sm text-muted-foreground">No senders found.</TableCell>
                                            </TableRow>
                                        )}

                                        {!loading && senders.map((s: ISender, idx: number) => (
                                            <TableRow key={s._id || idx}>
                                                <TableCell>{s._id || "-"}</TableCell>
                                                <TableCell>{s.businessName || "-"}</TableCell>
                                                <TableCell>{s.country || "-"}</TableCell>
                                                <TableCell>{s.volume?.toLocaleString() || "-"}</TableCell>
                                                <TableCell>
                                                    <Badge variant={s.affiliationStatus === 'live' ? 'success' : s.affiliationStatus === 'pending' ? 'warning' : 'outline'} className="capitalize">
                                                        {s.affiliationStatus}
                                                    </Badge>
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
                                                                    <Check className="mr-2" size={14} /> Approve
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => { setSelectedSender(s); setSelectedAction('request_info'); setIsDialogOpen(true); }}>
                                                                    <MessageSquare className="mr-2" size={14} /> Request Info
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => { setSelectedSender(s); setSelectedAction('reject'); setIsDialogOpen(true); }}>
                                                                    <X className="mr-2" size={14} /> Reject
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

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
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Sender Validation - {selectedSender?.businessName}
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
                                            <div className="space-y-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <Edit className="h-4 w-4" />
                                                            Form Input Validation
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-6">
                                                        {/* Company Basic Information */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-md font-semibold text-gray-900">Company Information</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label htmlFor="businessName">Business Name</Label>
                                                                    <Input
                                                                        id="businessName"
                                                                        value={editableFormData.businessName || ''}
                                                                        onChange={(e) => handleFormInputChange('businessName', e.target.value)}
                                                                        placeholder="Enter business name"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="name">Company Name</Label>
                                                                    <Input
                                                                        id="name"
                                                                        value={editableFormData.name || ''}
                                                                        onChange={(e) => handleFormInputChange('name', e.target.value)}
                                                                        placeholder="Enter company name"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="tradingName">Trading Name</Label>
                                                                    <Input
                                                                        id="tradingName"
                                                                        value={editableFormData.tradingName || ''}
                                                                        onChange={(e) => handleFormInputChange('tradingName', e.target.value)}
                                                                        placeholder="Enter trading name"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="businessRegistrationNumber">Registration Number</Label>
                                                                    <Input
                                                                        id="businessRegistrationNumber"
                                                                        value={editableFormData.businessRegistrationNumber || ''}
                                                                        onChange={(e) => handleFormInputChange('businessRegistrationNumber', e.target.value)}
                                                                        placeholder="Enter registration number"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="website">Website</Label>
                                                                    <Input
                                                                        id="website"
                                                                        value={editableFormData.website || ''}
                                                                        onChange={(e) => handleFormInputChange('website', e.target.value)}
                                                                        placeholder="Enter website URL"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="legalForm">Legal Form</Label>
                                                                    <Select
                                                                        value={editableFormData.legalForm || ''}
                                                                        onValueChange={(value) => handleFormInputChange('legalForm', value)}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select legal form" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="SARL">SARL (Limited Liability Company)</SelectItem>
                                                                            <SelectItem value="SA">SA (Public Limited Company)</SelectItem>
                                                                            <SelectItem value="SAS">SAS (Simplified Joint Stock Company)</SelectItem>
                                                                            <SelectItem value="LLC">LLC (Limited Liability Company)</SelectItem>
                                                                            <SelectItem value="Corporation">Corporation</SelectItem>
                                                                            <SelectItem value="Partnership">Partnership</SelectItem>
                                                                            <SelectItem value="LTD">LTD (Private Limited Company)</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="companyActivity">Company Activity</Label>
                                                                    <Select
                                                                        value={editableFormData.companyActivity || ''}
                                                                        onValueChange={(value) => handleFormInputChange('companyActivity', value)}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select company activity" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="agriculture_forestry_and_fishing">Agriculture, Forestry and Fishing</SelectItem>
                                                                            <SelectItem value="mining_and_quarrying">Mining and Quarrying</SelectItem>
                                                                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                                                            <SelectItem value="financial_insurance">Financial and Insurance Activities</SelectItem>
                                                                            <SelectItem value="information_communication">Information and Communication</SelectItem>
                                                                            <SelectItem value="professional_scientific">Professional, Scientific and Technical Activities</SelectItem>
                                                                            <SelectItem value="wholesale_retail_trade">Wholesale and Retail Trade</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="country">Country</Label>
                                                                    <Select
                                                                        value={editableFormData.country || ''}
                                                                        onValueChange={(value) => handleFormInputChange('country', value)}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select country" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Nigeria">Nigeria</SelectItem>
                                                                            <SelectItem value="Kenya">Kenya</SelectItem>
                                                                            <SelectItem value="Ghana">Ghana</SelectItem>
                                                                            <SelectItem value="South Africa">South Africa</SelectItem>
                                                                            <SelectItem value="France">France</SelectItem>
                                                                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                                            <SelectItem value="United States">United States</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Contact Information */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-md font-semibold text-gray-900">Contact Information</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label htmlFor="email">Email</Label>
                                                                    <Input
                                                                        id="email"
                                                                        type="email"
                                                                        value={editableFormData.email || ''}
                                                                        onChange={(e) => handleFormInputChange('email', e.target.value)}
                                                                        placeholder="Enter email"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                                                    <Input
                                                                        id="phoneNumber"
                                                                        value={editableFormData.phoneNumber || ''}
                                                                        onChange={(e) => handleFormInputChange('phoneNumber', e.target.value)}
                                                                        placeholder="Enter phone number"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="volume">Volume</Label>
                                                                    <Input
                                                                        id="volume"
                                                                        type="number"
                                                                        value={editableFormData.volume || ''}
                                                                        onChange={(e) => handleFormInputChange('volume', parseInt(e.target.value))}
                                                                        placeholder="Enter volume"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Address Information */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-md font-semibold text-gray-900">Address Information</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="md:col-span-2">
                                                                    <Label htmlFor="streetAddress">Street Address</Label>
                                                                    <Input
                                                                        id="streetAddress"
                                                                        value={editableFormData.streetAddress || ''}
                                                                        onChange={(e) => handleFormInputChange('streetAddress', e.target.value)}
                                                                        placeholder="Enter street address"
                                                                    />
                                                                </div>
                                                                <div className="md:col-span-2">
                                                                    <Label htmlFor="streetAddress2">Street Address 2 (Optional)</Label>
                                                                    <Input
                                                                        id="streetAddress2"
                                                                        value={editableFormData.streetAddress2 || ''}
                                                                        onChange={(e) => handleFormInputChange('streetAddress2', e.target.value)}
                                                                        placeholder="Apartment, suite, unit, etc."
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="city">City</Label>
                                                                    <Input
                                                                        id="city"
                                                                        value={editableFormData.city || ''}
                                                                        onChange={(e) => handleFormInputChange('city', e.target.value)}
                                                                        placeholder="Enter city"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="state">State/Province</Label>
                                                                    <Input
                                                                        id="state"
                                                                        value={editableFormData.state || ''}
                                                                        onChange={(e) => handleFormInputChange('state', e.target.value)}
                                                                        placeholder="Enter state"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="region">Region</Label>
                                                                    <Input
                                                                        id="region"
                                                                        value={editableFormData.region || ''}
                                                                        onChange={(e) => handleFormInputChange('region', e.target.value)}
                                                                        placeholder="Enter region"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="postalCode">Postal Code</Label>
                                                                    <Input
                                                                        id="postalCode"
                                                                        value={editableFormData.postalCode || ''}
                                                                        onChange={(e) => handleFormInputChange('postalCode', e.target.value)}
                                                                        placeholder="Enter postal code"
                                                                    />
                                                                </div>
                                                                <div className="md:col-span-2">
                                                                    <Label htmlFor="businessAddress">Business Address (Legacy)</Label>
                                                                    <Textarea
                                                                        id="businessAddress"
                                                                        value={editableFormData.businessAddress || ''}
                                                                        onChange={(e) => handleFormInputChange('businessAddress', e.target.value)}
                                                                        placeholder="Enter full business address"
                                                                        rows={3}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Financial Information */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-md font-semibold text-gray-900">Financial Information</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label htmlFor="shareCapital">Share Capital</Label>
                                                                    <Input
                                                                        id="shareCapital"
                                                                        type="number"
                                                                        value={editableFormData.shareCapital || ''}
                                                                        onChange={(e) => handleFormInputChange('shareCapital', parseInt(e.target.value))}
                                                                        placeholder="Enter share capital"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="lastYearTurnover">Last Year Turnover</Label>
                                                                    <Input
                                                                        id="lastYearTurnover"
                                                                        type="number"
                                                                        value={editableFormData.lastYearTurnover || ''}
                                                                        onChange={(e) => handleFormInputChange('lastYearTurnover', parseInt(e.target.value))}
                                                                        placeholder="Enter last year turnover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="companyAssets">Company Assets</Label>
                                                                    <Input
                                                                        id="companyAssets"
                                                                        type="number"
                                                                        value={editableFormData.companyAssets || ''}
                                                                        onChange={(e) => handleFormInputChange('companyAssets', parseInt(e.target.value))}
                                                                        placeholder="Enter company assets"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="expectedMonthlyInboundCryptoPayments">Monthly Inbound Crypto</Label>
                                                                    <Input
                                                                        id="expectedMonthlyInboundCryptoPayments"
                                                                        type="number"
                                                                        value={editableFormData.expectedMonthlyInboundCryptoPayments || ''}
                                                                        onChange={(e) => handleFormInputChange('expectedMonthlyInboundCryptoPayments', parseInt(e.target.value))}
                                                                        placeholder="Expected monthly inbound crypto"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="expectedMonthlyOutboundCryptoPayments">Monthly Outbound Crypto</Label>
                                                                    <Input
                                                                        id="expectedMonthlyOutboundCryptoPayments"
                                                                        type="number"
                                                                        value={editableFormData.expectedMonthlyOutboundCryptoPayments || ''}
                                                                        onChange={(e) => handleFormInputChange('expectedMonthlyOutboundCryptoPayments', parseInt(e.target.value))}
                                                                        placeholder="Expected monthly outbound crypto"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="expectedMonthlyInboundFiatPayments">Monthly Inbound Fiat</Label>
                                                                    <Input
                                                                        id="expectedMonthlyInboundFiatPayments"
                                                                        type="number"
                                                                        value={editableFormData.expectedMonthlyInboundFiatPayments || ''}
                                                                        onChange={(e) => handleFormInputChange('expectedMonthlyInboundFiatPayments', parseInt(e.target.value))}
                                                                        placeholder="Expected monthly inbound fiat"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="expectedMonthlyOutboundFiatPayments">Monthly Outbound Fiat</Label>
                                                                    <Input
                                                                        id="expectedMonthlyOutboundFiatPayments"
                                                                        type="number"
                                                                        value={editableFormData.expectedMonthlyOutboundFiatPayments || ''}
                                                                        onChange={(e) => handleFormInputChange('expectedMonthlyOutboundFiatPayments', parseInt(e.target.value))}
                                                                        placeholder="Expected monthly outbound fiat"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Risk and Compliance */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-md font-semibold text-gray-900">Risk and Compliance</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label htmlFor="riskLevel">Risk Level</Label>
                                                                    <Select
                                                                        value={editableFormData.riskLevel || ''}
                                                                        onValueChange={(value) => handleFormInputChange('riskLevel', value)}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select risk level" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="low_risk">Low Risk</SelectItem>
                                                                            <SelectItem value="medium_risk">Medium Risk</SelectItem>
                                                                            <SelectItem value="high_risk">High Risk</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="md:col-span-2">
                                                                    <Label htmlFor="additionalDueDiligenceConducted">Additional Due Diligence</Label>
                                                                    <Textarea
                                                                        id="additionalDueDiligenceConducted"
                                                                        value={editableFormData.additionalDueDiligenceConducted || ''}
                                                                        onChange={(e) => handleFormInputChange('additionalDueDiligenceConducted', e.target.value)}
                                                                        placeholder="Describe any additional due diligence conducted"
                                                                        rows={3}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Compliance Flags */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-md font-semibold text-gray-900">Compliance Flags</h4>
                                                            <div className="space-y-3">
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="actualOperationsAndRegisteredAddressesMatch"
                                                                        checked={editableFormData.actualOperationsAndRegisteredAddressesMatch || false}
                                                                        onChange={(e) => handleFormInputChange('actualOperationsAndRegisteredAddressesMatch', e.target.checked)}
                                                                        className="rounded border-gray-300"
                                                                    />
                                                                    <Label htmlFor="actualOperationsAndRegisteredAddressesMatch">
                                                                        Actual operations and registered addresses match
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="companyProvideRegulatedFinancialServices"
                                                                        checked={editableFormData.companyProvideRegulatedFinancialServices || false}
                                                                        onChange={(e) => handleFormInputChange('companyProvideRegulatedFinancialServices', e.target.checked)}
                                                                        className="rounded border-gray-300"
                                                                    />
                                                                    <Label htmlFor="companyProvideRegulatedFinancialServices">
                                                                        Company provides regulated financial services
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="directorOrBeneficialOwnerIsPEPOrUSPerson"
                                                                        checked={editableFormData.directorOrBeneficialOwnerIsPEPOrUSPerson || false}
                                                                        onChange={(e) => handleFormInputChange('directorOrBeneficialOwnerIsPEPOrUSPerson', e.target.checked)}
                                                                        className="rounded border-gray-300"
                                                                    />
                                                                    <Label htmlFor="directorOrBeneficialOwnerIsPEPOrUSPerson">
                                                                        Director or beneficial owner is PEP or US person
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="immediateApprove"
                                                                        checked={editableFormData.immediateApprove || false}
                                                                        onChange={(e) => handleFormInputChange('immediateApprove', e.target.checked)}
                                                                        className="rounded border-gray-300"
                                                                    />
                                                                    <Label htmlFor="immediateApprove">
                                                                        Immediate approval
                                                                    </Label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        )}

                                        {/* Stage 2: Document Review */}
                                        {currentStage === 2 && (
                                            <div className="space-y-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4" />
                                                            Document Review & Validation
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        {selectedSender?.documents?.map((doc, index) => (
                                                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <FileText className="h-5 w-5 text-gray-500" />
                                                                    <div>
                                                                        <p className="font-medium">{doc.name}</p>
                                                                        <p className="text-sm text-gray-500">{doc.which?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <Badge variant={doc.kycVerified ? "default" : "secondary"}>
                                                                                {doc.kycVerified ? 'Verified' : 'Pending'}
                                                                            </Badge>
                                                                            <Badge
                                                                                variant={
                                                                                    doc.smileIdStatus === 'verified' ? "default" :
                                                                                        doc.smileIdStatus === 'failed' ? "destructive" :
                                                                                            "secondary"
                                                                                }
                                                                            >
                                                                                Smile ID: {doc.smileIdStatus}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => viewDocument(doc)}
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-1" />
                                                                        View
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled={doc.smileIdStatus === 'verified'}
                                                                        onClick={async () => {
                                                                            if (!selectedSender) return;

                                                                            try {
                                                                                // TODO: Call API to send document to Smile ID
                                                                                console.log('Sending to Smile ID:', {
                                                                                    senderId: selectedSender._id,
                                                                                    documentType: doc.which,
                                                                                    documentUrl: doc.url
                                                                                });

                                                                                // Show success message
                                                                                alert(`${doc.name} has been sent to Smile ID for verification.`);

                                                                                // TODO: Refresh sender data or update local state
                                                                            } catch (error) {
                                                                                console.error('Error sending to Smile ID:', error);
                                                                                alert('Failed to send document to Smile ID. Please try again.');
                                                                            }
                                                                        }}
                                                                        className={doc.smileIdStatus === 'verified' ?
                                                                            "bg-green-600 hover:bg-green-700 text-white" :
                                                                            "bg-blue-600 hover:bg-blue-700 text-white"
                                                                        }
                                                                    >
                                                                        <Send className="h-4 w-4 mr-1" />
                                                                        {doc.smileIdStatus === 'verified' ? 'Verified by Smile ID' : 'Send to Smile ID'}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )) || (
                                                                <div className="text-center py-8 text-gray-500">
                                                                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                                    <p>No documents uploaded yet</p>
                                                                </div>
                                                            )}
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        )}

                                        {/* Stage 3: Directors & Shareholders */}
                                        {currentStage === 3 && (
                                            <div className="space-y-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            Directors & Shareholders Management
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        {selectedSender?.directorsAndShareholders && selectedSender.directorsAndShareholders.length > 0 ? (
                                                            <>
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <h4 className="font-medium">
                                                                        Directors & Shareholders ({selectedSender.directorsAndShareholders.length})
                                                                    </h4>
                                                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                                                        {selectedSender.directorsAndShareholders.length} Added
                                                                    </Badge>
                                                                </div>

                                                                {selectedSender.directorsAndShareholders.map((person, index) => (
                                                                    <div key={index} className="border rounded-lg p-4 space-y-3">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                                    <User className="h-5 w-5 text-blue-600" />
                                                                                </div>
                                                                                <div>
                                                                                    <h5 className="font-medium">
                                                                                        {person.firstName} {person.middleName ? person.middleName + ' ' : ''}{person.lastName}
                                                                                    </h5>
                                                                                    <p className="text-sm text-gray-600">{person.jobTitle}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                {person.isDirector && (
                                                                                    <Badge variant="outline" className="text-xs">Director</Badge>
                                                                                )}
                                                                                {person.isShareholder && (
                                                                                    <Badge variant="outline" className="text-xs">
                                                                                        Shareholder ({person.shareholderPercentage}%)
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                                            <div>
                                                                                <strong>Email:</strong> {person.email}
                                                                            </div>
                                                                            <div>
                                                                                <strong>Phone:</strong> +{person.phoneCode} {person.phoneNumber}
                                                                            </div>
                                                                            <div>
                                                                                <strong>Nationality:</strong> {person.nationality}
                                                                            </div>
                                                                            <div>
                                                                                <strong>ID Type:</strong> {person.idType === 'passport' ? 'Passport' : 'Driver\'s License'}
                                                                            </div>
                                                                            <div>
                                                                                <strong>ID Number:</strong> {person.idNumber}
                                                                            </div>
                                                                            <div>
                                                                                <strong>Country:</strong> {person.country}
                                                                            </div>
                                                                        </div>

                                                                        {/* Document Verification Status */}
                                                                        <div className="border-t pt-3 mt-3">
                                                                            <h6 className="font-medium mb-2 text-sm">Document Verification</h6>
                                                                            <div className="flex items-center gap-4 text-sm">
                                                                                <div className="flex items-center gap-2">
                                                                                    <FileText className="h-4 w-4 text-gray-500" />
                                                                                    <span>ID Document:</span>
                                                                                    <Badge variant={person.idDocumentVerified ? "default" : "secondary"}>
                                                                                        {person.idDocumentVerified ? 'Verified' : 'Pending'}
                                                                                    </Badge>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                                                    <span>Proof of Address:</span>
                                                                                    <Badge variant={person.proofOfAddressVerified ? "default" : "secondary"}>
                                                                                        {person.proofOfAddressVerified ? 'Verified' : 'Pending'}
                                                                                    </Badge>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Action Buttons */}
                                                                        <div className="flex items-center gap-2 pt-2 border-t">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    // TODO: View ID document
                                                                                    console.log('Viewing ID document for:', person.firstName, person.lastName);
                                                                                }}
                                                                            >
                                                                                <Eye className="h-4 w-4 mr-1" />
                                                                                View ID
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    // TODO: View proof of address
                                                                                    console.log('Viewing proof of address for:', person.firstName, person.lastName);
                                                                                }}
                                                                            >
                                                                                <MapPin className="h-4 w-4 mr-1" />
                                                                                View Address
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                disabled={person.idDocumentVerified}
                                                                                onClick={async () => {
                                                                                    try {
                                                                                        // TODO: Send to Smile ID for verification
                                                                                        console.log('Sending to Smile ID for verification:', person);
                                                                                        alert(`${person.firstName} ${person.lastName}'s documents sent to Smile ID for verification.`);
                                                                                    } catch (error) {
                                                                                        console.error('Error sending to Smile ID:', error);
                                                                                        alert('Failed to send to Smile ID. Please try again.');
                                                                                    }
                                                                                }}
                                                                                className={person.idDocumentVerified ?
                                                                                    "bg-green-600 hover:bg-green-700 text-white" :
                                                                                    "bg-blue-600 hover:bg-blue-700 text-white"
                                                                                }
                                                                            >
                                                                                <Send className="h-4 w-4 mr-1" />
                                                                                {person.idDocumentVerified ? 'Verified by Smile ID' : 'Send to Smile ID'}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <div className="text-center py-8">
                                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                    <Users className="h-8 w-8 text-gray-400" />
                                                                </div>
                                                                <h4 className="font-medium text-gray-900 mb-2">No Directors & Shareholders Found</h4>
                                                                <p className="text-sm text-gray-600 mb-4">
                                                                    Directors and shareholders have not been added to the system for this sender.
                                                                </p>
                                                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                                                                    <p className="text-sm text-amber-800">
                                                                        <strong>Action Required:</strong> Request the sender to complete their Directors & Shareholders information before proceeding with the verification process.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        )}

                                        {/* Stage 4: Final Review */}
                                        {currentStage === 4 && (
                                            <div className="space-y-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <Send className="h-4 w-4" />
                                                            Final Review & Submit to Bank
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-6">
                                                        {/* Company Information Summary */}
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <h4 className="font-medium mb-3">Company Information</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                                <div><strong>Business Name:</strong> {editableFormData.businessName || 'N/A'}</div>
                                                                <div><strong>Company Name:</strong> {editableFormData.name || 'N/A'}</div>
                                                                <div><strong>Trading Name:</strong> {editableFormData.tradingName || 'N/A'}</div>
                                                                <div><strong>Registration #:</strong> {editableFormData.businessRegistrationNumber || 'N/A'}</div>
                                                                <div><strong>Website:</strong> {editableFormData.website || 'N/A'}</div>
                                                                <div><strong>Legal Form:</strong> {editableFormData.legalForm || 'N/A'}</div>
                                                                <div><strong>Company Activity:</strong> {editableFormData.companyActivity || 'N/A'}</div>
                                                                <div><strong>Country:</strong> {editableFormData.country || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Contact Information Summary */}
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <h4 className="font-medium mb-3">Contact Information</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                                <div><strong>Email:</strong> {editableFormData.email || 'N/A'}</div>
                                                                <div><strong>Phone:</strong> {editableFormData.phoneNumber || 'N/A'}</div>
                                                                <div><strong>Volume:</strong> {editableFormData.volume?.toLocaleString() || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Address Information Summary */}
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <h4 className="font-medium mb-3">Address Information</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                                <div><strong>Street Address:</strong> {editableFormData.streetAddress || 'N/A'}</div>
                                                                <div><strong>Street Address 2:</strong> {editableFormData.streetAddress2 || 'N/A'}</div>
                                                                <div><strong>City:</strong> {editableFormData.city || 'N/A'}</div>
                                                                <div><strong>State:</strong> {editableFormData.state || 'N/A'}</div>
                                                                <div><strong>Region:</strong> {editableFormData.region || 'N/A'}</div>
                                                                <div><strong>Postal Code:</strong> {editableFormData.postalCode || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Financial Information Summary */}
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <h4 className="font-medium mb-3">Financial Information</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                                <div><strong>Share Capital:</strong> {editableFormData.shareCapital?.toLocaleString() || 'N/A'}</div>
                                                                <div><strong>Last Year Turnover:</strong> {editableFormData.lastYearTurnover?.toLocaleString() || 'N/A'}</div>
                                                                <div><strong>Company Assets:</strong> {editableFormData.companyAssets?.toLocaleString() || 'N/A'}</div>
                                                                <div><strong>Monthly Inbound Crypto:</strong> {editableFormData.expectedMonthlyInboundCryptoPayments?.toLocaleString() || 'N/A'}</div>
                                                                <div><strong>Monthly Outbound Crypto:</strong> {editableFormData.expectedMonthlyOutboundCryptoPayments?.toLocaleString() || 'N/A'}</div>
                                                                <div><strong>Monthly Inbound Fiat:</strong> {editableFormData.expectedMonthlyInboundFiatPayments?.toLocaleString() || 'N/A'}</div>
                                                                <div><strong>Monthly Outbound Fiat:</strong> {editableFormData.expectedMonthlyOutboundFiatPayments?.toLocaleString() || 'N/A'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Risk and Compliance Summary */}
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <h4 className="font-medium mb-3">Risk and Compliance</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div><strong>Risk Level:</strong> {editableFormData.riskLevel || 'N/A'}</div>
                                                                <div><strong>Additional Due Diligence:</strong> {editableFormData.additionalDueDiligenceConducted || 'N/A'}</div>
                                                                <div className="pt-2">
                                                                    <strong>Compliance Flags:</strong>
                                                                    <ul className="list-disc list-inside ml-4 mt-1">
                                                                        <li className={editableFormData.actualOperationsAndRegisteredAddressesMatch ? "text-green-600" : "text-red-600"}>
                                                                            Operations and addresses match: {editableFormData.actualOperationsAndRegisteredAddressesMatch ? "Yes" : "No"}
                                                                        </li>
                                                                        <li className={editableFormData.companyProvideRegulatedFinancialServices ? "text-orange-600" : "text-green-600"}>
                                                                            Regulated financial services: {editableFormData.companyProvideRegulatedFinancialServices ? "Yes" : "No"}
                                                                        </li>
                                                                        <li className={editableFormData.directorOrBeneficialOwnerIsPEPOrUSPerson ? "text-orange-600" : "text-green-600"}>
                                                                            PEP or US person: {editableFormData.directorOrBeneficialOwnerIsPEPOrUSPerson ? "Yes" : "No"}
                                                                        </li>
                                                                        <li className={editableFormData.immediateApprove ? "text-green-600" : "text-gray-600"}>
                                                                            Immediate approval: {editableFormData.immediateApprove ? "Yes" : "No"}
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Multi-select Arrays Summary */}
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <h4 className="font-medium mb-3">Services and Sources</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div>
                                                                    <strong>Requested Bank Services:</strong>
                                                                    <span className="ml-2">{editableFormData.requestedNilosServices?.join(', ') || 'None specified'}</span>
                                                                </div>
                                                                <div>
                                                                    <strong>Source of Wealth:</strong>
                                                                    <span className="ml-2">{editableFormData.sourceOfWealth?.join(', ') || 'None specified'}</span>
                                                                </div>
                                                                <div>
                                                                    <strong>Anticipated Source of Funds:</strong>
                                                                    <span className="ml-2">{editableFormData.anticipatedSourceOfFundsOnNilos?.join(', ') || 'None specified'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Document Verification Status */}
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <h4 className="font-medium mb-3">Document Verification Status</h4>
                                                            <div className="space-y-2 text-sm">
                                                                {selectedSender?.documents?.map((doc, index) => (
                                                                    <div key={index} className="flex justify-between items-center">
                                                                        <span>{doc.which?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge variant={doc.kycVerified ? "default" : "secondary"}>
                                                                                {doc.kycVerified ? 'Verified' : 'Pending'}
                                                                            </Badge>
                                                                            <Badge
                                                                                variant={
                                                                                    doc.smileIdStatus === 'verified' ? "default" :
                                                                                        doc.smileIdStatus === 'failed' ? "destructive" :
                                                                                            "secondary"
                                                                                }
                                                                                className="text-xs"
                                                                            >
                                                                                Smile ID: {doc.smileIdStatus}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                )) || (
                                                                        <div className="text-center py-4 text-gray-500">
                                                                            <p>No documents uploaded yet</p>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>

                                                        {/* Directors & Shareholders Summary */}
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <h4 className="font-medium mb-3">Directors & Shareholders</h4>
                                                            {selectedSender?.directorsAndShareholders && selectedSender.directorsAndShareholders.length > 0 ? (
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <span><strong>Total Added:</strong></span>
                                                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                                                            {selectedSender.directorsAndShareholders.length} People
                                                                        </Badge>
                                                                    </div>
                                                                    {selectedSender.directorsAndShareholders.map((person, index) => (
                                                                        <div key={index} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                                                                            <div>
                                                                                <span className="font-medium">
                                                                                    {person.firstName} {person.lastName}
                                                                                </span>
                                                                                <span className="text-gray-600 ml-2">
                                                                                    ({person.jobTitle})
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex gap-1">
                                                                                {person.isDirector && (
                                                                                    <Badge variant="outline" className="text-xs">Director</Badge>
                                                                                )}
                                                                                {person.isShareholder && (
                                                                                    <Badge variant="outline" className="text-xs">
                                                                                        {person.shareholderPercentage}% Share
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <div className="pt-2 text-xs text-gray-600">
                                                                        <div className="flex justify-between">
                                                                            <span>Documents Verified:</span>
                                                                            <span>
                                                                                {selectedSender.directorsAndShareholders.filter(p => p.idDocumentVerified && p.proofOfAddressVerified).length} / {selectedSender.directorsAndShareholders.length}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
                                                                    <strong>⚠️ Warning:</strong> No Directors & Shareholders have been added to the system.
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                                                            <p className="text-sm text-amber-800">
                                                                <strong>Note:</strong> By submitting to Bank, this sender will be processed for final approval.
                                                                Make sure all information is accurate and all documents are properly verified.
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
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
                                            <div className="flex items-center gap-2">
                                                <Badge variant={selectedDocument?.verified ? "default" : "secondary"}>
                                                    {selectedDocument?.verified ? 'Verified' : 'Pending'}
                                                </Badge>
                                                {selectedDocument?.url && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(selectedDocument.url, '_blank')}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Open Original
                                                    </Button>
                                                )}
                                            </div>
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="flex-1 min-h-[70vh] bg-gray-100 rounded-lg flex items-center justify-center">
                                        {selectedDocument?.url ? (
                                            <iframe
                                                src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedDocument.url)}&embedded=true`}
                                                className="w-full h-[70vh] border-0 rounded"
                                                title="Document Viewer"
                                                onError={(e) => {
                                                    console.error('Document viewer error:', e);
                                                    // Fallback: show direct link if Google Viewer fails
                                                }}
                                            />
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
                                                If the document doesn't load properly, click "Open Original" to view it directly.
                                                Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, and image files.
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