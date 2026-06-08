<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Ziggy Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration settings for the Ziggy package,
    | which provides JavaScript access to your Laravel named routes.
    |
    */

    'whitelist' => [
        //
    ],

    'blacklist' => [
        //
    ],

    'cache' => env('ZIGGY_CACHE', true),

    'cache_key' => env('ZIGGY_CACHE_KEY', 'ziggy_routes'),

    'except' => [
        //
    ],

];