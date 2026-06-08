export interface LegislativeProposed {
    id: string;

    propose_no: string;
    propose_title: string;

    measure_type_id: number;

    measureType: {
        id: number;
        measure_name: string;
    };

    city_council_id?: number | null;

    citycouncil?: {
        id: number;
        council_name: string;
    };

    proponents: LegislativeCityCouncilor[]

    approved: LegislativeApproved[];

    created_at: string;
    updated_at: string;

    creator?: {
        id: number;
        full_name: string;
    };

    editor?: {
        id: number;
        full_name: string;
    };
}

export type LegislativeCityCouncil = {
    id: number;
    council_name: string;
    created_at?: string;
    updated_at?: string;
};

export interface LegislativeApproved {
    id: string;

    approve_no: string;
    approve_title: string;

    enact_adopt_date: string;
    series_year: number | null;

    propose_id?: string | null;

    city_council_id?: number | null;

    measure_type_id: number;

    measureType: {
        id: number;
        measure_name: string;
    };

    citycouncil?: {
        id: number;
        council_name: string;
    };

    propose?: LegislativeProposed | null;

    councilors?: LegislativeApproveCouncilor[];

    introducers?: LegislativeCityCouncilor[];

    coIntroducers?: LegislativeCityCouncilor[];

    created_at: string;
    updated_at: string;

    creator?: {
        id: number;
        full_name: string;
    };

    editor?: {
        id: number;
        full_name: string;
    };
}

export type LegislativeMeasureType = {
    id: number;
    measure_name: string;
};

export type LegislativeDistrict = {
    id: number;
    district_name: string;

    created_at?: string;
    updated_at?: string;
};

export type LegislativeCityCouncilor = {
    id: number;

    district_id: number;

    councilor_name: string;

    details?: string | null;
    contact?: string | null;

    district?: LegislativeDistrict;
    city_councils?: LegislativeCityCouncil[];

    created_at?: string;
    updated_at?: string;
};

export type LegislativeApproveCouncilor = {
    id: number;

    legislative_approve_id: string;

    councilor_id: number;

    role: 'introducer' | 'co_introducer';

    councilor?: LegislativeCityCouncilor;

    created_at?: string;
    updated_at?: string;
};
