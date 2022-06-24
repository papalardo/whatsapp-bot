import DropboxService from '../../services/DropboxService.js'
/**
 * @param { import("knex").Knex } table
 * @returns { Promise<void> }
 */
export const seed = async function(table) {
  const images = await DropboxService.instance.filesListFolder({
      path: '/New Stickers',
      limit: 2000,
  });

  const imagesNames = images.result.entries.map((entry) => entry.name);

  await table('stickers').del();
  await table('stickers').insert(imagesNames.map((name) => ({
    name,
    approved: true,
  })));
};
