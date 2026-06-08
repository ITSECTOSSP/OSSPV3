<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportLegislativePropose extends Command
{
    protected $signature = 'import:propose';
    protected $description = 'Import legislative propose CSV into database';

    public function handle()
    {
        $path = storage_path('app/imports/legislative_propose.csv');

        if (!file_exists($path)) {
            $this->error("CSV file not found: " . $path);
            return;
        }

        $handle = fopen($path, "r");

        $headers = fgetcsv($handle); // first row
        $batch = [];
        $count = 0;
        $chunkSize = 500; // safe chunk size

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($headers, $row);

            $batch[] = [
                'id' => $data['id'],
                'propose_no' => trim($data['propose_no']),
                'propose_title' => trim($data['propose_title']),
                'measure_type_id' => (int) $data['measure_type_id'],
                
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $count++;

            if (count($batch) >= $chunkSize) {
                DB::table('legislative_propose')->insert($batch);
                $batch = [];
                $this->info("Inserted: $count rows...");
            }
        }

        // insert remaining
        if (!empty($batch)) {
            DB::table('legislative_propose')->insert($batch);
        }

        fclose($handle);

        $this->info("DONE! Total inserted rows: $count");
    }
}
