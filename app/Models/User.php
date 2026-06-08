<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_number',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'password',
        'role_id',
        'ossp_sections_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    protected $appends = ['full_name', 'name'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function section()
    {
        return $this->belongsTo(OsspSections::class, 'ossp_sections_id');
    }

    public function receivesBroadcastNotificationsOn()
    {
        return 'App.Models.User.' . $this->id;
    }

    public function getFullNameAttribute()
    {
        return collect([
            $this->first_name,
            $this->middle_name,
            $this->last_name
        ])->filter()->join(' ');
    }
    //$user->full_name
    public function getNameAttribute()
    {
        return $this->full_name;
    }
}
