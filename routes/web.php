<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\DashboardController;

use App\Http\Controllers\Admin\LegislativeCityCouncilorController;
use App\Http\Controllers\Admin\LegislativeCityCouncilsController;
use App\Http\Controllers\Admin\AdminPanelController;

use App\Http\Controllers\LegislativeTracking\LegislativeApproveController;
use App\Http\Controllers\LegislativeTracking\LegislativeProposeController;

use App\Http\Controllers\DocumentTracking\DocumentTrackingDivisionChief;
use App\Http\Controllers\DocumentTracking\DocumentTrackingController;
use App\Http\Controllers\DocumentTracking\DocumentTrackingReplyController;
use App\Http\Controllers\DocumentTracking\DocumentTrackingAssignController;
use App\Http\Controllers\DocumentTracking\DocumentTrackingActionTakenController;
use App\Http\Controllers\DocumentTracking\DocumentTrackingDepartmentHead;

use App\Http\Controllers\Admin\DocumentTypesController;
use App\Http\Controllers\Admin\DocumentClassificationsController;

use App\Http\Controllers\NotificationController;


/*
|--------------------------------------------------------------------------
| Session Routes
|--------------------------------------------------------------------------
*/

Route::post('/keep-alive', function () {
    return response()->json(['status' => 'alive']);
})->middleware('auth');

