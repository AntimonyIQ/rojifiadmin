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
import { Search, Download, Plus, Users, UserPlus, Loader2, ChevronLeft, ChevronRight, Eye, Edit, Trash, UserCheck, UserMinus } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { IPagination, IResponse, ITeams } from "@/interface/interface";
import { toast } from "@/hooks/use-toast";
import Defaults from "@/defaults/defaults";
import { session, SessionData } from "@/session/session";
import { Status, TeamRole, TeamStatus } from "@/enums/enums";

export default function TeamsPage() {
    const [teams, setTeams] = useState<ITeams[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState<TeamRole>(TeamRole.MEMBER);
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");
    const [addingMember, setAddingMember] = useState(false);
    const [pagination, setPagination] = useState<IPagination>({
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 0,
    });
    const sd: SessionData = session.getUserData();

    // Fetch teams with filters and pagination
    useEffect(() => {
        fetchTeams();
    }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

    const fetchTeams = async () => {
        try {
            setLoading(true);

            Defaults.LOGIN_STATUS();

            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            if (searchTerm) params.append('search', searchTerm);
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            const res = await fetch(`${Defaults.API_BASE_URL}/admin/teams/list?${params}`, {
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
                const parseData: Array<ITeams> = Defaults.PARSE_DATA(data.data, sd.client.privateKey, data.handshake);
                setTeams(parseData);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            }
        } catch (error: any) {
            toast({
                title: "Error fetching teams",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const archiveTeam = async (teamId: string) => {
        try {
            setLoadingStates(prev => ({ ...prev, [teamId]: true }));
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/teams/archive`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({ teamId }),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Team archived successfully",
                    description: `Team has been archived.`,
                    variant: "default",
                });
                await fetchTeams();
            }
        } catch (error: any) {
            toast({
                title: "Error archiving team",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [teamId]: false }));
        }
    }

    const removeMemberFromTeam = async (teamId: string, memberEmail: string) => {
        try {
            setLoadingStates(prev => ({ ...prev, [`${teamId}-${memberEmail}`]: true }));
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/teams/remove-member`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({ teamId, memberEmail }),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Member removed successfully",
                    description: `${memberEmail} has been removed from the team.`,
                    variant: "default",
                });
                await fetchTeams();
            }
        } catch (error: any) {
            toast({
                title: "Error removing member",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [`${teamId}-${memberEmail}`]: false }));
        }
    }

    const handleAddMember = async () => {
        if (!newMemberEmail || !selectedTeamId) return;

        try {
            setAddingMember(true);
            const res = await fetch(`${Defaults.API_BASE_URL}/admin/teams/add-member`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    Authorization: `Bearer ${sd.authorization}`,
                },
                body: JSON.stringify({
                    teamId: selectedTeamId,
                    email: newMemberEmail,
                    role: newMemberRole
                }),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                toast({
                    title: "Member added successfully",
                    description: `${newMemberEmail} has been added to the team.`,
                    variant: "default",
                });
                setNewMemberEmail("");
                setSelectedTeamId("");
                await fetchTeams();
            }
        } catch (error: any) {
            toast({
                title: "Error adding member",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setAddingMember(false);
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

    const activeTeams = teams.filter(t => !t.archived && !t.deleted).length;
    const totalTeams = teams.length;
    const totalMembers = teams.reduce((acc, team) => acc + team.members.length, 0);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    const getStatusBadge = (status: TeamStatus) => {
        switch (status) {
            case TeamStatus.ACTIVE:
                return <Badge variant="default">Active</Badge>;
            case TeamStatus.INVITATIONS:
                return <Badge variant="secondary">Invitations</Badge>;
            case TeamStatus.ARCHIVED:
                return <Badge variant="destructive">Archived</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const getRoleBadge = (role: TeamRole) => {
        switch (role) {
            case TeamRole.OWNER:
                return <Badge variant="destructive">Owner</Badge>;
            case TeamRole.ACCOUNTANT:
                return <Badge variant="default">Accountant</Badge>;
            case TeamRole.MEMBER:
                return <Badge variant="secondary">Member</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Teams Management</h1>
                    <div className="flex gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Member
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Add a new member to a team</p>
                                    </TooltipContent>
                                </Tooltip>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Team Member</DialogTitle>
                                    <DialogDescription>
                                        Add a new member to an existing team with a specific role.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teams.map((team) => (
                                                <SelectItem key={team.rojifiId} value={team.rojifiId}>
                                                    {team.sender.businessName} ({team.members.length} members)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="email"
                                        placeholder="Enter email address"
                                        value={newMemberEmail}
                                        onChange={(e) => setNewMemberEmail(e.target.value)}
                                    />
                                    <Select value={newMemberRole} onValueChange={(value) => setNewMemberRole(value as TeamRole)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={TeamRole.MEMBER}>Member</SelectItem>
                                            <SelectItem value={TeamRole.ACCOUNTANT}>Accountant</SelectItem>
                                            <SelectItem value={TeamRole.OWNER}>Owner</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={handleAddMember}
                                        disabled={!newMemberEmail || !selectedTeamId || addingMember}
                                        className="w-full"
                                    >
                                        {addingMember ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            "Add Member"
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
                                <p>Export teams list to CSV</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Teams
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalTeams}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Teams
                            </CardTitle>
                            <Users className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{activeTeams}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Members
                            </CardTitle>
                            <UserPlus className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{totalMembers}</div>
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
                                        placeholder="Search by business name or creator..."
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
                                        <SelectItem value="all">All Teams</SelectItem>
                                        <SelectItem value="active">Active Only</SelectItem>
                                        <SelectItem value="archived">Archived Only</SelectItem>
                                        <SelectItem value="deleted">Deleted Only</SelectItem>
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
                        <CardTitle>Teams List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Business Name</TableHead>
                                    <TableHead>Creator</TableHead>
                                    <TableHead>Members</TableHead>
                                    <TableHead>Created Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    teams.map((team) => (
                                        <TableRow key={team.rojifiId}>
                                            <TableCell className="font-medium">{team.sender.businessName}</TableCell>
                                            <TableCell>
                                                {team.creator.firstname} {team.creator.lastname}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {team.members.slice(0, 3).map((member, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <span className="text-sm">{member.email}</span>
                                                            {getRoleBadge(member.role)}
                                                            <Badge variant={member.status === TeamStatus.ACTIVE ? "default" : "secondary"}>
                                                                {member.status}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                    {team.members.length > 3 && (
                                                        <span className="text-sm text-muted-foreground">
                                                            +{team.members.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(team.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                {team.archived ? (
                                                    <Badge variant="destructive">Archived</Badge>
                                                ) : team.deleted ? (
                                                    <Badge variant="outline">Deleted</Badge>
                                                ) : (
                                                    <Badge variant="default">Active</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {/* View team details */ }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>View team details</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    {!team.archived && !team.deleted && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => archiveTeam(team.rojifiId)}
                                                                    disabled={loadingStates[team.rojifiId]}
                                                                >
                                                                    {loadingStates[team.rojifiId] ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Trash className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Archive team</p>
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

                        {teams.length === 0 && !loading && (
                            <div className="text-center py-8 text-muted-foreground">
                                No teams found matching your criteria.
                            </div>
                        )}
                    </CardContent>

                    <div className="border-t px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total teams)
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
