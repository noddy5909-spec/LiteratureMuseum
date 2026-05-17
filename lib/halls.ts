export type MuseumHall = {
  id: string;
  number: number;
  label: string;
};

export const MUSEUM_HALLS: MuseumHall[] = Array.from({ length: 12 }, (_, i) => {
  const number = i + 1;
  return {
    id: `hall-${number}`,
    number,
    label: `${number}관`,
  };
});

export function getHallById(id: string): MuseumHall | undefined {
  return MUSEUM_HALLS.find((hall) => hall.id === id);
}
