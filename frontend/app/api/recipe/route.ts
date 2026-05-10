import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  FIXED_RECIPE_MESSAGE,
  MISO_SOUP_RECIPE,
  buildHealthCheck,
  toRecipeHistoryItem,
  validateHealthCheck,
} from "@/lib/recipe";
import { createSupabaseAdminClient, getStorageBucketName } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type RecipeRunInsert = {
  filenames: string[];
  health_check: Record<string, string>;
  id: string;
  message: string;
  recipe: string;
  storage_paths: string[];
  title: string;
};

type RecipeRunRow = {
  created_at: string;
  filenames: string[] | null;
  health_check: Record<string, string> | null;
  id: string;
  message: string;
  recipe: string;
  title: string;
};

function sanitizeFilename(filename: string, index: number): string {
  const segments = filename.split(".");
  const extension = segments.length > 1 ? `.${segments.pop()?.toLowerCase() ?? ""}` : "";
  const stem = (segments.join(".") || `image-${index + 1}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${stem || `image-${index + 1}`}${extension}`;
}

function getTextField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const healthCheck = buildHealthCheck({
      currentCondition: getTextField(formData, "current_condition"),
      dietaryNotes: getTextField(formData, "dietary_notes"),
      craving: getTextField(formData, "craving"),
    });
    const validationError = validateHealthCheck(healthCheck);

    if (validationError) {
      return NextResponse.json({ detail: validationError }, { status: 400 });
    }

    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File);

    if (files.length !== 3) {
      return NextResponse.json(
        { detail: "Please upload exactly 3 images." },
        { status: 400 },
      );
    }

    const runId = randomUUID();
    const supabase = createSupabaseAdminClient();
    const bucketName = getStorageBucketName();
    const filenames = files.map((file) => file.name || "unknown");
    const storagePaths: string[] = [];

    for (const [index, file] of files.entries()) {
      const storagePath = `recipe-runs/${runId}/${String(index + 1).padStart(2, "0")}-${sanitizeFilename(file.name || "image", index)}`;
      const fileBody = Buffer.from(await file.arrayBuffer());
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, fileBody, {
          cacheControl: "3600",
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
      }

      storagePaths.push(storagePath);
    }

    const payload: RecipeRunInsert = {
      filenames,
      health_check: healthCheck,
      id: runId,
      message: FIXED_RECIPE_MESSAGE,
      recipe: MISO_SOUP_RECIPE,
      storage_paths: storagePaths,
      title: "Miso Soup Recipe",
    };

    const { data, error } = await supabase
      .from("recipe_runs")
      .insert(payload)
      .select("id, created_at, title, message, recipe, health_check, filenames")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(toRecipeHistoryItem(data as RecipeRunRow));
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : "Failed to create the recipe result in Supabase.";

    return NextResponse.json({ detail }, { status: 500 });
  }
}
