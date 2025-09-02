"use client";

import { useEffect, useState } from "react";
// Read-only wallets table - no card or input UI required
import { IPagination, IResponse, IWallet } from "@/interface/interface";
import { session, SessionData } from "@/session/session";
import Defaults from "@/defaults/defaults";
import { Status } from "@/enums/enums";

export default function WalletsComponent({ userId }: { userId: string }) {
    const [wallets, setWallets] = useState<Array<IWallet>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // Read-only list UI: no dialogs or manipulation state
    const [_pagination, setPagination] = useState<IPagination>({
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 10,
    });
    const sd: SessionData = session.getUserData();

    useEffect(() => {
        if (sd) {
            fetchWallets();
        }
    }, [sd]);

    const fetchWallets = async () => {
        try {
            setLoading(true)

            Defaults.LOGIN_STATUS();
            const url: string = `${Defaults.API_BASE_URL}/admin/wallet/list?userId=${userId}`;

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
                const parseData: Array<IWallet> = Defaults.PARSE_DATA(data.data, sd.client.privateKey, data.handshake);
                setWallets(parseData);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            }
        } catch (error) {
            console.error("Error fetching wallets:", error);
        } finally {
            setLoading(false);
        }
    };

    // No-op handlers — UI is read-only

    if (loading)
        return (
            <div className="w-full h-full flex items-center justify-center space-y-2 mt-10">
                <div className="flex flex-col items-center space-y-2">
                    <div className="border-b border-primary rounded-full w-10 h-10 animate-spin duration-300"></div>
                    <p className="text-center text-sm">Fetching Wallets...</p>
                </div>
            </div>
        );

    const formatBalance = (wallet: any) => {
        const symbol = wallet.symbol ?? (wallet.currency && (wallet.currency as any).symbol) ?? '';
        const value = typeof wallet.balance === 'number' ? wallet.balance : Number(wallet.balance || 0);
        const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
        return `${symbol}${formatted}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">Wallets</h3>
                <p className="text-sm text-gray-500">{wallets.length} wallets</p>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full align-middle">
                    <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {wallets.map((wallet: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    {wallet.icon ? (
                                                        <img src={wallet.icon} alt={wallet.name ?? 'icon'} className="h-6 w-6 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="h-9 w-9 rounded-full bg-primary-50 flex items-center justify-center text-primary">⚡</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{wallet.name ?? (wallet.currency && (wallet.currency as any).toString()) ?? '-'}</div>
                                                    <div className="text-xs text-gray-500">{wallet.userId?.fullName ?? '-'}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">{formatBalance(wallet)}</div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {wallet.icon ? (
                                                    <img src={wallet.icon} alt={wallet.name ?? 'icon'} className="h-6 w-6 rounded-full object-cover" />
                                                ) : null}
                                                <div className="text-sm text-gray-700">{(wallet.currency && (wallet.currency as any).toString()) ?? '-'}</div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {wallet.status ? (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${wallet.status === 'active' || wallet.activated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {wallet.status ?? (wallet.activated ? 'active' : 'inactive')}
                                                </span>
                                            ) : (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${wallet.activated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {wallet.activated ? 'active' : 'inactive'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
