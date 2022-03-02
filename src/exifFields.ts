import { EXIFField } from "./types";

/**
 * Default collection of exifFields
 */
const defaultExifFields: EXIFField[] = [
	{
		prop: "dateTaken",
		getValue: (metadata) =>  metadata.exif?.CreateDate
	},
	{
		prop: "cameraMake",
		getValue: (metadata) =>  metadata.ifd0?.Make
	},
	{
		prop: "cameraModel",
		getValue: (metadata) =>  metadata.ifd0?.Model
	},
	{
		prop: "iso",
		getValue: (metadata) =>  metadata.exif?.ISO
	},
	{
		prop: "exposure",
		getValue: (metadata) =>  metadata.exif?.ExposureTime
	},
	{
		prop: "aperture",
		getValue: (metadata) =>  metadata.exif?.FNumber
	},
	{
		prop: "focalLength",
		getValue: (metadata) =>  metadata.exif?.FocalLength
	},
	{
		prop: "focalLengthIn35mm",
		getValue: (metadata) =>  metadata.exif?.FocalLengthIn35mmFormat
	},
	{
		prop: "lensMake",
		getValue: (metadata) =>  metadata.exif?.LensMake
	},
	{
		prop: "lensModel",
		getValue: (metadata) =>  metadata.exif?.LensModel
	}
];

export default defaultExifFields;