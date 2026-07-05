export type GalleryItem = { src: string; cat: "aerials" | "front" | "interior" };

const aerials = [
  "DJI_0007", "DJI_0011", "DJI_0012", "DJI_0014", "DJI_0015", "DJI_0016-2",
  "DJI_0016", "DJI_0027", "DJI_0035", "DJI_0037", "DJI_0040", "DJI_0044-2",
  "DJI_0044", "DJI_0050", "DJI_0057", "DJI_0082", "DJI_0092", "DJI_0103",
  "DJI_0111", "DJI_0119",
];

const front = [
  "DJI_0001-2", "DJI_0001-copy", "DJI_0001", "DJI_0003", "DJI_0010",
  "DJI_0011", "DJI_0018", "DJI_0019", "DJI_0021", "DJI_0032", "DJI_0033",
  "DJI_0036", "DJI_0055", "DJI_0078", "DJI_0143", "DJI_0168", "DJI_0214",
  "DSC_3287_Twilight", "DSC_3902", "DSC_4235", "DSC_4331",
  "DSC_5654---Nightshot", "DSC_5794", "DSC_6548", "DSC_6684", "DSC_6856",
  "DSC_7060", "DSC_7224", "DSC_7621", "DSC_8695", "DSC_9217",
];

const interior = [
  "DSC_0019", "DSC_1379", "DSC_2992", "DSC_2995", "DSC_3301", "DSC_3494",
  "DSC_3497", "DSC_3537", "DSC_4342", "DSC_4368", "DSC_4441", "DSC_4449",
  "DSC_4521", "DSC_5074", "DSC_5573", "DSC_5666", "DSC_5714", "DSC_6155",
  "DSC_6251", "DSC_7626", "DSC_7719", "DSC_7896-V1", "DSC_7930", "DSC_8740",
  "DSC_8800",
];

export const GALLERY: GalleryItem[] = [
  ...aerials.map((n) => ({ src: `/images/aerials/${n}.jpg`, cat: "aerials" as const })),
  ...front.map((n) => ({ src: `/images/front/${n}.jpg`, cat: "front" as const })),
  ...interior.map((n) => ({ src: `/images/interior/${n}.jpg`, cat: "interior" as const })),
];

export const CAT_LABELS: Record<string, string> = {
  all: "All",
  aerials: "Aerial & Drone",
  front: "Exteriors",
  interior: "Interiors & Staging",
};
