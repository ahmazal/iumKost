This folder contains SQL migrations to apply to the database for schema changes.

001-make-id_kamar-nullable.sql
- Makes `tagihan.Id_Kamar` allow NULL and recreates the foreign key to `kamar` with `ON DELETE SET NULL`.

How to run:
- Backup your database first.
- Use your preferred MySQL client (mysql CLI, MySQL Workbench, phpMyAdmin).

Example using `mysql` CLI:

```powershell
mysql -u <user> -p <database_name> < migrations/001-make-id_kamar-nullable.sql
```

If the foreign key name differs, inspect using:

```sql
SELECT constraint_name FROM information_schema.key_column_usage
WHERE table_name='tagihan' AND referenced_table_name='kamar';
```

Then update the DROP FOREIGN KEY line accordingly.
