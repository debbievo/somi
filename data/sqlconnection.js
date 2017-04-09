var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

module.exports = {
    insertrow: function() {
        // Create connection to database
        var config = {
            userName: 'tpan', // update me
            password: 'Tp2535989', // update me
            server: 'somi.database.windows.net', // update me
            options: {
                encrypt: true, database: 'somi' //update me
            }
        }

        var connection = new Connection(config);

        // Attempt to connect and execute queries if connection goes through
        connection.on('connect', function(err) {
            if (err) {
                console.log(err)
            }
            else{
                insertIntoDatabase()
            }
        });

        function insertIntoDatabase(){
            console.log("Inserting profile...");
            request = new Request(
                "INSERT INTO Users.info (Name, Balance) OUTPUT INSERTED.ProductID VALUES ('BrandNewProduct', '200989', 'Blue', 75, 80, '7/1/2016')",
                function(err, rowCount, rows) {
                    console.log(rowCount + ' row(s) inserted');
                }
            );
            connection.execSql(request);
        }
    },

    readrow: function() {
        // Create connection to database
        var config = {
            userName: 'tpan', // update me
            password: 'Tp2535989', // update me
            server: 'somi.database.windows.net', // update me
            options: {
                encrypt: true, database: 'somi' //update me
            }
        }
        var connection = new Connection(config);

        // Attempt to connect and execute queries if connection goes through
        connection.on('connect', function(err) {
            if (err) {
                console.log(err)
            }
            else{
                queryDatabase()
            }
        });

        function queryDatabase(){
            console.log('Reading rows from the Table...');

            // Read all rows from table
            request = new Request(
                "SELECT TOP 1 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid",
                function(err, rowCount, rows) {
                    console.log(rowCount + ' row(s) returned');
                }
            );

            request.on('row', function(columns) {
                columns.forEach(function(column) {
                    console.log("%s\t%s", column.metadata.colName, column.value);
                });
            });

            connection.execSql(request);
        }
    },

    updaterow: function() {
        // Create connection to database
        var config = {
            userName: 'tpan', // update me
            password: 'Tp2535989', // update me
            server: 'somi.database.windows.net', // update me
            options: {
                encrypt: true, database: 'somi' //update me
            }
        }

        var connection = new Connection(config);

        // Attempt to connect and execute queries if connection goes through
        connection.on('connect', function(err) {
            if (err) {
                console.log(err)
            }
            else{
                updateInDatabase()
            }
        });

        function updateInDatabase(){
            console.log("Updating the price of the brand new product in database...");
            request = new Request(
                "UPDATE SalesLT.Product SET ListPrice = 50 WHERE Name = 'BrandNewProduct'",
                function(err, rowCount, rows) {
                    console.log(rowCount + ' row(s) updated');
                }
            );
            connection.execSql(request);
        }
    }
}