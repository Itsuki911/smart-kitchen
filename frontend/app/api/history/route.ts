import { NextResponse } from "next/server";
import { HistoryResponse, toRecipeHistoryItem } from "@/lib/recipe";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type RecipeRunRow = {
  created_at: string;
  filenames: string[] | null;
  health_check: Record<string, string> | null;
  id: string;
  message: string;
  recipe: string;
  title: string;
};

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("recipe_runs")
      .select("id, created_at, title, message, recipe, health_check, filenames")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    const items = ((data ?? []) as RecipeRunRow[]).map(toRecipeHistoryItem);
    const response: HistoryResponse = {
      count: items.length,
      items,
    };

    return NextResponse.json(response);
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : "Failed to load history from Supabase.";

    return NextResponse.json({ detail }, { status: 500 });
  }
}
