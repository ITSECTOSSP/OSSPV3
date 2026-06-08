<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LegislativeTracking\LegislativeCityCouncilor;

class LegislativeTrackingApprove extends Controller
{
       public function getCouncilors(Request $request)
    {
        $councilIds = $request->input('city_council_ids', []);

        $councilors = LegislativeCityCouncilor::query()
            ->whereHas('cityCouncils', function ($query) use ($councilIds) {
                $query->whereKey($councilIds);
            })
            ->select('id', 'councilor_name')
            ->distinct()
            ->orderBy('councilor_name')
            ->get();

        return response()->json($councilors);
    }
}
