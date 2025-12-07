-- Migration: Make tagihan.Id_Kamar nullable and set FK to ON DELETE SET NULL
-- Backup your database before running these commands.

-- 1) Modify column to allow NULL
ALTER TABLE tagihan MODIFY Id_Kamar int(11) DEFAULT NULL;

-- 2) Drop existing foreign key (name may vary). If the FK name is different, replace accordingly.
ALTER TABLE tagihan DROP FOREIGN KEY tagihan_ibfk_1;

-- 3) Recreate foreign key to set NULL on delete
ALTER TABLE tagihan
  ADD CONSTRAINT tagihan_ibfk_1
  FOREIGN KEY (Id_Kamar) REFERENCES kamar (Id_Kamar)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- If your foreign key name differs, find it with:
-- SELECT constraint_name FROM information_schema.key_column_usage WHERE table_name='tagihan' AND referenced_table_name='kamar';
