/**
 * Default collection of exifFields
 */
const defaultExifFields = [
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
		prop: "exposureFormatted",
		getValue: (metadata) =>  {
			if (metadata.exif?.ExposureTime) {
				const exposureTime = metadata.exif?.ExposureTime;
				
				if (exposureTime < 1) {
					// 1/200
					return `1/` + Math.round(1 / exposureTime);
				} else {
					// 3.5" 1"
					return Number(exposureTime.toFixed(1)) + `"`;
				}
			}
			
			return null;
		}
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
	},
	{
		prop: "gps",
		getValue: (metadata) =>  {
			if (metadata.gps?.longitude && metadata.gps?.latitude) {
				const gpsPoint = {
					type: "Point",
					coordinates: [
						metadata.gps.longitude,
						metadata.gps.latitude
					]
				};
				return gpsPoint;
			}
			return null;
		}
	}
];

module.exports = defaultExifFields;