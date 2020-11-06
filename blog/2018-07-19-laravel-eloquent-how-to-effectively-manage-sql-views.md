---
title: Laravel Eloquent – How to effectively manage SQL views
path: /blog/laravel-eloquent-how-to-effectively-manage-sql-views
date: 2018-07-19
tags: ['MYSQL', 'PHP']
featureImage: ./images/rendered_625417832-compressor.jpg
---

## Who is this article for?

Anyone looking for how to manage SQL Views effectively in a Laravel App.

In this article, I'm going to walk through, how to effectively manage SQL views with version control using Console Command and Migrations in Laravel.

## Before You Begin

If you haven't already know how to create a view from migration, this is how you do it.

```bash
# Create a new migration
php artisan make:migration create_employees_record_view
```

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateEmployeesRecordView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            CREATE VIEW employees_records 
            AS
            SELECT
                employees.emp_no,
                employees.first_name,
                employees.last_name,
                employees.gender,
                employees.hire_date,
                employees.birth_date,
                dept_emp.dept_no,
                departments.dept_name,
                mananger.emp_no AS manager_emp_no,
                mananger.first_name AS manager_first_name,
                mananger.last_name AS manager_last_name
            FROM
                employees
                LEFT JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
                LEFT JOIN departments ON dept_emp.dept_no = departments.dept_no
                LEFT JOIN dept_manager ON departments.dept_no = dept_manager.dept_no
                LEFT JOIN employees mananger ON dept_manager.emp_no = mananger.emp_no;
        ");
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
```

```bash
# Run the migration
php artisan migrate
```

However, this article isn't about how to create a view from migration. It is about how to manage SQL Views effectively. So let's start.

## Step 1 - Create a Console Command

```bash
php artisan make:command CreateOrReplaceEmployeeRecordsViewCommand
```

## Step 2 - Update the Console Command to Create or Update View

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CreateOrReplaceEmployeeRecordsViewCommand extends Command
{
    
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'view:CreateOrReplaceEmployeeRecordsView';
    
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create or Replace SQL View.';
    
    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }
    
    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        DB::statement("
            CREATE OR REPLACE VIEW employees_records 
            AS
            SELECT
                employees.emp_no,
                employees.first_name,
                employees.last_name,
                employees.gender,
                employees.hire_date,
                employees.birth_date,
                dept_emp.dept_no,
                departments.dept_name,
                mananger.emp_no AS manager_emp_no,
                mananger.first_name AS manager_first_name,
                mananger.last_name AS manager_last_name
            FROM
                employees
                LEFT JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
                LEFT JOIN departments ON dept_emp.dept_no = departments.dept_no
                LEFT JOIN dept_manager ON departments.dept_no = dept_manager.dept_no
                LEFT JOIN employees mananger ON dept_manager.emp_no = mananger.emp_no;
        ");
    }
}
```

## Step 3 - Create a new migration to call the command.

```bash
# Create a migration
php artisan make:migration call_the_employee_records_command
```

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;

class CallTheEmployeeRecordsCommand extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Artisan::call("view:CreateOrReplaceEmployeeRecordsView");
    }
    
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
```

```bash
# Run the migration
php artisan migrate
```

Now every time you need to update the SQL view, you can update the console command

## Advantages -

- Easy to maintain SQL Views as it can get difficult if you have to copy the full definition of view in a migration everytime you need to update it.
- Power of source control.
- Helpful in maintaining a view which has many columns.

As you know, Laravel treats tables, view as eloquent, so let's take it another step further and create a model.

## Step 4 - Create a Model

```bash
# Create a new model
php artisan make:model EmployeesRecord
```

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmployeesRecord extends Model
{
}
```

## Step 5 - Test out the newly created Model

```bash
# For this we will be using tinker
php artisan tinker
```

```bash
>>> $e = \App\EmployeesRecord::first();
=> App\EmployeesRecord {#2885
     emp_no: 10001,
     first_name: "Georgi",
     last_name: "Facello",
     gender: "M",
     hire_date: "1986-06-26",
     birth_date: "1953-09-02",
     dept_no: "d005",
     dept_name: "Development",
     manager_emp_no: 110511,
     manager_first_name: "DeForest",
     manager_last_name: "Hagimont",
   }
>>> $e = \App\EmployeesRecord::where('emp_no', 10003)->first();
=> App\EmployeesRecord {#2896
     emp_no: 10003,
     first_name: "Parto",
     last_name: "Bamford",
     gender: "M",
     hire_date: "1986-08-28",
     birth_date: "1959-12-03",
     dept_no: "d004",
     dept_name: "Production",
     manager_emp_no: 110303,
     manager_first_name: "Krassimir",
     manager_last_name: "Wegerle",
   }
```

Now, you can add scopes, mutators etc to the model. Ref to [Laravel Documentation](https://laravel.com/docs/5.6/eloquent). Although, you cannot update the view as SQL View are not real tables.

In future articles I will talk about how to setup and manage Materialised SQL Views in Laravel.  You can read more about Materialised view [here](http://www.fromdual.com/mysql-materialized-views).

### Sources

*   Data Source - [https://dev.mysql.com/doc/employee/en/](https://dev.mysql.com/doc/employee/en/)
*   Code Highlighter - [https://gist.github.com/](https://gist.github.com/)
