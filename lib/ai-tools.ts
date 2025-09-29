// AI tools for categorizing and extracting information from user entries

export interface ParsedEntry {
  type: "food" | "exercise";
  name: string;
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  quantity?: string;
  duration?: number; // in minutes for exercise
  caloriesBurned?: number; // for exercise
}

export async function parseUserEntry(userInput: string): Promise<ParsedEntry> {
  // This is a mock implementation. In a real app, you would call an AI service
  // to analyze the user input and extract structured information.

  const input = userInput.toLowerCase();

  // Simple keyword-based categorization (this would be replaced with AI)
  const exerciseKeywords = [
    "run",
    "jog",
    "walk",
    "gym",
    "workout",
    "exercise",
    "bike",
    "swim",
    "yoga",
    "cardio",
    "strength",
  ];
  const foodKeywords = [
    "eat",
    "ate",
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "meal",
    "food",
    "drank",
    "drink",
  ];

  const isExercise = exerciseKeywords.some((keyword) =>
    input.includes(keyword)
  );
  const isFood = foodKeywords.some((keyword) => input.includes(keyword));

  if (isExercise && !isFood) {
    return parseExerciseEntry(userInput);
  } else {
    return parseFoodEntry(userInput);
  }
}

function parseExerciseEntry(input: string): ParsedEntry {
  // Mock exercise parsing - in reality this would use AI
  const exercise = {
    type: "exercise" as const,
    name: extractExerciseName(input),
    duration: extractDuration(input),
    caloriesBurned: estimateCaloriesBurned(input),
  };

  return exercise;
}

function parseFoodEntry(input: string): ParsedEntry {
  // Mock food parsing - in reality this would use AI
  const food = {
    type: "food" as const,
    name: extractFoodName(input),
    quantity: extractQuantity(input),
    calories: estimateCalories(input),
    carbs: estimateCarbs(input),
    protein: estimateProtein(input),
    fat: estimateFat(input),
  };

  return food;
}

function extractExerciseName(input: string): string {
  // Simple extraction - would be replaced with AI
  const exerciseMap: { [key: string]: string } = {
    run: "Running",
    jog: "Jogging",
    walk: "Walking",
    gym: "Gym Workout",
    workout: "Workout",
    bike: "Cycling",
    swim: "Swimming",
    yoga: "Yoga",
    cardio: "Cardio",
    strength: "Strength Training",
  };

  for (const [keyword, name] of Object.entries(exerciseMap)) {
    if (input.includes(keyword)) {
      return name;
    }
  }

  return "Exercise";
}

function extractDuration(input: string): number {
  // Extract duration in minutes
  const durationMatch = input.match(/(\d+)\s*(min|minutes?|hour|hours?)/);
  if (durationMatch) {
    const value = parseInt(durationMatch[1]);
    const unit = durationMatch[2];

    if (unit.includes("hour")) {
      return value * 60;
    }
    return value;
  }

  // Default duration based on exercise type
  const inputLower = input.toLowerCase();
  if (inputLower.includes("run") || inputLower.includes("jog")) return 30;
  if (inputLower.includes("walk")) return 45;
  if (inputLower.includes("gym") || inputLower.includes("workout")) return 60;
  if (inputLower.includes("yoga")) return 60;

  return 30; // Default
}

function estimateCaloriesBurned(input: string): number {
  // Simple estimation - would be replaced with AI
  const duration = extractDuration(input);
  const inputLower = input.toLowerCase();

  let caloriesPerMinute = 8; // Default

  if (inputLower.includes("run") || inputLower.includes("jog"))
    caloriesPerMinute = 12;
  else if (inputLower.includes("walk")) caloriesPerMinute = 5;
  else if (inputLower.includes("gym") || inputLower.includes("workout"))
    caloriesPerMinute = 10;
  else if (inputLower.includes("bike")) caloriesPerMinute = 9;
  else if (inputLower.includes("swim")) caloriesPerMinute = 11;
  else if (inputLower.includes("yoga")) caloriesPerMinute = 4;

  return Math.round(duration * caloriesPerMinute);
}

function extractFoodName(input: string): string {
  // Simple extraction - would be replaced with AI
  const foodMap: { [key: string]: string } = {
    oatmeal: "Oatmeal",
    chicken: "Chicken",
    salad: "Salad",
    pizza: "Pizza",
    pasta: "Pasta",
    rice: "Rice",
    bread: "Bread",
    apple: "Apple",
    banana: "Banana",
    coffee: "Coffee",
    tea: "Tea",
    water: "Water",
    smoothie: "Smoothie",
    sandwich: "Sandwich",
    burger: "Burger",
    eggs: "Eggs",
    milk: "Milk",
    yogurt: "Yogurt",
    cheese: "Cheese",
    nuts: "Nuts",
  };

  for (const [keyword, name] of Object.entries(foodMap)) {
    if (input.includes(keyword)) {
      return name;
    }
  }

  // If no specific food found, try to extract a reasonable name
  const words = input.split(" ").filter((word) => word.length > 2);
  if (words.length > 0) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }

  return "Food Item";
}

function extractQuantity(input: string): string {
  // Extract quantity information
  const quantityMatch = input.match(
    /(\d+(?:\.\d+)?)\s*(cup|cups|bowl|bowls|slice|slices|piece|pieces|gram|grams|kg|lb|pound|pounds|ml|liter|oz|ounce|ounces)/
  );
  if (quantityMatch) {
    return `${quantityMatch[1]} ${quantityMatch[2]}`;
  }

  // Look for simple numbers
  const numberMatch = input.match(/(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    return numberMatch[1];
  }

  return "1 serving";
}

function estimateCalories(input: string): number {
  // Simple estimation - would be replaced with AI
  const foodName = extractFoodName(input).toLowerCase();
  const quantity = extractQuantity(input);

  const calorieMap: { [key: string]: number } = {
    oatmeal: 150,
    chicken: 200,
    salad: 100,
    pizza: 300,
    pasta: 200,
    rice: 150,
    bread: 80,
    apple: 80,
    banana: 100,
    coffee: 5,
    tea: 2,
    water: 0,
    smoothie: 200,
    sandwich: 300,
    burger: 500,
    eggs: 150,
    milk: 150,
    yogurt: 100,
    cheese: 100,
    nuts: 200,
  };

  const baseCalories = calorieMap[foodName] || 200;

  // Adjust based on quantity
  const quantityMatch = quantity.match(/(\d+(?:\.\d+)?)/);
  if (quantityMatch) {
    const multiplier = parseFloat(quantityMatch[1]);
    return Math.round(baseCalories * multiplier);
  }

  return baseCalories;
}

function estimateCarbs(input: string): number {
  const calories = estimateCalories(input);
  // Rough estimate: 50% of calories from carbs
  return Math.round((calories * 0.5) / 4); // 4 calories per gram of carbs
}

function estimateProtein(input: string): number {
  const calories = estimateCalories(input);
  // Rough estimate: 20% of calories from protein
  return Math.round((calories * 0.2) / 4); // 4 calories per gram of protein
}

function estimateFat(input: string): number {
  const calories = estimateCalories(input);
  // Rough estimate: 30% of calories from fat
  return Math.round((calories * 0.3) / 9); // 9 calories per gram of fat
}
