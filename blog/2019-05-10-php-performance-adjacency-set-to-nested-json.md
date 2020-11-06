---
title: PHP - Performance - Adjacency set to nested JSON
path: /blog/php-performance-adjacency-set-to-nested-json
date: 2019-05-10
tags: ['JSON', 'PERFORMANCE' ,'PHP']
featureImage: ./images/shutterstock_1047545539-min.jpg
---

## Before You Begin

In this article, we will compare the performance of Method 1 and Method 2 as used in - [PHP – Convert Adjacency set to nested JSON.](/php-convert-adjacency-set-to-nested-json/)

We will be utilizing an extensive data set with approximately 500K records. I have downloaded these records from itis.gov and made some minor modification for this article. Data can be downloaded from here - [https://drive.google.com/open?id=115\_d5PV4OQ948cWP5TLXUpN2TvLvvo\_y](https://drive.google.com/open?id=115_d5PV4OQ948cWP5TLXUpN2TvLvvo_y)

We will be using MySQL CTE and break the data into chunks to test the performance for different size of records. You can refer to the CTE article here - [MySQL – Adjacency List Model For Hierarchical Data Using CTE](/mysql-adjacency-list-model-for-hierarchical-data-using-cte/).

There is a slight change made to `getDataFromDatabase()` method as we want to limit the records to test the performance. Below you can find the updated definition. I have added the placeholder inside the CTE as `[ID_OF_ENTITY]`. This will be our starting point and then I will retrieve all descendants for this entity and convert it to a nested response.

## Method 1

```php
<?php

// Initialize php setting - @node - NOT RECOMMENDED FOR PRODUCTION, update your php.ini if needed.
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('memory_limit', '-1');
ini_set('max_execution_time', 30000);

// Get the tree array from DB
$treeArray = getDataFromDatabase();

// Transform the data
$outputTree = transformTree($treeArray, [ID_OF_ENTITY]);

// Output the response
header('Content-Type: application/json');
echo json_encode($outputTree[0]);

/**
 * Transform the tree
 *
 * @param $treeArray
 * @param null $parentId
 * @return array
 */
function transformTree($treeArray, $parentId = null)
{
    $output = [];

    // Read through all nodes of the tree
    foreach ($treeArray as $node) {
        
    // If the node parent is same as parent passed in argument
        if ($node['parent_id'] == $parentId) {
            
            // Get all the children for that node, using recursive method
            $children = transformTree($treeArray, $node['id']);
            
            // If children are found, add it to the node children array
            if ($children) {
                $node['children'] = $children;
            }
            
            // Add the main node with/without children to the main output
            $output[] = $node;
            
            // Remove the node from main array to avoid duplicate reading, speed up the process
            unset($node);
        }
    }
    return $output;
}

/**
 * Get all records from DB and return array
 *
 * @return array
 */
function getDataFromDatabase()
{
    // Create database connection
    $dbConnection = new mysqli("localhost", "root", "secret", "adjacency");
    
    // Get the result from DB Table
    $records = $dbConnection->query("
        WITH RECURSIVE tree AS
        (
          SELECT id, name, parent_id
            FROM entities
            WHERE id = [ID_OF_ENTITY]
          UNION ALL
          SELECT e.id, e.name, e.parent_id
            FROM tree AS t
              JOIN entities AS e ON t.id = e.parent_id
        )
        SELECT id, name, parent_id FROM tree;
    ");
    
    // Fetch all records
    // @MYSQLI_ASSOC - Columns are returned into the array having the field name as the array index.
    $output = mysqli_fetch_all($records, MYSQLI_ASSOC);
    
    // Close the connection
    $dbConnection->close();
    
    return $output;
}
```

## Method 2

```php
<?php

// Initialize php setting - @node - NOT RECOMMENDED FOR PRODUCTION, update your php.ini if needed.
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('memory_limit', '-1');
ini_set('max_execution_time', 30000);

// Get the tree array from DB
$treeArray = getDataFromDatabase();

// Group by parent id
$treeArrayGroups = [];

foreach ($treeArray as $record) {
    $treeArrayGroups[$record['parent_id']][] = $record;
}

// Get the root
$rootArray = $treeArray[0];

// Transform the data
$outputTree = transformTree($treeArrayGroups, $rootArray);

// Output the response
header('Content-Type: application/json');
echo json_encode($outputTree);

/**
 * Transform the tree
 *
 * @param $treeArrayGroups
 * @param $rootArray
 * @return mixed
 */
function transformTree($treeArrayGroups, $rootArray)
{
    // Read through all nodes where parent is root array
    foreach ($treeArrayGroups[$rootArray['id']] as $child) {
        
        // If there is a group for that child, aka the child has children
        if (isset($treeArrayGroups[$child['id']])) {
            // Traverse into the child
            $newChild = transformTree($treeArrayGroups, $child);
        } else {
            $newChild = $child;
        }
        
        // Assign the child to the array of children in the root node
        $rootArray['children'][] = $newChild;
    }
    return $rootArray;
}

/**
 * Get all records from DB and return array
 *
 * @return array
 */
function getDataFromDatabase()
{
    // Create database connection
    $dbConnection = new mysqli("localhost", "root", "secret", "adjacency");
    
    // Get the result from DB Table
    $records = $dbConnection->query("
        WITH RECURSIVE tree AS
        (
          SELECT id, name, parent_id
            FROM entities
            WHERE id = [ID_OF_ENTITY]
          UNION ALL
          SELECT e.id, e.name, e.parent_id
            FROM tree AS t
              JOIN entities AS e ON t.id = e.parent_id
        )
        SELECT id, name, parent_id FROM tree;
    ");
    
    // Fetch all records
    // @MYSQLI_ASSOC - Columns are returned into the array having the field name as the array index.
    $output = mysqli_fetch_all($records, MYSQLI_ASSOC);
    
    // Close the connection
    $dbConnection->close();
    
    return $output;
}
```

## Performance Comparision

For performance comparison, I am going to use blackfire.io. We will be ignoring the performance of all other components like MySQL except for `transformTree().`

### Results

#### ID\_OF\_ENTITY = 846539, ~5,000 DESCENDANTS

|#|CALLS FOR `transformTree()`|EXECUTION TIME|I/O WAIT TIME|CPU|PEAK MEMORY|
|--- |--- |--- |--- |--- |--- |
|Method 1 - [Result](https://blackfire.io/profiles/3c02f4b3-9f3f-481c-a6a3-847b0b5a4507/graph)|4,960|1.58 s|58.9 ms|1.52 s|3.88 MB|
|Method 2 - [Result](https://blackfire.io/profiles/29cd0b6d-26da-460f-a713-957bd9b5fd4b/graph)|847|88 ms|79.4 ms|8.65 ms|4.41 MB|

#### ID\_OF\_ENTITY = 846542, ~10,000 DESCENDANTS

|#|CALLS FOR `transformTree()`|EXECUTION TIME|I/O WAIT TIME|CPU|PEAK MEMORY|
|--- |--- |--- |--- |--- |--- |
|Method 1 - [Result](https://blackfire.io/profiles/1db21008-94ab-4549-b9ba-2cc48104612f/graph)|12,014|21.3 s|40 ms|21.2 s|8.28 MB|
|Method 2 - [Result](https://blackfire.io/profiles/eba295b1-eca4-4c23-bc79-35cb55b4907f/graph)|1,807|185 ms|158 ms|27.4 ms|10.3 MB|

#### ID\_OF\_ENTITY = 846535, ~20,000 DESCENDANTS

|#|CALLS FOR `transformTree()`|EXECUTION TIME|I/O WAIT TIME|CPU|PEAK MEMORY|
|--- |--- |--- |--- |--- |--- |
|Method 1 - [Result](https://blackfire.io/profiles/990c9202-cce7-4c47-908b-4c6e114bfe10/graph)|19,059|1 min 5 s|82.3 ms|1 min 5 s|13.6 MB|
|Method 2 - [Result](https://blackfire.io/profiles/994b50eb-2f2f-4dce-8e2d-f530b2f945c5/graph)|3,061|179 ms|122 ms|57.6 ms|16.8 MB|

#### ID\_OF\_ENTITY = 846504, ~50,000 DESCENDANTS

|#|CALLS FOR `transformTree()`|EXECUTION TIME|I/O WAIT TIME|CPU|PEAK MEMORY|
|--- |--- |--- |--- |--- |--- |
|Method 1 - [Result](https://blackfire.io/profiles/2f95fdee-1be4-45c7-b943-bee9d47271c6/graph)|54,703|11 min 33 s|1.03 s|11 min 32 s|37.4 MB|
|Method 2 - [Result](https://blackfire.io/profiles/3664338e-c6b2-4252-8cd6-636adf52c1f2/graph)|8,589|534 ms|404 ms|129 ms|47.1 MB|

## Conclusion

As you can see from the above result set, Method 2 is significantly faster than Method 1 when it comes to big data set.

I tried to run Method 1 on the complete data set with ~ 500K records, and I waited for more than an hr, but it never executed. On the flip side - Method 2 was still able to complete within 10 seconds.

The main reason for Method 2 being superior is because of the recursive method called significantly less than Method 1.

In future articles, I will talk about how you can best mock any third party service while running PHPUnit tests inside Laravel. As making a real connection slows down the complete suite.

