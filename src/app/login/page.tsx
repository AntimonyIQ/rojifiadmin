import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
// Using a simple controlled form instead of the form wrapper
import { ILocation, IResponse, ISender, ITransaction, IUser, IWallet } from "@/interface/interface";
import { session, SessionData } from "@/session/session";
import Defaults from "@/defaults/defaults";
import { Status } from "@/enums/enums";
import { Eye, EyeClosed } from "lucide-react";
import { useLocation } from "wouter";

export interface ILoginFormProps {
    user: IUser;
    wallets: Array<IWallet>;
    transactions: Array<ITransaction>;
    sender: ISender;
}

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [, setRouteLocation] = useLocation();
    const [location, setLocation] = useState<Partial<ILocation>>({
        country: '',
        state: '',
        city: '',
        ip: '',
    });
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [rememberMe, setRememberMe] = useState(false);
    const sd: SessionData = session.getUserData();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        getLocationFromIP();
    }, []);

    const getLocationFromIP = async () => {
        try {
            const res = await fetch('https://ipapi.co/json/', {
                headers: { "Accept": "application/json" }
            });
            // if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();

            if (data) {
                const location: Partial<ILocation> = {
                    country: data.country_name,
                    state: data.region,
                    city: data.city,
                    ip: data.ip,
                };

                setLocation(location);
            }
        } catch (error) {
            console.error('Unable to fetch location from IP!', error);
            return null;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

        try {
            setIsLoading(true);

            const res = await fetch(`${Defaults.API_BASE_URL}/auth/adminlogin`, {
                method: 'POST',
                headers: {
                    ...Defaults.HEADERS,
                    'x-rojifi-handshake': sd.client.publicKey,
                    'x-rojifi-deviceid': sd.deviceid,
                    'x-rojifi-location': location ? `${location.state}, ${location.country}` : "Unknown",
                    'x-rojifi-ip': location?.ip || "Unknown",
                    'x-rojifi-devicename': sd.devicename,
                },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });

            const data: IResponse = await res.json();
            if (data.status === Status.ERROR) throw new Error(data.message || data.error);
            if (data.status === Status.SUCCESS) {
                if (!data.handshake) throw new Error('Unable to process login response right now, please try again.');
                const parseData = Defaults.PARSE_DATA(data.data, sd.client.privateKey, data.handshake);
                const authorization = parseData.authorization;

                const userres = await fetch(`${Defaults.API_BASE_URL}/admin`, {
                    method: 'GET',
                    headers: {
                        ...Defaults.HEADERS,
                        'x-rojifi-handshake': sd.client.publicKey,
                        'x-rojifi-deviceid': sd.deviceid,
                        Authorization: `Bearer ${authorization}`,
                    },
                });

                const userdata: IResponse = await userres.json();
                if (userdata.status === Status.ERROR) throw new Error(userdata.message || userdata.error);
                if (userdata.status === Status.SUCCESS) {
                    if (!userdata.handshake) throw new Error('Unable to process login response right now, please try again.');
                    const parseData = Defaults.PARSE_DATA(userdata.data, sd.client.privateKey, userdata.handshake);
                    toast({
                        title: "Successfully logged in!",
                        description: "Welcome to Rojifi Admin Dashboard",
                    });

                    session.login({
                        ...sd,
                        authorization: authorization,
                        isLoggedIn: true,
                        user: parseData,
                    });

                    // Use proper routing instead of hard refresh
                    setRouteLocation("/dashboard");
                }
            }
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Login failed",
                description:
                    err.message || "Please check your credentials and try again",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen bg-gray-50 px-4"
        >
            <Card className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary-600">Rojifi</h1>
                    <p className="mt-2 text-gray-600">Admin Dashboard Login</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <div>
                                <Input
                                    placeholder="admin@rojifi.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)}
                                    type="email"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <div>
                                    <Input
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', (e.target as HTMLInputElement).value)}
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-primary-600"
                                >
                                    {showPassword
                                        ? <Eye size={16} />
                                        : <EyeClosed size={16} />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div>
                                <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(!!v)} id="remember-me" />
                            </div>
                            <label className="text-sm font-normal cursor-pointer" htmlFor="remember-me">Remember me</label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Forgot your password?</a>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </Card>
        </motion.div>
    );
}
