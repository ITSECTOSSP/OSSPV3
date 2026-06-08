import { login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

import banner from '/public/draft_ossp banner.png';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout title="" description="">
            <Head title="Forgot password" />

            <div className="relative flex min-h-screen items-center justify-center bg-[#FDFDFC] dark:bg-[#0a0a0a]">
                {/* 🔥 SAME BACKGROUND */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={banner}
                        alt="OSSP Banner"
                        className="h-full w-full object-cover opacity-80 dark:opacity-60"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10 dark:from-black/50 dark:to-black/30" />
                </div>

                {/* 🔥 SAME GLASS CARD */}
                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="rounded-xl bg-white/30 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:bg-white/70 hover:backdrop-blur-none dark:bg-[#161615]/30 hover:dark:bg-[#161615]/70">
                        {/* TITLE */}
                        <h1 className="mb-2 text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                            Forgot Password
                        </h1>

                        <p className="mb-6 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            Enter your email to receive a password reset link
                        </p>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <Form {...email.form()} className="flex flex-col gap-5">
                            {({ processing, errors }) => (
                                <>
                                    {/* EMAIL */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Email address
                                        </Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoFocus
                                            placeholder="email@example.com"
                                            className="rounded-lg border-0 border-b border-white/60 bg-transparent p-3 px-0 transition-colors hover:border-black focus:border-black focus:ring-0 dark:border-white/40 dark:hover:border-white dark:focus:border-white"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    {/* BUTTON */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-4 w-full rounded-full bg-[#16036c] py-3 text-white hover:bg-[#0f0254]"
                                    >
                                        {processing && (
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Send Reset Link
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* FOOTER LINK */}
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            <span>Back to </span>
                            <TextLink href={login()}>log in</TextLink>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
