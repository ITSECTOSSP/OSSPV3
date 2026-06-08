<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class DashboardUpdated implements ShouldBroadcastNow
{
    public $type;
    public $data;

    public function __construct($type, $data)
    {
        $this->type = $type;
        $this->data = $data;
    }

    public function broadcastOn()
    {
        return new Channel('dashboard');
    }

    public function broadcastAs()
    {
        return 'dashboard.updated';
    }
}