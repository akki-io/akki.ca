---
title: How to effectively import large MS Access DB to MySQL DB
path: /blog/how-to-effectively-import-large-ms-access-db-to-mysql-db
date: 2019-05-17
tags: ['MYSQL', 'ACCESS' ,'DATABASE']
featureImage: ./images/shutterstock_579290236-min.jpg
---

## Who is this article for?

Anyone looking for how to import large MS Access DB to MySQL DB effectively.

## Before You Begin

There are several options which we can use to import the data to MySQL. Few of those are listed in these articles below -

[https://stackoverflow.com/questions/5722544/how-can-i-convert-an-mdb-access-file-to-mysql-or-plain-sql-file](https://stackoverflow.com/questions/5722544/how-can-i-convert-an-mdb-access-file-to-mysql-or-plain-sql-file)

[https://stackoverflow.com/questions/4809654/how-to-import-an-access-mdb-format-database-to-mysql](https://stackoverflow.com/questions/4809654/how-to-import-an-access-mdb-format-database-to-mysql)

[https://stackoverflow.com/questions/5465661/converting-mysql-to-ms-access](https://stackoverflow.com/questions/5465661/converting-mysql-to-ms-access)

These options work well if the data that needs to be imported is small but is very slow for an extensive database. The reason the import is very slow is that it creates one insert statement per record. I recently had to convert a relatively large MS Access DB file to MySQL. The import process was prolonged, and I let it run overnight, but it didn't complete. So I had to come up with a different solution which can import the data much faster.

For this post, we can use the data provided by IPEDS. The file can be downloaded from here - [https://nces.ed.gov/ipeds/use-the-data/download-access-database](https://nces.ed.gov/ipeds/use-the-data/download-access-database). We will use the 2017-18 Access file, which is the latest release at the time of writing this article.

Also, we are going to use **mdbtools**. I believe you can install it on Windows Operating system too - [https://github.com/brianb/mdbtools/issues/107](https://github.com/brianb/mdbtools/issues/107). Since I run a Linux distribution installing it was an easy setup.

## Script

```bash
#!/bin/bash
#===========================================================
# FILE        : script.sh
# DESCRIPTION : Convert MS Access to MySQL.
#===========================================================
set -o nounset # help avoid bugs
shopt -s extglob
PATH=/bin:/usr/bin:/sbin # for consistency

# variables declaration
DB_NAME=ENTER_YOUR_DB_NAME
DB_UN=ENTER_YOUR_DB_USER
PATH_TO_ACCESS_FILE=ENTER_THE_ABSOLUTE_PATH_TO_ACCESS_FILE

# set login path to suppress warnings
mysql_config_editor remove --login-path=local
mysql_config_editor set --login-path=local --host=localhost --user=$DB_UN --password

# get all the tables
TABLES=$(mdb-tables -1 $PATH_TO_ACCESS_FILE)

# drop tables if exits
echo "$(date +%Y%m%d_%H%M) DROPPING TABLE IF EXISTS"
for t in $TABLES
do
    mysql --login-path=local $DB_NAME -Bse "DROP TABLE IF EXISTS $t;"
done

# create meta definition for the tables
rm -rf meta.sql
mdb-schema $PATH_TO_ACCESS_FILE mysql > meta.sql

# create the tables using the meta.sql file generated above
echo "$(date +%Y%m%d_%H%M) CREATING TABLES;"
mysql --login-path=local $DB_NAME < meta.sql
rm -rf meta.sql

echo "$(date +%Y%m%d_%H%M) IMPORTING DATA INTO TABLES;"
for t in $TABLES
do
    echo "$(date +%Y%m%d_%H%M) IMPORTING DATA FOR $t;"
    rm -rf $t.csv
    mdb-export -D '%Y-%m-%d %H:%M:%S' $PATH_TO_ACCESS_FILE $t > $t.csv
    mysqlimport --login-path=local --ignore-lines=1 --fields-terminated-by=, --fields-optionally-enclosed-by='"' --local $DB_NAME $t.csv
    mysql --login-path=local $DB_NAME -Bse "ALTER TABLE $t CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;"
    rm -rf $t.csv
done

echo "$(date +%Y%m%d_%H%M) COMPLETED;"
```

## Conclusion

When I used this script, I was able to import the data in less than a few minutes. A general outline of how the script works.

1.  Creates `login path` to suppress warnings.
2.  Drops tables if they exist from the specified database.
3.  Recreate the table metadata from MS Access.
4.  Export each table to `.csv` file.
5.  Bulk import the `.csv` data to the specified table.

## Limitations

*   The above script is tested on a Linux distribution.
*   mdbtools does not create indexes or foreign key references.

## Sources

*   [https://stackoverflow.com/questions/5722544/how-can-i-convert-an-mdb-access-file-to-mysql-or-plain-sql-file](https://stackoverflow.com/questions/5722544/how-can-i-convert-an-mdb-access-file-to-mysql-or-plain-sql-file)
*   [https://stackoverflow.com/questions/4809654/how-to-import-an-access-mdb-format-database-to-mysql](https://stackoverflow.com/questions/4809654/how-to-import-an-access-mdb-format-database-to-mysql)
*   [https://stackoverflow.com/questions/5465661/converting-mysql-to-ms-access](https://stackoverflow.com/questions/5465661/converting-mysql-to-ms-access)
*   [https://nces.ed.gov/ipeds/use-the-data/download-access-database](https://nces.ed.gov/ipeds/use-the-data/download-access-database)
*   [https://github.com/brianb/mdbtools](https://github.com/brianb/mdbtools)
*   [https://github.com/lsgunth/mdbtools-win](https://github.com/lsgunth/mdbtools-win)
