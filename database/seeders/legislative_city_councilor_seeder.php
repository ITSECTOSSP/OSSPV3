<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class legislative_city_councilor_seeder extends Seeder
{
    public function run(): void
    {
        $councilors = [
            // =========================
            // DISTRICT 1
            // =========================
            ['HON. BERNARD R. HERRA', 1],
            ['HON. TANY JOE "TJ" L. CALALAY', 1],
            ['HON. DOROTHY A. DELARMENTE, MD.', 1],
            ['HON. JOSEPH P. JUICO', 1],
            ['HON. NICOLE ELLA "NIKKI" V. CRISOLOGO', 1],
            ['HON. CHARM M. FERRER, CPA, MPA, JD', 1],

            // =========================
            // DISTRICT 2
            // =========================
            ['HON. FERNANDO MIGUEL "MIKEY" B. BELMONTE', 2],
            ['HON. EDEN DELILAH "CANDY" MEDINA', 2],
            ['HON. JULIENNE ALYSON RAE "ALY" MEDALLA', 2],
            ['HON. CLARK DAVID "DAVE" C. VALMOCINA', 2],
            ['HON. RANULFO "TATAY RANNIE" Z. LUDOVICA', 2],
            ['HON. ATTY. VOLTAIRE GODOFREDO S. LIBAN, III', 2],

            // =========================
            // DISTRICT 3
            // =========================
            ['HON. KATE ABIGAEL G. COSETENG', 3],
            ['HON. GELEEN "DOK G" G. LUMBAD', 3],
            ['HON. ALBERT ALVIN "CHUCKIE" L. ANTONIO III', 3],
            ['HON. JOSE MARIO DON S. DE LEON', 3],
            ['HON. WENCEROM BENEDICT C. LAGUMBAY', 3],
            ['HON. ATTY. ANTONIO GABRIEL "ANTON" L. REYES', 3],
            ['HON. ATTY. CHRISTOFFER ALLAN "TOPE" A. LIQUIGAN', 3],
            ['HON. LUIGI D. PUMAREN', 3],

            // =========================
            // DISTRICT 4
            // =========================
            ['HON. ATTY. VICENTE BELMONET JR.', 4],
            ['HON. EDGAR "EGAY" G. YAP', 4],
            ['HON. NANETTE CASTELLO DAZA', 4],
            ['HON. ATTY. JESUS MIGUEL SUNTAY', 4],
            ['HON. RAQUEL S. MALAÑGEN', 4],
            ['HON. MA. AURORA "MARRA" C. SUNTAY', 4],
            ['HON. IRENE R. BELMONTE', 4],

            // =========================
            // DISTRICT 5
            // =========================
            ['HON. JOSEPH JOE VISAYA', 5],
            ['HON. AIKO S. MELENDEZ', 5],
            ['HON. ALFRED VARGAS, MPA', 5],
            ['HON. KARL EDGAR CASTELLO', 5],
            ['HON. SHAIRA "SHAY" L. LIBAN', 5],
            ['HON. RAMON VICENTE "RAM" V. MEDALLA', 5],
          
            // =========================
            // DISTRICT 6
            // =========================
            ['HON. MARIA ELEANOR "DOC ELLIE" R. JUAN. O.D.', 6],
            ['HON. EMMANUEL BANJO A. PILAR', 6],
            ['HON. KRISTINE ALEXIA R. MATIAS, RN', 6],
            ['HON. VICTOR "VIC" D. BERNARDO', 6],
            ['HON. VITO SOTTO GENEROSO', 6],
            ['HON. ERWIN REY "COCOY" A. MEDINA', 6],
            ['HON. ERIC Z. MEDINA', 6],

            // =========================
            // EX-OFFICIO
            // =========================
            ['HON. JHON ANGELLI STEFHANY "SAMI" C. NERI', 7],
            ['HON. JOSE MARIA "MARI" M. RODRIGUEZ', 7],

            ['HON. FRANZ S. PUMAREN', 3],
        ];

        foreach ($councilors as $councilor) {
            DB::table('legislative_city_councilor')->insert([
                'councilor_name' => $councilor[0],
                'legislative_district_id' => $councilor[1],
                'details' => null,
                'contact' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}