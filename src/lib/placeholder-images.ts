import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Define the structure of the imported JSON file
interface PlaceholderData {
  placeholderImages: ImagePlaceholder[];
}

const typedData = data as PlaceholderData;

export const placeholderImages: ImagePlaceholder[] = typedData.placeholderImages;

