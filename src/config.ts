import { ExifCollection } from "./types";
import defaultExifFields from "./exifFields";

/**
 * Configuration for each collection and fields to listen to
 * You will need to change the `name` to match your Collection name
 */
export const EXIF_COLLECTIONS: ExifCollection[] = [
  {
    name: "media_library",
    imageFieldKey: "image",
    exifFields: defaultExifFields
  }
]

/**
 * Debugging will `console.log()` data
 */
export const DEBUG = true