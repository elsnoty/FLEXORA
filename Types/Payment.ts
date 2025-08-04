
export type PaymobPayload = {
        obj: {
        amount_cents?: number;
        created_at?: string;
        currency?: string;
        error_occured?: boolean;
        has_parent_transaction?: boolean;
        id?: number;
        integration_id?: number;
        is_3d_secure?: boolean;
        is_auth?: boolean;
        is_capture?: boolean;
        is_refunded?: boolean;
        is_standalone_payment?: boolean;
        is_voided?: boolean;
        order?: { id?: number };
        owner?: number;
        pending?: boolean;
        source_data?: {
        pan?: string;
        sub_type?: string;
        type?: string;
        };
        success?: boolean;
    };
    };