---
title: Laravel PHPUnit - Testing multiple connection system with SQLite in-memory DB.
path: /blog/laravel-phpunit-testing-multiple-connection-system-with-sqlite-in-memory-db
date: 2018-12-09
tags: ['LARAVEL', 'MYSQL', 'TESTING']
featureImage: ./images/shutterstock_1101267680-min.jpg
---

## Who is this article for?

Anyone looking for how to test multi-connection Laravel using PHPUnit in-memory database.

In this article, I’m going to walk through, how to create a migration, models, setup database connections and then finally set up PHPUnit in-memory database for multi-database Laravel App.

## Before You Begin

In this article, our project uses two databases.

*   Main Database - This is the primary database
*   Audit Database - This is the audit database for storing audit/logs record.

Audit data will be used to show logs/audits of resource and also can be used to restore data.

## Step 1 - Update the database.php

```php
<?php

return [
    
    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for all database work. Of course
    | you may use many connections at once using the Database library.
    |
    */
    'default' => env('DB_CONNECTION', 'mysql'),
    'audit_connection' => env('AUDIT_DB_CONNECTION', 'audit'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Here are each of the database connections setup for your application.
    | Of course, examples of configuring each database platform that is
    | supported by Laravel is shown below to make development simple.
    |
    |
    | All database work in Laravel is done through the PHP PDO facilities
    | so make sure you have the driver for your particular database of
    | choice installed on your machine before you begin development.
    |
    */
    'connections' => [
        // Main app database connection
        'mysql' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => '',
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ],
        // Main audits DB
        'audit' => [
            'driver' => 'mysql',
            'host' => env('AUDIT_DB_HOST', '127.0.0.1'),
            'port' => env('AUDIT_DB_PORT', '3306'),
            'database' => env('AUDIT_DB_DATABASE', 'forge'),
            'username' => env('AUDIT_DB_USERNAME', 'forge'),
            'password' => env('AUDIT_DB_PASSWORD', ''),
            'unix_socket' => '',
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ],
        // PHPunit testing main connection
        'testing' => [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
        ],
        // PHPunit testing audit connection
        'testing_audit' => [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run in the database.
    |
    */
    'migrations' => 'migrations',

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer set of commands than a typical key-value systems
    | such as APC or Memcached. Laravel makes it easy to dig right in.
    |
    */
    'redis' => [
        'client' => 'predis',
        'default' => [
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', 6379),
            'database' => 0,
        ],
    ],
];
```

In the above code, you can see we have declared additional key => value pair, audit_connection.

```php
'audit_connection' => env('AUDIT_DB_CONNECTION', 'audit'),
```

We are going to reference this connection name in our migrations and models rather than referencing `connections.audit` for our audit database connection.

## Step 2 - Create a migration for the audit database

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuditsTable extends Migration
{
    /**
     * The database schema.
     *
     * @var Schema
     */
    protected $schema;

    /**
     * Create a new migration instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->schema = Schema::connection(config('database.audit_connection'));
    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $this->schema->create('audits', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_type')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('event');
            $table->string('auditable_table')->nullable();
            $table->morphs('auditable');
            $table->text('old_values')->nullable();
            $table->text('new_values')->nullable();
            $table->text('url')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('tags')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'user_type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $this->schema->dropIfExists('audits');
    }
}
```

Here you can see in our construct we are setting the schema to use the connection set in `database.audit_connections`. Having the migration like this will help us override the values in our `phpunit.xml`.

## Step 3 - Create a model for Audit

```php
<?php

namespace App\Models\Audits;

use OwenIt\Auditing\Audit as AuditTrait;
use OwenIt\Auditing\Contracts\Audit as AuditContract;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed auditable_table
 * @property mixed auditable_type
 * @property int id
 */
class Audit extends Model implements AuditContract
{
    use AuditTrait;

    /**
     * Specify the connection, since this implements multitenant solution
     * Called via constructor to faciliate testing
     *
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        parent::__construct($attributes);
        $this->setConnection(config('database.audit_connection'));
    }

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'old_values' => 'json',
        'new_values' => 'json',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'auditable_id',
        'auditable_table',
        'auditable_type',
        'event',
        'ip_address',
        'new_values',
        'old_values',
        'tags',
        'url',
        'user_agent',
        'user_id',
        'user_type',
        'updated_at',
    ];
}
```

As you can see in the model rather than directly referencing the `$connection` as `protected $connection = 'audit';` we are using `__construct` to set the connection. This will again help in our PHPUnit testing.

Now all our migrations and model is ready, we can now use in-memory databases for testing.

## Step 4 - Update phpunit.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit backupGlobals="false"
         backupStaticAttributes="false"
         bootstrap="vendor/autoload.php"
         colors="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         processIsolation="false"
         stopOnFailure="true">
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>
    </testsuites>
    <filter>
        <whitelist processUncoveredFilesFromWhitelist="true">
            <directory suffix=".php">./app</directory>
        </whitelist>
    </filter>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_CONNECTION" value="testing"/>
        <env name="AUDIT_DB_CONNECTION" value="testing_audit"/>
    </php>
</phpunit>
```

In this sample phpunit.xml, you can see that we have set the default connection to use database.connections.testing and audit connection to use `database.connections.testing_audit`.

In our migration and model, we have not hard coded the connections, using this technique will now let us use an in-memory database for testing.

## Conclusion

In this article, you might be wondering why do we need to declare two SQLite in-memory databases when we can only use one and use it for both main testing connection as well as audit testing connection. Yes, that is correct we can always use one in-memory database, but in my experience, there are sometimes conflicts when using one in-memory database for a multi-database app. One situation I have encountered is when you have same table names in two or more database. So to be on the safe side, I tend to use an equal number of in-memory databases as our main app.
