import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Eye, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { IResponse, ISender, ISenderDocument } from '@/interface/interface';
import Defaults from '@/defaults/defaults';
import { session, SessionData } from '@/session/session';
import { Status, WhichDocument } from '@/enums/enums';
import { toast } from '@/hooks/use-toast';

interface StageTwoDocumentReviewProps {
    selectedSender: ISender | null;
    viewDocument: (document: any) => void;
}

export default function StageTwoDocumentReview({
    selectedSender,
    viewDocument
}: StageTwoDocumentReviewProps) {
    // track which document is currently submitting to SmileID (document id) or null
    const [loadingDocId, setLoadingDocId] = React.useState<string | null>(null);
    // Report issue dialog state
    const [reportDialogOpen, setReportDialogOpen] = React.useState(false);
    const [reportingDocId, setReportingDocId] = React.useState<string | null>(null);
    const [reportMessage, setReportMessage] = React.useState('');
    const [isReporting, setIsReporting] = React.useState(false);
    const sd: SessionData = session.getUserData();

    const submitToSmileID = async (senderId: string, documentId: string) => {
        if (!senderId || !documentId) return;

        try {
            setLoadingDocId(documentId);
            Defaults.LOGIN_STATUS();

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/smileid/upload`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({ senderId, documentId })
            });
            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: 'Success',
                    description: 'Document submitted to Smile ID successfully',
                    duration: 5000,
                    variant: "default"
                });
                console.log('Document submitted to Smile ID', data);
            }
        } catch (e) {
            console.error(e);
            toast({
                title: 'Error',
                description: (e as Error).message || 'Failed to submit document to Smile ID',
                duration: 5000,
                variant: "destructive"
            });
        } finally {
            setLoadingDocId(null);
        }
    }

    const openReportDialog = (documentId: string) => {
        setReportingDocId(documentId);
        setReportMessage('');
        setReportDialogOpen(true);
    }

    const closeReportDialog = () => {
        setReportDialogOpen(false);
        setReportingDocId(null);
        setReportMessage('');
        setIsReporting(false);
    }

    const submitReport = async () => {
        if (!reportingDocId || !reportMessage.trim()) return;

        try {
            setIsReporting(true);
            Defaults.LOGIN_STATUS();

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/sender/document/issue`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({
                    senderId: selectedSender?._id,
                    documentId: reportingDocId,
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

    const approveDocument = async (documentId: string) => {
        if (!documentId) return;

        try {
            setLoadingDocId(documentId);
            Defaults.LOGIN_STATUS();

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/sender/document/approve`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({
                    senderId: selectedSender?._id,
                    documentId
                })
            });
            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: 'Success',
                    description: 'Document approved successfully',
                    duration: 5000,
                    variant: "default"
                });
            }
        } catch (e) {
            console.error(e);
            toast({
                title: 'Error',
                description: (e as Error).message || 'Failed to approve document',
                duration: 5000,
                variant: "destructive"
            });
        } finally {
            setLoadingDocId(null);
        }
    }

    // Approve confirmation modal state
    const [approveDialogOpen, setApproveDialogOpen] = React.useState(false);
    const [approveTargetId, setApproveTargetId] = React.useState<string | null>(null);

    const openApproveDialog = (documentId: string) => {
        setApproveTargetId(documentId);
        setApproveDialogOpen(true);
    }

    const closeApproveDialog = () => {
        setApproveDialogOpen(false);
        setApproveTargetId(null);
    }

    const documentTitle = (which: WhichDocument) => {
        switch (which) {
            case WhichDocument.CERTIFICATE_INCORPORATION:
                return 'CAC Certificate of Incorporation';
            case WhichDocument.MEMORANDUM_ARTICLES:
                return 'Memorandum and Articles of Association (MEMART)';
            case WhichDocument.INCORPORATION_STATUS:
                return 'CAC Status Report';
            case WhichDocument.PROOF_ADDRESS:
                return 'Business Proof of Address (Recent Utility Bill, Bank Statement, Etc...)';
            default:
                return 'Document';
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Document Review & Validation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedSender?.documents && selectedSender.documents.length > 0 ? (
                        selectedSender.documents.map((doc: ISenderDocument, index: number) => {
                            const smileStatus = doc.smileIdStatus; // 'verified' | 'rejected' | 'pending'
                            return (
                                <div key={index} className={`p-4 border rounded-lg space-y-3 bg-white ${doc.issue ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                                    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {documentTitle(doc.which)}
                                                </p>
                                                <p className="text-xs text-muted-foreground break-all max-w-xs">{doc.url}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <Badge variant={doc.kycVerified ? 'default' : 'secondary'} className="text-[10px] px-2 py-0.5">
                                                        {doc.kycVerified ? 'KYC Verified' : 'Pending KYC'}
                                                    </Badge>
                                                    {smileStatus && (
                                                        <Badge
                                                            variant={smileStatus === 'verified' ? 'default' : smileStatus === 'rejected' ? 'destructive' : 'secondary'}
                                                            className="text-[10px] px-2 py-0.5"
                                                        >
                                                            Smile ID: {smileStatus}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                            <Button variant="outline" size="sm" onClick={() => viewDocument(doc)}>
                                                <Eye className="h-4 w-4 mr-1" /> View
                                            </Button>

                                            {!doc.issue && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={smileStatus === 'verified' || loadingDocId === doc._id}
                                                    onClick={async () => await submitToSmileID(selectedSender?._id as string, doc._id)}
                                                    className={smileStatus === 'verified' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                                                >
                                                    {loadingDocId === doc._id ? (
                                                        <>
                                                            <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"></path>
                                                            </svg>
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="h-4 w-4 mr-1" /> {smileStatus === 'verified' ? 'Verified' : 'Submit to Kyc Provider'}
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                            {doc.kycVerified && (
                                                <>
                                                    {!doc.issue && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openReportDialog(doc._id)}
                                                            className="text-red-600 border-red-300 hover:bg-red-50"
                                                        >
                                                            <AlertTriangle className="h-4 w-4 mr-1" /> Report Issue
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                            {!doc.kycVerified && (
                                                <>
                                                    {!doc.issue && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            disabled={loadingDocId === doc._id}
                                                            onClick={() => openApproveDialog(doc._id)}
                                                            className="text-white bg-green-600 border-green-300 hover:bg-green-700"
                                                        >
                                                            {loadingDocId === doc._id ? (
                                                                <>
                                                                    <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"></path>
                                                                    </svg>
                                                                    Approving...
                                                                </>
                                                            ) : (
                                                                'Approve'
                                                            )}
                                                        </Button>
                                                    )}
                                                </>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">No documents uploaded yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Report Issue Dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Report Document Issue</DialogTitle>
                        <DialogDescription>
                            Please describe the issue you found with this document.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="message">Issue Description</Label>
                            <Textarea
                                id="message"
                                placeholder="Describe the issue with this document..."
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Document Approval</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve this document? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <p className="text-sm text-muted-foreground">This will mark the document as approved for the selected sender.</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeApproveDialog} disabled={loadingDocId !== null}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={async () => {
                                if (!approveTargetId) return;
                                await approveDocument(approveTargetId);
                                closeApproveDialog();
                            }}
                            disabled={loadingDocId !== null}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {loadingDocId ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Approving...
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
