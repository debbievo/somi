-- Insert rows into table 'Employees'
INSERT INTO Users
   ([PersonId],[Name],[Balance], [ItemId])
VALUES
   ( 1, N'Jared', 840.05, 1),
   ( 2, N'Nikita', 7100, 2),
   ( 3, N'Tom', 950.55, 3),
   ( 4, N'Jake', 3225.12, 4)
INSERT INTO Items
   ([ItemId], [PersonId], [Name], [Cost], [Balance])
VALUES
   ( 1, 1, N'Bills', 50, 2),
   ( 2, 1, N'Car', 1000, 100),
   ( 3, 2, N'School', 200, 100),
   ( 4, 3, N'Xbox', 375, 0),
   ( 5, 4, N'Food', 120, 0),
   ( 6, 4, N'House', 550, 300)
GO
SELECT Items.Name, Items.Cost, Items.Balance, Users.Name, Users.Balance
FROM Items, Users
WHERE Users.PersonId = Items.PersonId;
GO
