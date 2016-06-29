# muchhack

Please set up your database with this configuration:

TABLE: asset
+----------------+---------------+------+-----+---------+-------+
| Field          | Type          | Null | Key | Default | Extra |
+----------------+---------------+------+-----+---------+-------+
| name           | varchar(128)  | YES  |     | NULL    |       |
| tags           | varchar(1024) | YES  |     | NULL    |       |
| category       | varchar(64)   | YES  |     | NULL    |       |
| context        | varchar(255)  | YES  |     | NULL    |       |
| description    | text          | YES  |     | NULL    |       |
| definition     | text          | YES  |     | NULL    |       |
| asset_uri      | varchar(2083) | YES  |     | NULL    |       |
| preview_uri    | varchar(2083) | YES  |     | NULL    |       |
| version        | varchar(24)   | YES  |     | NULL    |       |
| upload_date    | datetime      | YES  |     | NULL    |       |
| download_count | int(11)       | YES  |     | NULL    |       |
| view_count     | int(11)       | YES  |     | NULL    |       |
| approval       | tinyint(1)    | YES  |     | NULL    |       |
| asset_id       | varchar(10)   | YES  |     | NULL    |       |
| thumbnail      | mediumtext    | YES  |     | NULL    |       |
+----------------+---------------+------+-----+---------+-------+

TABLE: tags
+-------+--------------+------+-----+---------+-------+
| Field | Type         | Null | Key | Default | Extra |
+-------+--------------+------+-----+---------+-------+
| name  | varchar(255) | NO   | PRI | NULL    |       |
+-------+--------------+------+-----+---------+-------+

TABLE: attachements
+----------------+---------------+------+-----+---------+-------+
| Field          | Type          | Null | Key | Default | Extra |
+----------------+---------------+------+-----+---------+-------+
| asset_id       | varchar(10)   | YES  |     | NULL    |       |
| attachment_uri | varchar(2083) | YES  |     | NULL    |       |
| upload_date    | datetime      | YES  |     | NULL    |       |
| download_count | int(11)       | YES  |     | NULL    |       |
+----------------+---------------+------+-----+---------+-------+

# config.js

Copy config-example.js and rename it to config.js. Fill in the appropriate credentials for the mysql database you created.