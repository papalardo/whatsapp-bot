/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.createTable("stickers", (table) => {
        table.increments();
        table.string('name').notNullable();
        table.boolean('approved').default(false);
        table.timestamp('created_at').notNullable().defaultTo(Database.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updated_at').notNullable().defaultTo(Database.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  
};
