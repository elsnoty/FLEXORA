import { PaymobPayload } from "@/Types/Payment";
import crypto from "crypto";

export function VerifyPaymobHmac(payload: PaymobPayload, receivedHmac: string, secret: string): boolean {
    const obj = payload.obj;
    const stringToHash = [
        String(obj.amount_cents ?? ''),
        String(obj.created_at ?? ''),
        String(obj.currency ?? ''),
        String(obj.error_occured ?? ''),
        String(obj.has_parent_transaction ?? ''),
        String(obj.id ?? ''),
        String(obj.integration_id ?? ''),
        String(obj.is_3d_secure ?? ''),
        String(obj.is_auth ?? ''),
        String(obj.is_capture ?? ''),
        String(obj.is_refunded ?? ''),
        String(obj.is_standalone_payment ?? ''),
        String(obj.is_voided ?? ''),
        String(obj.order?.id ?? ''),
        String(obj.owner ?? ''),
        String(obj.pending ?? ''),
        String(obj.source_data?.pan ?? ''),
        String(obj.source_data?.sub_type ?? ''),
        String(obj.source_data?.type ?? ''),
        String(obj.success ?? '')
    ].join('');
    
        const calculatedHmac = crypto
        .createHmac('sha512', secret)
        .update(stringToHash)
        .digest('hex');
    
    return calculatedHmac === receivedHmac;
    }