Route::post('/logout', function (Request $request) {
    Auth::logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/login');
})->name('logout');

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome', []);
})->name('home');


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/status', [DashboardController::class, 'status'])
        ->name('document-tracking.status');

    /*
    |--------------------------------------------------------------------------
    | Division Chief
    |--------------------------------------------------------------------------
    */

    Route::prefix('divchief')->name('divchief.')->middleware(['auth'])->group(function () {
        // Dashboard for pending tracking titles
        Route::get('/', [DocumentTrackingDivisionChief::class, 'index'])
            ->name('tracking'); // route name: depthead.tracking

    });

    /*
    |--------------------------------------------------------------------------
    | Department Head
    |--------------------------------------------------------------------------
    */

    Route::prefix('depthead')->name('depthead.')->middleware(['auth'])->group(function () {
        // Dashboard for pending tracking titles
        Route::get('/', [DocumentTrackingDepartmentHead::class, 'index'])
            ->name('tracking'); // route name: depthead.tracking

    });

    /*
    |--------------------------------------------------------------------------
    | Legislative Tracking
    |--------------------------------------------------------------------------
    */

    Route::middleware(['auth'])->group(function () {
        Route::prefix('legislative-tracking')
            ->name('legislative-tracking.')
            ->group(function () {
                /*
                |--------------------------------------------------------------------------
                | Approve Tracking
                |--------------------------------------------------------------------------
                */
                Route::prefix('approve')
                    ->name('approve.')
                    ->controller(LegislativeApproveController::class)
                    ->group(function () {

                        Route::get('/', 'index')
                            ->name('index');

                        Route::get('/create', 'create')
                            ->name('create');

                        Route::post('/', 'store')
                            ->name('store');

                        Route::get('/{item}/edit', 'edit')
                            ->name('edit');

                        Route::put('/{item}', 'update')
                            ->name('update');

                        Route::delete('/{item}', 'destroy')
                            ->name('destroy');
                    });
                /*
                |--------------------------------------------------------------------------
                | Propose Tracking
                |--------------------------------------------------------------------------
                */
                Route::prefix('propose')
                    ->name('propose.')
                    ->controller(LegislativeProposeController::class)
                    ->group(function () {

                        Route::get('/', 'index')
                            ->name('index');

                        Route::get('/create', 'create')
                            ->name('create');

                        Route::post('/', 'store')
                            ->name('store');

                        Route::get('/{item}/edit', 'edit')
                            ->name('edit');

                        Route::put('/{item}', 'update')
                            ->name('update');

                        Route::delete('/{item}', 'destroy')
                            ->name('destroy');
                    });
            });
    });
    /*
    |--------------------------------------------------------------------------
    | Document Tracking
    |--------------------------------------------------------------------------
    */

    Route::prefix('document-tracking')
        ->name('document-tracking.')
        ->group(function () {

            // Main
            Route::get('/', [DocumentTrackingController::class, 'index'])
                ->name('index');

            Route::get('/create', [DocumentTrackingController::class, 'create'])
                ->name('create');

            Route::post('/', [DocumentTrackingController::class, 'store'])
                ->name('store');

            Route::get('/edit/{item}', [DocumentTrackingController::class, 'edit'])
                ->name('edit');

            Route::put('/{item}', [DocumentTrackingController::class, 'update'])
                ->name('update');

            Route::delete('/{item}', [DocumentTrackingController::class, 'destroy'])
                ->name('destroy');

            Route::post('/{item}/notify-depthead', [DocumentTrackingController::class, 'notifyDeptHead'])
                ->name('notify');


            // File Upload
            Route::post('/files/upload', [DocumentTrackingController::class, 'tfilestore'])
                ->name('files.upload');

            Route::delete('/files/{trackingFile}', [DocumentTrackingController::class, 'destroyfile'])
                ->name('files.destroy');

            // ✅ Show route for notifications
            Route::get('/{item}', [DocumentTrackingController::class, 'show'])
                ->name('show');

            /*
    |--------------------------------------------------------------------------
    | Manage Tracking
    |--------------------------------------------------------------------------
    */
            Route::get('/manage/{item}', [DocumentTrackingAssignController::class, 'index'])
                ->name('manage');

            /*
        |--------------------------------------------------------------------------
        | Assign
        |--------------------------------------------------------------------------
        */
            Route::prefix('assign')->name('assign.')->group(function () {

                Route::get('/{item}', [DocumentTrackingAssignController::class, 'index'])
                    ->name('index');

                Route::post('/{item}', [DocumentTrackingAssignController::class, 'store'])
                    ->name('store');

                Route::put('/{assignment}', [DocumentTrackingAssignController::class, 'update'])
                    ->name('update');

                Route::delete('/{assignment}', [DocumentTrackingAssignController::class, 'destroy'])
                    ->name('destroy');
            });


            /*
        |--------------------------------------------------------------------------
        | Replies
        |--------------------------------------------------------------------------
        */

            Route::prefix('reply')->name('reply.')->group(function () {

                Route::post('/{item}', [DocumentTrackingReplyController::class, 'store'])
                    ->name('store');

                Route::put('/{reply}', [DocumentTrackingReplyController::class, 'update'])
                    ->name('update');

                Route::delete('/{reply}', [DocumentTrackingReplyController::class, 'destroy'])
                    ->name('destroy');


                /*
            |--------------------------------------------------------------------------
            | Action Taken
            |--------------------------------------------------------------------------
            */

                Route::prefix('action')->name('action.')->group(function () {

                    Route::post('/{reply}', [DocumentTrackingActionTakenController::class, 'store'])
                        ->name('store');

                    Route::put('/{actionTaken}', [DocumentTrackingActionTakenController::class, 'update'])
                        ->name('update');

                    Route::delete('/{actionTaken}', [DocumentTrackingActionTakenController::class, 'destroy'])
                        ->name('destroy');
                });
            });
        });


    /*
    |--------------------------------------------------------------------------
    | Admin Panel
    |--------------------------------------------------------------------------
    */

    Route::prefix('admin-panel')
        ->name('admin-panel.')
        ->group(function () {

            Route::get('/', [AdminPanelController::class, 'userTable'])
                ->name('dashboard');


            /*
        |--------------------------------------------------------------------------
        | Document Types
        |--------------------------------------------------------------------------
        */
            Route::prefix('document-types')
                ->name('document-types.')
                ->controller(DocumentTypesController::class)
                ->group(function () {

                    Route::get('/', 'Index')
                        ->name('index');

                    Route::get('/create', 'Create')
                        ->name('create');

                    Route::post('/', 'store')
                        ->name('store');

                    Route::get('/{documentTypes}/edit', 'Edit')
                        ->name('edit');

                    Route::put('/{documentTypes}', 'update')
                        ->name('update');

                    Route::delete('/{documentTypes}', 'destroy')
                        ->name('destroy');
                });

            /*
        |--------------------------------------------------------------------------
        | Document Classifications
        |--------------------------------------------------------------------------
        */
            Route::prefix('document-classifications')
                ->name('document-classifications.')
                ->controller(DocumentClassificationsController::class)
                ->group(function () {

                    Route::get('/', 'Index')
                        ->name('index');

                    Route::get('/create', 'Create')
                        ->name('create');

                    Route::post('/', 'store')
                        ->name('store');

                    Route::get('/{trackingClassifications}/edit', 'Edit')
                        ->name('edit');

                    Route::put('/{trackingClassifications}', 'update')
                        ->name('update');

                    Route::delete('/{trackingClassifications}', 'destroy')
                        ->name('destroy');
                });

            /*
        |--------------------------------------------------------------------------
        | Users
        |--------------------------------------------------------------------------
        */

            Route::prefix('users')->name('users.')->group(function () {

                Route::get('/', [AdminPanelController::class, 'userTable'])
                    ->name('index');

                Route::get('/create', [AdminPanelController::class, 'create'])
                    ->name('create');

                Route::post('/', [AdminPanelController::class, 'store'])
                    ->name('store');

                Route::get('/edit/{user}', [AdminPanelController::class, 'edit'])
                    ->name('edit');

                Route::put('/{user}', [AdminPanelController::class, 'update'])
                    ->name('update');

                Route::delete('/{user}', [AdminPanelController::class, 'destroy'])
                    ->name('destroy');
            });


            /*
        |--------------------------------------------------------------------------
        | City Council
        |--------------------------------------------------------------------------
        */

            Route::prefix('city-councils')
                ->name('city-councils.')
                ->controller(LegislativeCityCouncilsController::class)
                ->group(function () {

                    Route::get('/', 'Index')
                        ->name('index');

                    Route::get('/create', 'Create')
                        ->name('create');

                    Route::post('/', 'store')
                        ->name('store');

                    Route::get('/{cityCouncil}/edit', 'Edit')
                        ->name('edit');

                    Route::put('/{cityCouncil}', 'update')
                        ->name('update');

                    Route::delete('/{cityCouncil}', 'destroy')
                        ->name('destroy');
                });

            /*
        |--------------------------------------------------------------------------
        | City Councilors
        |--------------------------------------------------------------------------
        */

            Route::prefix('city-councilors')
                ->name('city-councilors.')
                ->controller(LegislativeCityCouncilorController::class)
                ->group(function () {

                    Route::get('/', 'Index')
                        ->name('index');

                    Route::get('/create', 'Create')
                        ->name('create');

                    Route::post('/', 'store')
                        ->name('store');

                    Route::get('/{cityCouncilor}/edit', 'Edit')
                        ->name('edit');

                    Route::put('/{cityCouncilor}', 'update')
                        ->name('update');

                    Route::delete('/{cityCouncilor}', 'destroy')
                        ->name('destroy');
                });
        });

    /*
        |--------------------------------------------------------------------------
        | Notifications
        |--------------------------------------------------------------------------
        */
    Route::middleware('auth')->group(function () {
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/unread', [NotificationController::class, 'unread']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    });
});


require __DIR__ . '/settings.php';
