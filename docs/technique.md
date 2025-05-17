## Transaction SQL isolée

Le fichier `db/transaction.sql` contient la transaction suivante :

```sql
BEGIN TRANSACTION;
  INSERT INTO film (titre, duree, annee)
    VALUES ('Le Grand Voyage', 120, 2024);
  INSERT INTO seance (film_id, date_heure, salle_id)
    VALUES (
      (SELECT id FROM film WHERE titre='Le Grand Voyage'),
      '2025-06-01 20:00',
      3
    );
  UPDATE salle
    SET capacite = 150
    WHERE id = 3;
COMMIT;
