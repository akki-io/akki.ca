---
title: PHP - Convert Adjacency set to nested JSON
path: /blog/php-convert-adjacency-set-to-nested-json
date: 2019-04-04
tags: ['JSON', 'PHP']
featureImage: ./images/shutterstock_616205984-min.jpg
---

## Who is this article for?

Anyone looking for how to convert an adjacency set to a nested JSON response. Different types of data can be stored as adjacency set e.x. Menu items, any kind of hierarchy, etc.

In this article, I’m going to walk through on a couple of algorithms written in PHP.

## Before You Begin

We will be utilizing the data definition and structure from this article - [MySQL – Adjacency List Model For Hierarchical Data Using CTE](/mysql-adjacency-list-model-for-hierarchical-data-using-cte). You can refer to this post to create the MySQL Table and populate data.

## Method 1

```php
<?php

// Get the tree array from DB
$treeArray = getDataFromDatabase();

// Transform the data
$outputTree = transformTree($treeArray);

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
    $records = $dbConnection->query("SELECT id, parent_id, name FROM category ORDER BY parent_id");

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
    $records = $dbConnection->query("SELECT id, parent_id, name FROM category ORDER BY parent_id");

    // Fetch all records
    // @MYSQLI_ASSOC - Columns are returned into the array having the field name as the array index.
    $output = mysqli_fetch_all($records, MYSQLI_ASSOC);

    // Close the connection
    $dbConnection->close();
    return $output;
}
```

## Output

```json

{
  "id": "1",
  "parent_id": null,
  "name": "Electronics",
  "children": [
    {
      "id": "2",
      "parent_id": "1",
      "name": "TV",
      "children": [
        {
          "id": "3",
          "parent_id": "2",
          "name": "Smart"
        },
        {
          "id": "4",
          "parent_id": "2",
          "name": "4K Ultra HD"
        },
        {
          "id": "5",
          "parent_id": "2",
          "name": "Curved"
        }
      ]
    },
    {
      "id": "6",
      "parent_id": "1",
      "name": "Camera"
    },
    {
      "id": "7",
      "parent_id": "1",
      "name": "Computer",
      "children": [
        {
          "id": "8",
          "parent_id": "7",
          "name": "Desktop"
        },
        {
          "id": "9",
          "parent_id": "7",
          "name": "Laptops",
          "children": [
            {
              "id": "10",
              "parent_id": "9",
              "name": "Work"
            },
            {
              "id": "11",
              "parent_id": "9",
              "name": "Travel"
            },
            {
              "id": "12",
              "parent_id": "9",
              "name": "All Around"
            },
            {
              "id": "13",
              "parent_id": "9",
              "name": "Gaming"
            }
          ]
        },
        {
          "id": "14",
          "parent_id": "7",
          "name": "Tablet"
        }
      ]
    }
  ]
}
```

## Performance Comparision

For performance comparison, I am going to use blackfire.io. We will be ignoring the performance of all other components like MySQL except for `transformTree()`. To get more accurate results, I am going to use several sample size, in this case, I used  10.

### Method 1

<iframe src="https://blackfire.io/profiles/f62777bb-c78a-4eab-8a0c-0d507df6dcce/embed" width="1000" height="800" frameborder="0" allowfullscreen="allowfullscreen"></iframe>

### Method 2

<iframe src="https://blackfire.io/profiles/bef22336-6d25-4528-983e-2bd8d7cbe1ee/embed" width="1000" height="800" frameborder="0" allowfullscreen="allowfullscreen"></iframe>

### Basic Result

|#|EXECUTION TIME|I/O WAIT TIME|CPU|PEAK MEMORY|
|--- |--- |--- |--- |--- |
|Method 1|734 µs|376 µs|358 µs|44.2 kB|
|Method 2|762 µs|392 µs|371 µs|44.8 kB|


### Recursive Calls for `transformTree()`

|#|TOTAL DB RECORDS|CALLS FOR `transformTree()`|
|--- |--- |--- |
|Method 1|14|15|
|Method 2|14|4|


[Full Result of Method 1](https://blackfire.io/profiles/f62777bb-c78a-4eab-8a0c-0d507df6dcce/graph)

[Full Result of Method 2](https://blackfire.io/profiles/bef22336-6d25-4528-983e-2bd8d7cbe1ee/graph)

## Conclusion

As you can see both Method 1 and Method 2 generates the same output. These can be used with any type of dataset. It performs recursive operations and produces output for any depth of data.

Although, we don't really see the benefit of using Method 2 over Method 1 as the data set used is very small. The difference in performance is almost similar for small dataset.

But, I would strongly recommend using Method 2, as this method is far more superior and faster.

In my next article, we will dive deep into comparing the performance of these two methods.
