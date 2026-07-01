export type Paczkomat = {
  id: string;
  name: string;
  display_name?: string;
  address?: { line1?: string; line2?: string };
  address_details?: { city: string; post_code?: string; street?: string; province?: string };
  opening_hours?: string;
};

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
};

export const loadPaczkomaty = async (): Promise<Paczkomat[]> => {
  try {
    const response = await fetch('/data/paczkomaty.json');
    if (!response.ok) throw new Error('Nie udało się załadować bazy');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Błąd ładowania paczkomatów:', error);
    return [];
  }
};