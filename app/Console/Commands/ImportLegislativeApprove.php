<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportLegislativeApprove extends Command
{
    protected $signature = 'import:approve';
    protected $description = 'Import legislative approve CSV into database';

    public function handle()
    {
        $path = storage_path('app/imports/legislative_approve.csv');

        if (!file_exists($path)) {
            $this->error("CSV file not found: " . $path);
            return;
        }

        $handle = fopen($path, "r");

        $headers = fgetcsv($handle); // first row
        $batch = [];
        $count = 0;
        $chunkSize = 500; // safe batch size

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($headers, $row);

            $batch[] = [
                'id' => $data['id'],
                'approve_no' => trim($data['approve_no'] ?? ''),
                'approve_title' => trim($data['approve_title']),
                'series_year' => $data['series_year'] ?? null,

                'measure_type_id' => $data['measure_type_id'],

                'city_council_id' => !empty($data['city_council_id'])
                    ? (int) $data['city_council_id']
                    : null,

                'created_at' => now(),
                'updated_at' => now(),
            ];

            $count++;

            if (count($batch) >= $chunkSize) {
                DB::table('legislative_approve')->insert($batch);
                $batch = [];
                $this->info("Inserted: $count rows...");
            }
        }

        // insert remaining
        if (!empty($batch)) {
            DB::table('legislative_approve')->insert($batch);
        }

        fclose($handle);

        $this->info("DONE! Total inserted rows: $count");
    }
}
