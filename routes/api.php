<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LegislativeTrackingApprove;
use App\Http\Controllers\Api\DocumentTrackingTitleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are stateless and return JSON only
*/

Route::middleware(['web', 'auth'])->group(function () {

    Route::get('/legislative/councilors', [
        LegislativeTrackingApprove::class,
        'getCouncilors'
    ]);

    // ✅ ADD THIS
    Route::get('/tracking-titles/{id}', [
        DocumentTrackingTitleController::class,
        'show'
    ]);
});