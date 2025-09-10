import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Send, AlertTriangle } from 'lucide-react';
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
                                <div key={index} className="p-4 border rounded-lg space-y-3 bg-white">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                                                        <Send className="h-4 w-4 mr-1" /> {smileStatus === 'verified' ? 'Verified' : 'Submit to Smile ID'}
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    console.log('Reporting issue with document', doc);
                                                    alert('Issue reported for this document');
                                                }}
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                <AlertTriangle className="h-4 w-4 mr-1" /> Report Issue
                                            </Button>
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
        </div>
    );
}
