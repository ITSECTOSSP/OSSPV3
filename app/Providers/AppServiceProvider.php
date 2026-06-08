<?php

namespace App\Providers;

use Inertia\Inertia;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */

    public function boot(): void
    {

        // ✅ Force HTTPS in production
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

        // Share authenticated user globally
        Inertia::share([
            
            'auth.user' => function () {
                $user = Auth::user();

                return $user ? [
                    'id' => $user->id,
                    'employee_number' => $user->employee_number,
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'ossp_sections_id' => $user->ossp_sections_id,
                    'email_verified_at' => $user->email_verified_at,
                ] : null;
            },
        ]);
    }
}
