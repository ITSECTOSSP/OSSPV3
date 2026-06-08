import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';

import banner from '/public/draft_ossp banner.png';

export default function ConfirmPassword() {
    return (
        <AuthLayout title="" description="">
            <Head title="Confirm password" />

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

                {/* 🔥 GLASS CARD */}
                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="rounded-xl bg-white/30 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:bg-white/70 hover:backdrop-blur-none dark:bg-[#161615]/30 hover:dark:bg-[#161615]/70">

                        {/* TITLE */}
                        <h1 className="mb-2 text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                            Confirm Password
                        </h1>

                        <p className="mb-6 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            This is a secure area. Please confirm your password to continue.
                        </p>

                        <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-5">
                            {({ processing, errors }) => (
                                <>
                                    {/* PASSWORD */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            autoFocus
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            className="rounded-lg border-0 border-b border-white/60 bg-transparent px-0 p-3 transition-colors hover:border-black focus:border-black focus:ring-0 dark:border-white/40 dark:hover:border-white dark:focus:border-white"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    {/* BUTTON */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-4 w-full rounded-full bg-[#16036c] py-3 text-white hover:bg-[#0f0254]"
                                    >
                                        {processing && <Spinner />}
                                        Confirm Password
                                    </Button>
                                </>
                            )}
                        </Form>

                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}