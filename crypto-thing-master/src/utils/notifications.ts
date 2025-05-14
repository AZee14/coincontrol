// Utility Function to create notifications
// Add this to a file like utils/notifications.ts or similar

interface NotificationOptions {
  type?: string;
  relatedEntityId?: string | number | null;
  relatedEntityType?: string | null;
}

interface SupabaseClient {
  from: (table: string) => {
    insert: (data: Record<string, any>) => Promise<any>;
  };
}

export async function createNotification(
  supabase: SupabaseClient,
  userId: string | number,
  message: string,
  options: NotificationOptions = {}
): Promise<any> {
  const {
    type = "system",
    relatedEntityId = null,
    relatedEntityType = null,
  } = options;

  return await supabase.from("notifications").insert({
    user_id: userId,
    message,
    type,
    related_entity_id: relatedEntityId,
    related_entity_type: relatedEntityType,
  });
}

// Usage examples:
// Price Alert: await createNotification(supabase, userId, "Bitcoin price increased by 5%", { type: "price_alert", relatedEntityId: coinId, relatedEntityType: "coin" });
// Portfolio: await createNotification(supabase, userId, "Your portfolio value increased by 10%", { type: "portfolio", relatedEntityId: portfolioId, relatedEntityType: "portfolio" });
// Transaction: await createNotification(supabase, userId, "Transaction completed", { type: "transaction", relatedEntityId: transactionId, relatedEntityType: "transaction" });
