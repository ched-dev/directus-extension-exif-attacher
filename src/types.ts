/**
 * A simplified version of the original Directus File type with metadata support
 */
export type File = {
	id: string; // uuid
	filename_disk: string;
	metadata: FileMetadata | null;
}

/**
 * Data Type for the file metadata property
 */
export interface FileMetadata {
	"iptc": {
		"ApplicationRecordVersion": string; // "\u0000\u0004",
		"DateCreated": string; // "20200718",
		"TimeCreated": string; // "142730",
		"DigitalCreationDate": string; // "20200718",
		"DigitalCreationTime": string; // "142730"
	},
	"ifd0": {
		"Make": string; // "FUJIFILM",
		"Model": string; // "X-T3",
		"XResolution": number; // 240,
		"YResolution": number; // 240,
		"ResolutionUnit": string; // "inches",
		"Software": string; // "Adobe Lightroom 5.2 (Macintosh)",
		"ModifyDate": Date; // "2022-02-26T19:38:00.000Z"
	},
	"ifd1": {
		"Compression": number; // 6,
		"XResolution": number; // 72,
		"YResolution": number; // 72,
		"ResolutionUnit": string; // "inches",
		"ThumbnailOffset": number; // 1214,
		"ThumbnailLength": number; // 10415
	},
	"exif": {
		"ExposureTime": number; // 0.0018181818181818182,
		"FNumber": number; // 4,
		"ExposureProgram": string; // "Aperture priority",
		"ISO": number; // 160,
		"SensitivityType": number; // 1,
		"ExifVersion": string; // "2.3.1",
		"DateTimeOriginal": Date; // "2020-07-18T14:27:30.000Z",
		"CreateDate": Date; // "2020-07-18T14:27:30.000Z",
		"OffsetTime": string; // "-07:00",
		"ShutterSpeedValue": number; // 9.103288,
		"ApertureValue": number; // 4,
		"BrightnessValue": number; // 7.55,
		"ExposureCompensation": number; // 0,
		"MaxApertureValue": number; // 3,
		"MeteringMode": string; // "Pattern",
		"LightSource": string; // "Unknown",
		"Flash": string; // "Flash did not fire",
		"FocalLength": number; // 140,
		"ColorSpace": number; // 1,
		"FocalPlaneXResolution": number; // 2655.3432006835938,
		"FocalPlaneYResolution": number; // 2655.3432006835938,
		"FocalPlaneResolutionUnit": string; // "Centimeter",
		"SensingMethod": string; // "One-chip color area sensor",
		"FileSource": string; // "Digital Camera",
		"SceneType": string; // "Directly photographed",
		"CustomRendered": string; // "Normal",
		"ExposureMode": string; // "Auto",
		"WhiteBalance": string; // "Auto",
		"FocalLengthIn35mmFormat": number; // 210,
		"SceneCaptureType": string; // "Standard",
		"Sharpness": string; // "Normal",
		"SubjectDistanceRange": string; // "Unknown",
		"SerialNumber": string; // "XXXXXX",
		"LensInfo": number[
			// 50,
			// 140,
			// 2.8,
			// 2.8
		],
		"LensMake": string; // "FUJIFILM",
		"LensModel": string; // "XF50-140mmF2.8 R LM OIS WR",
		"LensSerialNumber": string; // "XXXXXX"
	},
	"gps": {
		"GPSVersionID": string; // "2.2.0.0",
		"GPSLatitudeRef": string; // "N",
		"GPSLatitude": number[
			// 39,
			// 35.3196,
			// 0
		],
		"GPSLongitudeRef": string; // "W",
		"GPSLongitude": number[
			// 106,
			// 2.68974,
			// 0
		],
		"GPSAltitude": number; // 0,
		"GPSTimeStamp": string; // "20:19:18",
		"GPSSpeedRef": string; // "K",
		"GPSSpeed": number; // 0,
		"GPSMapDatum": string; // "WGS-84",
		"GPSDateStamp": string; // "2020:07:18",
		"latitude": number; // 39.58866,
		"longitude": number; // -106.044829
	}
}

/**
 * A Directus GPS Point column data type
 */
export type GPSPoint = {
	type: "Point";
	coordinates: [
		FileMetadata["gps"]["longitude"],
		FileMetadata["gps"]["latitude"]
	];
}

/**
 * Internal type used to copy / remove field values from Data Model
 */
 export interface EXIFField {
	prop: string;
	getValue: (metadata: FileMetadata) => string | number | Date | GPSPoint | undefined | null;
}

/**
 * Configuration object used for listening & copying / removing field values
 */
export interface ExifCollection {
	name: string; // Directus Collection name
	imageFieldName: string; // Collection field key for image (default "image")
	fields: EXIFField[]; // Exif fields to grab (defualt defaultExifFields)
}