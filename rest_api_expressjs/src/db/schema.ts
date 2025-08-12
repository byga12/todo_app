import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
    id: int().notNull().unique().primaryKey({ autoIncrement: true }),
    username: text().notNull().unique(),
    password: text().notNull(),
    email: text().notNull().unique(),
    birth_date: text().notNull() //YYYY-MM-DD
});

export const todosTable = sqliteTable("todos",{
    id: int().primaryKey({autoIncrement:true}),
    userId: int("user_id").references(()=>usersTable.id).notNull(),
    title: text().notNull(),
    description: text().default(""),
    done: int({mode:"boolean"}).notNull().default(false),
    archived: int({mode:"boolean"}).notNull().default(false), //para mover a una papelera de reciclaje
    creationDate: text("creation_date").default(sql`(CURRENT_DATE)`).notNull(),
});

export type SelectUser = typeof usersTable.$inferSelect;