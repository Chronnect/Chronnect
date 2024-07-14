export interface PgpKey {
    created_at: number | null;
    key_status: string;
    key_type: string;
    public_key: string;
}
