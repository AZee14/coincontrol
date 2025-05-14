import { COIN_POST_REQUEST_TIME, NOTIFICATION_CHECK_TIME } from "@/utils/constants";
import { SupabaseClient } from "@supabase/supabase-js";

// Define the shape of user notification settings
export interface UserNotificationSettings {
    user_id: string;
    price_change_threshold_1h?: number;
    price_change_threshold_24h?: number;
    profit_threshold_percent?: number;
    loss_threshold_percent?: number;
    enable_price_change_alerts?: boolean;
    enable_profit_loss_alerts?: boolean;
    updated_at?: string;
}

// Get user notification settings
export async function getUserNotificationSettings(
    supabase: SupabaseClient,
    userId: string
): Promise<UserNotificationSettings | null> {
    const { data, error } = await supabase
        .from("user_notification_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" error
        console.error("Error fetching notification settings:", error);
        return null;
    }

    // If no settings exist, create default settings
    if (!data) {
        const { data: newSettings, error: insertError } = await supabase
            .from("user_notification_settings")
            .insert({ user_id: userId })
            .select()
            .single();

        if (insertError) {
            console.error("Error creating default notification settings:", insertError);
            return null;
        }

        return newSettings;
    }

    return data;
}

// Update user notification settings
export async function updateNotificationSettings(
    supabase: SupabaseClient,
    userId: string,
    settings: Partial<UserNotificationSettings>
): Promise<UserNotificationSettings | null> {
    // Validate settings object
    const validSettings: Partial<UserNotificationSettings> = {
        price_change_threshold_1h: settings.price_change_threshold_1h,
        price_change_threshold_24h: settings.price_change_threshold_24h,
        profit_threshold_percent: settings.profit_threshold_percent,
        loss_threshold_percent: settings.loss_threshold_percent,
        enable_price_change_alerts: settings.enable_price_change_alerts,
        enable_profit_loss_alerts: settings.enable_profit_loss_alerts,
        updated_at: new Date().toISOString(),
    };

    // Remove undefined values
    Object.keys(validSettings).forEach(
        (key) => validSettings[key as keyof UserNotificationSettings] === undefined && delete validSettings[key as keyof UserNotificationSettings]
    );

    const { data, error } = await supabase
        .from("user_notification_settings")
        .update(validSettings)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        console.error("Error updating notification settings:", error);
        return null;
    }

    return data;
}

// Function to run asset notifications check
export async function checkAssetNotifications(
    supabase: SupabaseClient
): Promise<unknown> {
    return await supabase.rpc("check_asset_notifications");
}

// Start checking for asset notifications periodically
export function startAssetNotificationChecker(
    supabase: any,
    intervalMs: number = NOTIFICATION_CHECK_TIME
): () => void {
    // Run immediately on start
    checkAssetNotifications(supabase).catch((error) =>
        console.error("Error checking asset notifications:", error)
    );

    // Then run periodically
    const interval = setInterval(() => {
        checkAssetNotifications(supabase).catch((error) =>
            console.error("Error checking asset notifications:", error)
        );
    }, intervalMs);

    return () => clearInterval(interval); // Return cleanup function
}