/**
 * Default collection of exifFields
 */
const defaultExifFields = [
	{
		prop: "date_taken",
		getValue: (metadata) =>  metadata.exif?.CreateDate
	},
	{
		prop: "camera_make",
		getValue: (metadata) =>  metadata.ifd0?.Make
	},
	{
		prop: "camera_model",
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
		prop: "exposure_formatted",
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
		prop: "focal_length",
		getValue: (metadata) =>  metadata.exif?.FocalLength
	},
	{
		prop: "focal_length_in_35mm",
		getValue: (metadata) =>  metadata.exif?.FocalLengthIn35mmFormat
	},
	{
		prop: "lens_make",
		getValue: (metadata) =>  metadata.exif?.LensMake
	},
	{
		prop: "lens_model",
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