---
title: Laravel Auditing - Queue Auditable Models
path: /blog/laravel-auditing-queue-auditable-models
date: 2018-12-13
tags: ['AUDIT', 'LARAVEL', 'PHP', 'QUEUE']
featureImage: ./images/shutterstock_1071548396-min.jpg
---
## Who is this article for?

Anyone looking for how Queue Laravel Auditing Package.

In this article, I’m going to walk through, how to Queue the [Laravel Auditing Package](https://github.com/owen-it/laravel-auditing). We will be utilizing the event listeners and job to achieve this.

## Before You Begin

In this article, we will be using the latest release (`v8.x`) at the time of this article.

This package supported queuing the request in older versions but was later [removed](https://github.com/owen-it/laravel-auditing/pull/166).

As per the PR, it states that queuing was removed because the `User` relation was lost since the session is used to resolve the current User performing the action and the queue doesn't have access to it. Another point mentioned was, since it was not used often by developers. Also, the overhead is very minimal.

All the points stated above are kinda correct. So the question is **Why to Queue it?**

In my experience, working on a large enterprise application, it can add some overhead, especially if you go frequent updates. But again, if you use DB for queuing, it is the null and void situation.

Also, if you plan to use No-SQL like AWS DynamoDB for storing the log records, it can add some network latency. The request can fail if there are any exceptions.

I would suggest queuing the audit. We will be using 4 different types of queue priorities in our example. These are

*   highPriority
*   mediumPriority
*   default
*   lowPriority

These will be configured in your supervisor `workers.conf`. The steps below outline how to queue the audits. To do the basic installation follow the steps outlined in the package, I am going to assume we already have the package setup and working. Also, in this article, we are using database jobs for queuing.

## Step 1 – Create an Audit Model.

```php
<?php

namespace App\Models;

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

In the above code, I am using a different database for storing audits, the connection is set in the `__construct` method. If you want to learn more about this [click here](/blog/laravel-phpunit-testing-multiple-connection-system-with-sqlite-in-memory-db/).

## Step 2 - Create a Job.

```php
<?php

namespace App\Jobs;

use App\Models\Audits;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

class SaveAuditToDBJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;
    protected $data;
    
    /**
     * The name of the queue the job should be sent to.
     *
     * @var string
     */
    public $queue = 'lowPriority';
    
    /**
     * Create a new job instance.
     *
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }
    
    /**
     * Handle the event.
     *
     * @return void
     */
    public function handle()
    {        
        Audit::create($this->data);
    }

    /**
     * Handle a job failure.
     *
     * @param Exception $exception
     * @return void
     */
    public function failed(Exception $exception)
    {
        Log::error('UNABLE TO SAVE AUDIT RECORD FROM JOB.', [
            'data' => $this->data,
            'errors' => json_encode($exception->getMessage()),
        ]);
    }
}
```

```php
public $queue = 'lowPriority';
```

Here we have set which queue this job should run. We will use this later in this article once we are configuring supervisor configuration. This job expects an array to be passed as an argument and the uses the Laravel `create()` method to store the values. This function will be able to do a bulk insert as we have configured `$fillable` property in the model.

## Step 3 – Create a listener.

We will be using the Auditing [event](http://laravel-auditing.com/docs/8.0/audit-events) from the package, this event gets fired before the audits are saved. For now, let's configure the listener.

```php
<?php

namespace App\Listeners\Audit;

use App\Jobs\SaveAuditToDBJob;
use function config;
use OwenIt\Auditing\Events\Auditing;

class SaveAuditToDBListener
{
    /**
     * Handle the event.
     *
     * @param Auditing $event
     * @return bool
     * @throws \OwenIt\Auditing\Exceptions\AuditingException
     */
    public function handle(Auditing $event)
    {
        SaveAuditToDBJob::dispatch($event->model->toAudit());                
        return false;
    }
}
```

The boolean return `false` is significant here so do not forget to return it. By returning false from the event listener `handle()` method, it cancels the Audit.

## Step 4 - Update Event Service Provider

```php
<?php

namespace App\Providers;

use App\Listeners\Audit\SaveAuditToDBListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use OwenIt\Auditing\Events\Auditing;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [        
        Auditing::class => [
            SaveAuditToDBListener::class
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
    }
}
```

Here you can see we are mapping our Events and corresponding listeners. In our case, it is just one.

## Step 5 - Update supervisor configuration.

Update the supervisor configuration, so that it can run the newly created queue.

**Default**
```bash
command=php repo_path/artisan queue:work --sleep=3 --tries=3
```

**To**
```bash
command=php repo_path/artisan queue:work --queue=highPriority,mediumPriority,default,lowPriority --sleep=3 --tries=3 
```

The `--sleep` and `--tries` will depend on your settings. And voila, the Laravel Auditing package audits are now queued.

## Conclusion

Using the technique will ensure that your `User` relation will be intact. I would only recommend queuing audits if you are building an extensive application and/or you are using a different database on a different host. In our scenario, we are using two different RDS. I would also queue the audits, if you are using a different type of database like NoSQL, MongoDB, DynamoDB, etc.

In one of my position, we did experiment with DynamoDB for storing audits, but we end up using a different RDS. DynamoDB did not cut the requirements for us, but it might in your case. Queuing or not queuing, using the same database or separate database or even different type of database really depends on individual requirements. You should although try to follow the YAGNI - KISS Principle.

## References

*   [https://github.com/owen-it/laravel-auditing](https://github.com/owen-it/laravel-auditing)
*   [https://github.com/owen-it/laravel-auditing/pull/166](https://github.com/owen-it/laravel-auditing/pull/166)
*   [https://www.akki.io/blog/laravel-phpunit-testing-multiple-connection-system-with-sqlite-in-memory-db/](https://blog.tekz.io/laravel-phpunit-testing-multiple-connection-system-with-sqlite-in-memory-db/)
*   [http://laravel-auditing.com/docs/8.0/audit-events](http://laravel-auditing.com/docs/8.0/audit-events)
