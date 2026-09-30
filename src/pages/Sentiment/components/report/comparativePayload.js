import { capSources } from './reputationPayload';

// Request body for the Comparative Intelligence report.
//
// Same report endpoint as Reputation Intelligence, but every brand on the board is
// sent side by side under the key the sentiment API returned it under, with
// `lead_brand` naming the one the report is written for. Source lists are capped per
// brand for the same reason as the reputation payload; summary totals are untouched.

export const COMPARATIVE_REPORT_TYPE = 'comparative_analysis';

// `entries` is [{ key, summary }] in board order; `leadKey` is the main brand's key.
export const buildComparativePayload = (leadKey, entries) => ({
    report_type: COMPARATIVE_REPORT_TYPE,
    data: {
        lead_brand: leadKey,
        ...Object.fromEntries(entries.map(({ key, summary }) => [key, capSources(summary)])),
    },
});

export default buildComparativePayload;
