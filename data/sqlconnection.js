var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
TYPES = require('tedious').TYPES;
var PersonIdCount = Math.floor(Math.random() * 100000);
var ItemIdCount = Math.floor(Math.random() * 100000);;

module.exports = {
    addUser: function(name, balance) {
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
        var request = new Request("INSERT INTO Users (PersonId, Name, Balance) VALUES (@personid, @pname, @pbalance)",
            function(err){
                if(err){
                    console.log(err);
                };
            });

            request.addParameter('personid', TYPES.Int, PersonIdCount);
            request.addParameter('pname', TYPES.NVarChar, name);
            request.addParameter('pbalance', TYPES.Decimal, balance);

            connection.execSql(request);
        };
    },

    addAccount: function(username, name, cost, balance) {
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
        var request = new Request("INSERT INTO Items (ItemId, PersonId, Name, Cost, Balance) VALUES (@itemid, @personid, @itemname, @itemcost, @itembalance)",
            function(err){
                if(err){
                    console.log(err);
                };
            });

            request.addParameter('itemid', TYPES.Int, ItemIdCount);
            request.addParameter('personid', TYPES.Int, "SELECT Users.PersonId WHERE Users.Name = username");
            request.addParameter('itemname', TYPES.NVarChar, name);
            request.addParameter('itemcost', TYPES.Decimal, cost);
            request.addParameter('itembalance', TYPES.Decimal, balance);

            connection.execSql(request);
        };
    },
    
    getUser: function(name, session) {
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
                console.log('Reading rows from the Table...');

                var value = "SELECT Balance FROM Users WHERE Name='" + name + "'";
                var balance = 0;

                // Read all rows from table
                request = new Request(
                    value,
                    function(err, rowCount, rows) {
                        console.log(rowCount + ' row(s) returned');
                        session.send('Ok... your balance is $' + balance)
                        return;
                        ///return balance;
                    }
                );
                
                request.addParameter('pname', TYPES.NVarChar, name);
                console.log("pname something");
                request.on('row', function(columns) {
                    columns.forEach(function(column) {
                        console.log("we got here: ", column.value);
                        balance = column.value;
                    });
                });

                connection.execSql(request);
                console.log("executed");
                }
        });
    }

    /*
    updateUser: function() {
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
    */
}