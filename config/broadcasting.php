<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Broadcaster
    |--------------------------------------------------------------------------
    |
    | This option controls the default broadcaster that will be used by the
    | framework when an event needs to be broadcast. You may set this to
    | any of the connections defined in the "connections" array below.
    |
    | Supported: "reverb", "pusher", "ably", "redis", "log", "null"
    |
    */

    'default' => env('BROADCAST_CONNECTION', 'reverb'),

    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the broadcast connections that will be used
    | to broadcast events to other systems or over WebSockets. Samples of
    | each available type of connection are provided inside this array.
    |
    */

    'connections' => [

        'reverb' => [
            'driver' => 'reverb',
            'key' => env('REVERB_APP_KEY'),
            'secret' => env('REVERB_APP_SECRET'),
            'app_id' => env('REVERB_APP_ID'),
            'options' => [
                'host' => env('REVERB_HOST'),
                'port' => env('REVERB_PORT'),
                'scheme' => env('REVERB_SCHEME'),
            ],
        ],

        // 'pusher' => [
        //     'driver' => 'pusher',
        //     'key' => env('PUSHER_APP_KEY', 'reverb'),
        //     'secret' => env('PUSHER_APP_SECRET', 'secret'),
        //     'app_id' => env('PUSHER_APP_ID', '1'),
        //     'options' => [
        //         'cluster' => env('PUSHER_APP_CLUSTER'), // can be null if self-hosted
        //         'useTLS' => false,
        //         'host' => '127.0.0.1',
        //         'port' => 6001,
        //         'scheme' => 'http',
        //         'encrypted' => false,
        //     ],
        // ],

        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY'),
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];
