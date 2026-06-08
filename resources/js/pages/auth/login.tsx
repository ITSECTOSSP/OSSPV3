import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import banner from '/public/draft_ossp banner.png';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { errors } = usePage().props as any;
    useEffect(() => {
        if (errors?.employee_number || errors?.email) {
            toast.error(
                errors.employee_number ||
                    errors.email ||
                    'Invalid login credentials',
            );
        }

        if (errors?.password) {
            toast.error(errors.password);
        }
    }, [errors]);

    //Token Reset
    useEffect(() => {
        // 🔥 force fresh CSRF/session if expired
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');

        if (!token) {
            window.location.reload();
        }
    }, []);

    return (
        <AuthLayout title="" description="">
            <Head title="Log in" />

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#FDFDFC] dark:bg-[#0a0a0a]">
                {/* Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={banner}
                        alt="OSSP Banner"
                        className="h-full w-full object-cover opacity-80 dark:opacity-60"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10 dark:from-black/50 dark:to-black/30"></div>
                </div>

                {/* Layout */}
                <div className="relative z-10 w-full max-w-4xl px-6 py-12 lg:flex lg:items-center lg:gap-12">
                    {/* Glass Card */}
                    <div className="relative flex-1 rounded-xl bg-white/30 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:bg-white/70 hover:backdrop-blur-none dark:bg-[#161615]/30 hover:dark:bg-[#161615]/70">
                        <h1 className="mb-2 text-2xl font-bold text-[#1b1b18] lg:text-3xl dark:text-[#EDEDEC]">
                            IOSSP+
                        </h1>

                        <p className="mb-6 text-sm text-[#706f6c] lg:text-base dark:text-[#A1A09A]">
                            Office of the Secretary to the Sangguniang
                            Panlungsod
                            <br />
                            Quezon City
                        </p>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Employee Number */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="employee_number"
                                            className="text-sm font-medium"
                                        >
                                            Employee Number
                                        </Label>

                                        <Input
                                            id="employee_number"
                                            type="text"
                                            name="employee_number"
                                            required
                                            autoFocus
                                            autoComplete="username"
                                            placeholder="EMP-001"
                                            onInput={(e) => {
                                                e.currentTarget.value =
                                                    e.currentTarget.value.toUpperCase();
                                            }}
                                        />
                                        <InputError
                                            message={errors.employee_number}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label
                                                htmlFor="password"
                                                className="text-sm font-medium"
                                            >
                                                Password
                                            </Label>

                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="ml-auto text-sm hover:underline"
                                                >
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>

                                        <div className="relative w-full">
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className="w-full rounded-lg border-b border-gray-400 bg-transparent px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none dark:border-white/40 dark:text-white dark:placeholder-white/50 dark:focus:border-white"
                                            />

                                            {/* Eye Button */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center justify-center px-2 text-gray-500 hover:text-black dark:hover:text-white"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>

                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Remember
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            className="border-white/60 transition-colors duration-300 hover:border-black focus:border-black data-[state=checked]:border-[#16036c] data-[state=checked]:bg-[#16036c] dark:border-white/40 dark:hover:border-white dark:focus:border-white"
                                        />

                                        <Label
                                            htmlFor="remember"
                                            className="cursor-pointer text-sm"
                                        >
                                            Remember me
                                        </Label>
                                    </div> */}

                                    {status && (
                                        <div className="text-sm font-medium text-green-600">
                                            {status}
                                        </div>
                                    )}

                                    {/* Floating Button */}
                                    <div className="absolute -bottom-6 left-1/2 flex w-full -translate-x-1/2 justify-center">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full max-w-xs transform rounded-full bg-[#16036c] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#0f0254]"
                                        >
                                            {processing && <Spinner />}
                                            Log in
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
