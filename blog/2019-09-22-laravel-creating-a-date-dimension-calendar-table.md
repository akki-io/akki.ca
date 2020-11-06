---
title: Laravel - Creating a date dimension (calendar) table
path: /blog/laravel-creating-a-date-dimension-calendar-table
date: 2019-09-22
tags: ['DATABASE', 'PHP', 'LARAVEL']
featureImage: ./images/shutterstock_519790783-min.jpg
---
## What is a date dimension table

Date Dimension is a table that has one record per each day, no more, no less! Date dimension plays a vital role in your data warehouse designing, it provides the ability to study behavior and trend of your data over a period of time.

Most BI tools have an in-built date dimension table, but sometimes you might want to create one. Date dimension table is only created and loaded once since the data is not changed that often.

This article is inspired by the article ["Creating a date dimension or calendar table in SQL Server"](https://www.mssqltips.com/sqlservertip/4054/creating-a-date-dimension-or-calendar-table-in-sql-server/). The article is specific for MS SQL database, but in our example, we'll create one using Laravel and Carbon so it can work with any kind of database driver.

We will be creating the following files with Laravel.

*   **Migration** - To create the table.
*   **Model** - To reference the table.
*   **Console Command** - To populate the table.

## Step 1 - Create the migration

The columns in this table are self-explanatory, you can also google them if you want to learn more.

```php
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDateDimensionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('date_dimensions', function (Blueprint $table) {
            $table->date('date')->primary();
            $table->unsignedInteger('day');
            $table->unsignedInteger('month');
            $table->unsignedInteger('year');
            $table->string('day_name');
            $table->string('day_suffix', 2);
            $table->unsignedInteger('day_of_week');
            $table->unsignedInteger('day_of_year');
            $table->unsignedInteger('is_weekend');
            $table->unsignedInteger('week');
            $table->unsignedInteger('iso_week');
            $table->unsignedInteger('week_of_month');
            $table->unsignedInteger('week_of_year');
            $table->unsignedInteger('iso_week_in_year');
            $table->string('month_name');
            $table->string('month_year');
            $table->string('month_name_year');
            $table->date('first_day_of_month');
            $table->date('last_day_of_month');
            $table->date('first_day_of_next_month');
            $table->unsignedInteger('quarter');
            $table->string('quarter_name');
            $table->date('first_day_of_quarter');
            $table->date('last_day_of_quarter');
            $table->date('first_day_of_year');
            $table->date('last_day_of_year');
            $table->date('first_day_of_next_year');
            $table->unsignedInteger('dow_in_month');
            $table->timestamps();
        });
    }
    
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('date_dimensions');
    }
}
```
## Step 2 - Create the model

In the model we are also typecasting the attributes, so it sets/gets the value in the correct format.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DateDimension extends Model
{
    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;
  
    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'date';
  
    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'date';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date',
        'day',
        'month',
        'year',
        'day_name',
        'day_suffix',
        'day_of_week',
        'day_of_year',
        'is_weekend',
        'week',
        'iso_week',
        'week_of_month',
        'week_of_year',
        'iso_week_in_year',
        'month_name',
        'month_year',
        'month_name_year',
        'first_day_of_month',
        'last_day_of_month',
        'first_day_of_next_month',
        'quarter',
        'quarter_name',
        'first_day_of_quarter',
        'last_day_of_quarter',
        'first_day_of_year',
        'last_day_of_year',
        'first_day_of_next_year',
        'dow_in_month',
    ];
 
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'date' => 'date:Y-m-d',
        'first_day_of_month' => 'date:Y-m-d',
        'last_day_of_month' => 'date:Y-m-d',
        'first_day_of_next_month' => 'date:Y-m-d',
        'first_day_of_quarter' => 'date:Y-m-d',
        'last_day_of_quarter' => 'date:Y-m-d',
        'first_day_of_year' => 'date:Y-m-d',
        'last_day_of_year' => 'date:Y-m-d',
        'first_day_of_next_year' => 'date:Y-m-d',
    ];
}
```

## Step 3 - Create a command

```php
<?php

namespace App\Console\Commands;

use App\Models\DateDimension;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Console\Command;
use function ceil;
use function now;

class PopulateDateDimensionsTableCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:PopulateDateDimensionsTableCommand';
    
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate data for date dimensions table';
    
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
        $this->info(now()->toDateTimeString() . " Start: app:PopulateDateDimensionsTableCommand");
        
        // Truncate all records
        DateDimension::truncate();
        
        // Create an empty array and save the transformed input to array
        $dataToInsert = [];
        
        // Get the date range
        // @NOTE - update the start and end date as per your choice
        $dates = CarbonPeriod::create('2015-01-01', '2030-12-31');
        
        // For each dates create a transformed data
        foreach ($dates as $date) {
            
            // Get the quarter details, as ABC has a different quarter system
            // @note - Carbon does not allow to override the quarters
            $quarterDetails = $this->getQuarterDetails($date);
        
            // Main transformer
            $dataToInsert[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $date->day,
                'month' => $date->month,
                'year' => $date->year,
                'day_name' => $date->dayName,
                'day_suffix' => $this->getDaySuffix($date->day),
                'day_of_week' => $date->dayOfWeek,
                'day_of_year' => $date->dayOfYear,
                'is_weekend' => (int) $date->isWeekend(),
                'week' => $date->week,
                'iso_week' => $date->isoWeek,
                'week_of_month' => $date->weekOfMonth,
                'week_of_year' => $date->weekOfYear,
                'iso_week_in_year' => $date->isoWeeksInYear,
                'month_name' => $date->monthName,
                'month_year' => $date->format('mY'),
                'month_name_year' => $date->format('MY'),
                'first_day_of_month' => $date->clone()->firstOfMonth()->format('Y-m-d'),
                'last_day_of_month' => $date->clone()->lastOfMonth()->format('Y-m-d'),
                'first_day_of_next_month' => $date->clone()->addMonthNoOverflow()->firstOfMonth()->format('Y-m-d'),
                'quarter' => $quarterDetails['value'],
                'quarter_name' => $quarterDetails['name'],
                'first_day_of_quarter' => $quarterDetails['first_day_of_quarter'],
                'last_day_of_quarter' => $quarterDetails['last_day_of_quarter'],
                'first_day_of_year' => $date->clone()->firstOfYear()->format('Y-m-d'),
                'last_day_of_year' => $date->clone()->lastOfYear()->format('Y-m-d'),
                'first_day_of_next_year' => $date->clone()->addYear()->firstOfYear()->format('Y-m-d'),
                'dow_in_month' => (int)ceil($date->day/7),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Create chunks for faster insertion
        // @note - SQL Server supports a maximum of 2100 parameters.
        $chunks = collect($dataToInsert)->chunk(50);
        
        // Using chunks insert the data
        foreach ($chunks as $chunk) {
            DateDimension::insert($chunk->toArray());   
        }
        
        $this->info(now()->toDateTimeString() . " Complete: app:PopulateDateDimensionsTableCommand");
    }
    
    /**
     * Get Quarter details
     * @OTE - Depending on your companies quarter update the map and logic below 
     *
     * @param Carbon $date
     * @return array
     */
    private function getQuarterDetails(Carbon $date)
    {
        $quarterMonthMap = [
            1 => ['value' => 1, 'name' => 'First'],
            2 => ['value' => 2, 'name' => 'Second'],
            3 => ['value' => 2, 'name' => 'Second'],
            4 => ['value' => 2, 'name' => 'Second'],
            5 => ['value' => 3, 'name' => 'Third'],
            6 => ['value' => 3, 'name' => 'Third'],
            7 => ['value' => 3, 'name' => 'Third'],
            8 => ['value' => 4, 'name' => 'Fourth'],
            9 => ['value' => 4, 'name' => 'Fourth'],
            10 => ['value' => 4, 'name' => 'Fourth'],
            11 => ['value' => 1, 'name' => 'First'],
            12 => ['value' => 1, 'name' => 'First'],
        ];
        
        $output['value'] = $quarterMonthMap[$date->month]['value'];
        $output['name'] = $quarterMonthMap[$date->month]['name'];
        
        switch ($output['value']) {
            case 1:
                $output['first_day_of_quarter'] = Carbon::parse($date->year - 1 . '-11-01')->firstOfMonth()->format('Y-m-d');
                $output['last_day_of_quarter'] = Carbon::parse($date->year . '-01-01')->lastOfMonth()->format('Y-m-d');
                
                break;
            case 2:
                $output['first_day_of_quarter'] = Carbon::parse($date->year . '-02-01')->firstOfMonth()->format('Y-m-d');
                $output['last_day_of_quarter'] = Carbon::parse($date->year . '-04-01')->lastOfMonth()->format('Y-m-d');
                
                break;
            case 3:
                $output['first_day_of_quarter'] = Carbon::parse($date->year . '-05-01')->firstOfMonth()->format('Y-m-d');
                $output['last_day_of_quarter'] = Carbon::parse($date->year . '-07-01')->lastOfMonth()->format('Y-m-d');
                
                break;
            case 4:
                $output['first_day_of_quarter'] = Carbon::parse($date->year . '-08-01')->firstOfMonth()->format('Y-m-d');
                $output['last_day_of_quarter'] = Carbon::parse($date->year . '-10-01')->lastOfMonth()->format('Y-m-d');
                
                break;
        }
        
        return $output;
    }
    
    /**
     * Get the Day Suffix
     * Copied logic from - https://www.mssqltips.com/sqlservertip/4054/creating-a-date-dimension-or-calendar-table-in-sql-server/
     *
     * @param $day
     * @return string
     */
    private function getDaySuffix($day)
    {
        if ($day/10 == 1) {
            return "th";
        }
        $right = substr($day, -1);
        
        if ($right == 1) {
            return 'st';
        }
        
        if ($right == 2) {
            return 'nd';
        }
        
        if ($right == 3) {
            return 'rd';
        }
        
        return 'th';
    }
}
```

In this command, update the start date and end date (line 55) as per your requirement. Also, the quarter in this script run from November-January, February- April, May-July, August-October, this might be different for your use case, so it should be updated accordingly.

## Conclusion

In this article you were able to design a date dimension table using Laravel. The migration, commands, etc. are database driver independent. So you can essentially create this table in MS SQL or MySQL or any other database supported by Laravel.

### References

*   [https://www.mssqltips.com/sqlservertip/4054/creating-a-date-dimension-or-calendar-table-in-sql-server/](https://www.mssqltips.com/sqlservertip/4054/creating-a-date-dimension-or-calendar-table-in-sql-server/)
