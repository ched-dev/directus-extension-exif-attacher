import { defineHook } from "@directus/extensions-sdk";
import { FilterHandler } from "@directus/shared/types";
import { File, FileMetadata, ExifCollection } from "./types";
// @ts-ignore
import defaultExifFields from "./exifFields";
// @ts-ignore
import { env, DEBUG } from "./config";
// @ts-ignore
import exifDataModels from "./generated-exif-data-models";

// This file is the guts. You shouldn't change anything in this file unless you know what you are doing. See `src/config.ts` for configuring.

const EXIF_COLLECTIONS: ExifCollection[] = exifDataModels.map((dataModel: any) => ({
	...dataModel,
	fields: dataModel.fields.map((fieldName: string) => defaultExifFields.find((exifField: any) => exifField.prop === fieldName))
}))

const generateExifAttacher = (services: any, exifCollection: ExifCollection) => {
	return async function(item, meta, context) {
		const collectionSchema = context.schema?.collections[exifCollection.name]
		const imageFieldName = exifCollection.imageFieldName || "image";
		const imageId = item.hasOwnProperty(imageFieldName) ? item[imageFieldName] : undefined;

		DEBUG && console.log(`${exifCollection.name} attachExifData info:`, {
			item,
			meta,
			collectionSchema,
			imageFieldName,
			imageId
		});
	
		if (imageId) {
			const exifFields = exifCollection.fields || defaultExifFields;

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
	EXIF_COLLECTIONS.map((exifCollection: ExifCollection) => {
		const attachExifData = generateExifAttacher(services, exifCollection);

		filter(`${exifCollection.name}.items.create`, attachExifData);
		filter(`${exifCollection.name}.items.update`, attachExifData);
		console.log(`exif-attacher listening for:`, [
			`${exifCollection.name}.items.create`,
			`${exifCollection.name}.items.update`
		]);
	});
});
