import { defineHook } from "@directus/extensions-sdk";
import { FilterHandler } from "@directus/shared/types";
import { File, FileMetadata, ExifCollection } from "./types";
import defaultExifFields from "./exifFields";
import { EXIF_COLLECTIONS, DEBUG } from "./config";

// This file is the guts. You shouldn't change anything in this file unless you know what you are doing. See `src/config.ts` for configuring.

const generateExifAttacher = (services: any, exifCollection: ExifCollection) => {
	return async function(item, meta, context) {
		const collectionSchema = context.schema?.collections[exifCollection.name]
		const imageFieldKey = exifCollection.imageFieldKey || "image";
		const imageId = item.hasOwnProperty(imageFieldKey) ? item[imageFieldKey] : undefined;

		DEBUG && console.log(`${exifCollection.name} attachExifData info:`, {
			item,
			meta,
			collectionSchema,
			imageFieldKey,
			imageId
		});
	
		if (imageId) {
			const exifFields = exifCollection.exifFields || defaultExifFields;

			// delete existing exif data since image changed
			exifFields.map(field => {
				if (collectionSchema?.fields.hasOwnProperty(field.prop)) {
					item[field.prop] = null
				}
			});
	
			if (services && services.ItemsService) {
				const filesService = new services.ItemsService("directus_files", {
					schema: context.schema
				});
				const imageInfo = await filesService.readOne(imageId) as File;

				DEBUG && console.log(`${exifCollection.name} attachExifData imageInfo:`, {
					imageInfo
				});
	
				if (imageInfo && imageInfo.metadata) {
					exifFields.map(field => {
						if (collectionSchema?.fields.hasOwnProperty(field.prop)) {
							item[field.prop] = field.getValue(imageInfo.metadata as FileMetadata) || null;
						} else {
							DEBUG && console.log(`${exifCollection.name} attachExifData fieldMissing:`, {
								fieldProp: field.prop
							});
						}
					});
				}
			}
	
			DEBUG && console.log(`${exifCollection.name} attachExifData updated:`, {
				item
			});
		} else {
			DEBUG && console.log(`${exifCollection.name} attachExifData noImage`);
		}
	
		return item;
	} as FilterHandler
};

export default defineHook(({ filter }, { services }) => {
	// create listeners for all collections
	EXIF_COLLECTIONS.map(exifCollection => {
		const attachExifData = generateExifAttacher(services, exifCollection);

		filter(`${exifCollection.name}.items.create`, attachExifData);
		filter(`${exifCollection.name}.items.update`, attachExifData);
	});
});
