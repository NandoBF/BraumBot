const fs = require('fs');

function backupDatabase(path_database){
    fs.copyFile(path_database, './backups/database.sqlite', (error) => {
        if(error) console.log(error);
        else console.log('DATABASE BACKUP SUCCESSFULL');
    })
}

module.exports = {backupDatabase};