export type RecipeHistoryItem = {
  created_at: string;
  filenames: string[];
  health_check: Record<string, string>;
  id: string;
  message: string;
  recipe: string;
  title: string;
};

export type HistoryResponse = {
  count: number;
  items: RecipeHistoryItem[];
};

export type HealthFormState = {
  currentCondition: string;
  dietaryNotes: string;
  craving: string;
};

type RecipeRunRecord = {
  created_at: string;
  filenames: string[] | null;
  health_check: Record<string, string> | null;
  id: string;
  message: string;
  recipe: string;
  title: string;
};

export const HEALTH_FIELDS = [
  {
    key: "currentCondition",
    label: "Current condition",
    placeholder: "Example: I want something warm and light because I feel tired today.",
  },
  {
    key: "dietaryNotes",
    label: "Dietary notes",
    placeholder: "Example: Please avoid spicy food and keep the seasoning gentle.",
  },
  {
    key: "craving",
    label: "Today's craving",
    placeholder: "Example: I want a comforting soup with a Japanese home-cooking feeling.",
  },
] as const;

export const MISO_SOUP_RECIPE = `Classic Miso Soup

Ingredients:
- 4 cups dashi stock
- 3 tablespoons miso paste
- 150 g soft tofu, cut into small cubes
- 2 tablespoons dried wakame seaweed
- 2 green onions, thinly sliced

Instructions:
1. Heat the dashi stock in a pot over medium heat until hot, but do not let it boil.
2. Soak the wakame in water for 5 minutes, then drain it.
3. Add the tofu and wakame to the pot and warm them gently for 2 minutes.
4. Put the miso paste in a small bowl, add a ladle of hot dashi, and stir until smooth.
5. Return the dissolved miso to the pot and mix gently.
6. Turn off the heat before the soup starts to boil, then finish with sliced green onions.
`;

export const FIXED_RECIPE_MESSAGE = "Fixed recipe generated and saved to Supabase.";

export function buildHealthCheck(form: HealthFormState): Record<string, string> {
  return {
    "Current condition": form.currentCondition.trim(),
    "Dietary notes": form.dietaryNotes.trim(),
    "Today's craving": form.craving.trim(),
  };
}

export function validateHealthCheck(healthCheck: Record<string, string>): string | null {
  const missingLabels = Object.entries(healthCheck)
    .filter(([, value]) => !value.trim())
    .map(([label]) => label);

  if (missingLabels.length === 0) {
    return null;
  }

  return `Please complete all health check fields before running the recipe demo: ${missingLabels.join(", ")}.`;
}

export function toRecipeHistoryItem(record: RecipeRunRecord): RecipeHistoryItem {
  return {
    created_at: record.created_at,
    filenames: record.filenames ?? [],
    health_check: record.health_check ?? {},
    id: record.id,
    message: record.message,
    recipe: record.recipe,
    title: record.title,
  };
}
