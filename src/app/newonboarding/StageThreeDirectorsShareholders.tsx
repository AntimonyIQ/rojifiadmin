import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, User, FileText, Eye, AlertTriangle, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ISender, IDirectorAndShareholder, IResponse } from '@/interface/interface';
import Defaults from '@/defaults/defaults';
import React from 'react';
import { session, SessionData } from '@/session/session';
import { Status } from '@/enums/enums';
import { toast } from '@/hooks/use-toast';

interface StageThreeDirectorsShareholdersProps {
    selectedSender: ISender | null;
    viewDocument?: (document: any) => void;
}

export default function StageThreeDirectorsShareholders({
    selectedSender,
    viewDocument
}: StageThreeDirectorsShareholdersProps) {
    // Director-level loading state (director id) or null
    const [loadingDirectorId, setLoadingDirectorId] = React.useState<string | null>(null);
    // Report issue dialog state for directors
    const [reportDialogOpen, setReportDialogOpen] = React.useState(false);
    const [reportingDirectorId, setReportingDirectorId] = React.useState<string | null>(null);
    const [reportMessage, setReportMessage] = React.useState('');
    const [isReporting, setIsReporting] = React.useState(false);
    const sd: SessionData = session.getUserData();

    const openReportDialog = (directorId: string) => {
        setReportingDirectorId(directorId);
        setReportMessage('');
        setReportDialogOpen(true);
    }

    // Approve confirmation modal state
    const [approveDialogOpen, setApproveDialogOpen] = React.useState(false);
    const [approveTargetId, setApproveTargetId] = React.useState<string | null>(null);

    const openApproveDialog = (directorId: string) => {
        setApproveTargetId(directorId);
        setApproveDialogOpen(true);
    }

    const closeApproveDialog = () => {
        setApproveDialogOpen(false);
        setApproveTargetId(null);
    }

    const closeReportDialog = () => {
        setReportDialogOpen(false);
        setReportingDirectorId(null);
        setReportMessage('');
        setIsReporting(false);
    }

    const submitReport = async () => {
        if (!reportingDirectorId || !reportMessage.trim()) return;

        try {
            setIsReporting(true);
            Defaults.LOGIN_STATUS();

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/director/send/issue`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({
                    senderId: selectedSender?._id,
                    directorId: reportingDirectorId,
                    issueMessage: reportMessage.trim()
                })
            });
            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: 'Success',
                    description: 'Issue reported successfully',
                    duration: 5000,
                    variant: "default"
                });
                closeReportDialog();
            }
        } catch (e) {
            console.error(e);
            toast({
                title: 'Error',
                description: (e as Error).message || 'Failed to report issue',
                duration: 5000,
                variant: "destructive"
            });
        } finally {
            setIsReporting(false);
        }
    }

    const approveDirector = async (directorId: string) => {
        if (!directorId) return;

        try {
            setLoadingDirectorId(directorId);
            Defaults.LOGIN_STATUS();

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/director/approve`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({
                    senderId: selectedSender?._id,
                    directorId
                })
            });
            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: 'Success',
                    description: 'Director approved successfully',
                    duration: 5000,
                    variant: "default"
                });
            }
        } catch (e) {
            console.error(e);
            toast({
                title: 'Error',
                description: (e as Error).message || 'Failed to approve director',
                duration: 5000,
                variant: "destructive"
            });
        } finally {
            setLoadingDirectorId(null);
        }
    }

    const handleViewDocument = (document: any, person: IDirectorAndShareholder, docType: 'id' | 'address') => {
        if (viewDocument) {
            // Add additional context for the document viewer
            const docWithContext = {
                ...document,
                personName: `${person.firstName} ${person.lastName}`,
                documentType: docType === 'id' ? 'ID Document' : 'Proof of Address',
                personId: person._id
            };
            viewDocument(docWithContext);
        }
    };

    const handleSubmitToSmileId = async (person: IDirectorAndShareholder, docType: 'id' | 'address') => {
        try {
            const document = docType === 'id' ? person.idDocument : person.proofOfAddress;
            console.log(`Submitting ${docType} document to Smile ID for:`, person.firstName, person.lastName);
            console.log('Document details:', document);
            alert(`${person.firstName} ${person.lastName}'s ${docType === 'id' ? 'ID document' : 'proof of address'} submitted to Smile ID for verification.`);
        } catch (error) {
            console.error('Error sending to Smile ID:', error);
            alert('Failed to send to Smile ID. Please try again.');
        }
    };

    const handleReportIssue = (person: IDirectorAndShareholder, docType: 'id' | 'address') => {
        const document = docType === 'id' ? person.idDocument : person.proofOfAddress;
        console.log(`Reporting issue with ${docType} document for:`, person.firstName, person.lastName);
        console.log('Document details:', document);
        alert(`Issue reported for ${person.firstName} ${person.lastName}'s ${docType === 'id' ? 'ID document' : 'proof of address'}.`);
    };

    const getSmileIdBadgeVariant = (status: string) => {
        switch (status) {
            case 'verified': return 'default';
            case 'rejected': return 'destructive';
            case 'under_review': return 'secondary';
            default: return 'outline';
        }
    };

    const formatDate = (date: Date | string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Directors & Shareholders Management
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {selectedSender?.directors && selectedSender.directors.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-lg">
                                    Total: {selectedSender.directors.length} {selectedSender.directors.length === 1 ? 'Person' : 'People'}
                                </h4>
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    {selectedSender.directors.filter(p => p.idDocumentVerified && p.proofOfAddressVerified).length} Fully Verified
                                </Badge>
                            </div>

                            <Separator />

                            {selectedSender.directors.map((person: IDirectorAndShareholder, index: number) => (
                                <div key={person._id || index} className="space-y-4">
                                    <div className={`border rounded-lg p-6 ${(person as any).issueReported ? 'border-red-400 bg-red-50' : 'bg-gray-50/50'}`}>
                                        {/* Header with name and roles */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h5 className="text-lg font-semibold">
                                                        {person.firstName} {person.middleName && `${person.middleName} `}{person.lastName}
                                                    </h5>
                                                    <p className="text-sm text-gray-600 font-medium">{person.jobTitle}</p>
                                                    <p className="text-xs text-gray-500">{person.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {person.isDirector && (
                                                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                                                        Director
                                                    </Badge>
                                                )}
                                                {person.isShareholder && (
                                                    <Badge variant="default" className="bg-purple-100 text-purple-800">
                                                        Shareholder ({person.shareholderPercentage}%)
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Company Basic Information */}
                                        <div className="space-y-4">
                                            <h4 className="text-md font-semibold text-gray-900">Personal Information</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="firstName">First Name</Label>
                                                    <Input
                                                        id="firstName"
                                                        value={person.firstName || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter first name"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="middleName">Middle Name</Label>
                                                    <Input
                                                        id="middleName"
                                                        value={person.middleName || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter middle name"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="lastName">Last Name</Label>
                                                    <Input
                                                        id="lastName"
                                                        value={person.lastName || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter last name"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="jobTitle">Job Title</Label>
                                                    <Input
                                                        id="jobTitle"
                                                        value={person.jobTitle || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter job title"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="role">Role</Label>
                                                    <Input
                                                        id="role"
                                                        value={person.role || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter role"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="shareholderPercentage">Shareholder Percentage (in %)</Label>
                                                    <Input
                                                        id="shareholderPercentage"
                                                        value={person.shareholderPercentage || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter shareholder percentage"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                                    <Input
                                                        id="phoneNumber"
                                                        value={person.phoneNumber || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter phone number"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                                    <Input
                                                        id="dateOfBirth"
                                                        value={new Date(person.dateOfBirth).toDateString() || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter date of birth"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="nationality">Country of Birth</Label>
                                                    <Input
                                                        id="nationality"
                                                        value={person.nationality || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter country of birth"
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="idNumber">ID Number</Label>
                                                    <Input
                                                        id="idNumber"
                                                        value={person.idNumber || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter ID number"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="issuedCountry">ID issued Country</Label>
                                                    <Input
                                                        id="issuedCountry"
                                                        value={person.issuedCountry || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter ID issued Country"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="issueDate">ID Issue Date</Label>
                                                    <Input
                                                        id="issueDate"
                                                        value={new Date(person.issueDate).toDateString() || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter ID Issue Date"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="expiryDate">ID Expiry Date</Label>
                                                    <Input
                                                        id="expiryDate"
                                                        value={new Date(person.expiryDate).toDateString() || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter ID expiry date"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="streetAddress">Street Address</Label>
                                                    <Input
                                                        id="streetAddress"
                                                        value={person.streetAddress || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter street address"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="city">City</Label>
                                                    <Input
                                                        id="city"
                                                        value={person.city || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter city"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="postalCode">Postal Code</Label>
                                                    <Input
                                                        id="postalCode"
                                                        value={person.postalCode || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter postal code"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="state">State</Label>
                                                    <Input
                                                        id="state"
                                                        value={person.state || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter state"
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div className='pb-5'>
                                                    <Label htmlFor="country">Country</Label>
                                                    <Input
                                                        id="country"
                                                        value={person.country || ''}
                                                        onChange={(_e) => { }}
                                                        placeholder="Enter country"
                                                        disabled={true}
                                                    />
                                                </div>


                                            </div>
                                        </div>

                                        {/* Document Verification Section */}
                                        <div className="space-y-4">
                                            <h6 className="font-medium text-sm mb-3 flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Document Verification
                                            </h6>

                                            {/* ID Document */}
                                            <div className="bg-white rounded-lg p-4 border">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h6 className="font-medium text-sm">ID Document</h6>
                                                        <p className="text-xs text-gray-500">{person.idDocument?.name || 'No document uploaded'}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Badge variant={person.idDocumentVerified ? "default" : "secondary"}>
                                                            {person.idDocumentVerified ? 'Verified' : 'Pending'}
                                                        </Badge>
                                                        <Badge variant={getSmileIdBadgeVariant(person.idDocument?.smileIdStatus || 'not_submitted')}>
                                                            Smile ID: {person.idDocument?.smileIdStatus || 'Not Submitted'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {person.idDocument?.url && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewDocument(person.idDocument, person, 'id')}
                                                        >
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                    </div>
                                                )}
                                                {person.idDocument?.smileIdVerifiedAt && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Verified: {formatDate(person.idDocument.smileIdVerifiedAt)}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Proof of Address */}
                                            <div className="bg-white rounded-lg p-4 border">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h6 className="font-medium text-sm">Proof of Address</h6>
                                                        <p className="text-xs text-gray-500">{person.proofOfAddress?.name || 'No document uploaded'}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Badge variant={person.proofOfAddressVerified ? "default" : "secondary"}>
                                                            {person.proofOfAddressVerified ? 'Verified' : 'Pending'}
                                                        </Badge>
                                                        <Badge variant={getSmileIdBadgeVariant(person.proofOfAddress?.smileIdStatus || 'not_submitted')}>
                                                            Smile ID: {person.proofOfAddress?.smileIdStatus || 'Not Submitted'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {person.proofOfAddress?.url && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewDocument(person.proofOfAddress, person, 'address')}
                                                        >
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                    </div>
                                                )}
                                                {person.proofOfAddress?.smileIdVerifiedAt && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Verified: {formatDate(person.proofOfAddress.smileIdVerifiedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Director-level Actions */}
                                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={loadingDirectorId === person._id}
                                                onClick={() => openReportDialog(person._id)}
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                <AlertTriangle className="h-4 w-4 mr-1" />
                                                Report Issue
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                disabled={loadingDirectorId === person._id}
                                                onClick={() => openApproveDialog(person._id)}
                                                className="text-white bg-green-600 border-green-300 hover:bg-green-700"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                    </div>                                    {/* Add separator between directors except for the last one */}
                                    {index < selectedSender.directors.length - 1 && (
                                        <Separator className="my-6" />
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="h-10 w-10 text-gray-400" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-3 text-lg">No Directors & Shareholders Found</h4>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Directors and shareholders information has not been added to the system for this sender yet.
                            </p>
                            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg max-w-lg mx-auto">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-amber-900 mb-1">Action Required</p>
                                        <p className="text-sm text-amber-800">
                                            Request the sender to complete their Directors & Shareholders information before proceeding with the verification process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Report Issue Dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Report Director/Shareholder Issue</DialogTitle>
                        <DialogDescription>
                            Please describe the issue you found with this director/shareholder record.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="message">Issue Description</Label>
                            <Textarea
                                id="message"
                                placeholder="Describe the issue with this director/shareholder record..."
                                value={reportMessage}
                                onChange={(e) => setReportMessage(e.target.value)}
                                className="min-h-[100px]"
                                disabled={isReporting}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeReportDialog}
                            disabled={isReporting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={submitReport}
                            disabled={!reportMessage.trim() || isReporting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isReporting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"></path>
                                    </svg>
                                    Reporting...
                                </>
                            ) : (
                                'Report Issue'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Approve Confirmation Dialog */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Approve Director</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve this director/shareholder? This action will mark their documents as approved.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeApproveDialog} disabled={loadingDirectorId === approveTargetId}>Cancel</Button>
                        <Button
                            onClick={async () => {
                                if (!approveTargetId) return;
                                await approveDirector(approveTargetId);
                                closeApproveDialog();
                            }}
                            disabled={loadingDirectorId === approveTargetId}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {loadingDirectorId === approveTargetId ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Approving...
                                </>
                            ) : (
                                'Confirm Approve'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
