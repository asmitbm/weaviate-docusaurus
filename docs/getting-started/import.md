---
title: Import
sidebar_position: 3
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<badges></badges>

Although importing itself is pretty straightforward, creating an optimized import strategy needs a bit of planning on your end. Hence, before we start with this guide, there are a few things to keep in mind.

* When importing, you want to make sure that you max out all the CPUs available. It’s more often than not the case that the import script is the bottleneck.

  * Tip, use `htop` when importing to see if all CPUs are maxed out.
  * Learn more about how to plan your setup [here](./installation#running-weaviate-yourself).

* Use [parallelization](https://www.computerhope.com/jargon/p/parallelization.htm#:~:text=Parallelization%20is%20the%20act%20of,the%20next%2C%20then%20the%20next.); if the CPUs are not maxed out, just add another import process.

* For Kubernetes, fewer large machines are faster than more small machines. Just because of network latency.

## Importing

First of all, some rules of thumb.

  * You should always use batch import.
  * As mentioned above, max out your CPUs (on the Weaviate cluster). Often your import script is the bottleneck.
  * Process error messages.
  * Some clients (especially Python) have some build-in logic to efficiently regulate batch importing.

Assuming that you’ve read the [schema getting started guide](./schema), you import data based on the classes and properties defined in the schema.

For the purpose of this tutorial, we’ve prepared a **data.json** file, which contains a few Authors and Publications. Download it from here, and add it to your project.

Now, to import the data we need to follow these steps:

  1. Connect to your Weaviate instance
  2. Load objects from the `data.json` file
  3. Prepare a batch process
  4. Loop through all Publications
     * Parse each publication – to a structure expected by the language client of your choice
     * Push the object through a batch process
  5. Loop through all Authors
     * Parse each author – to a structure expected by the language client of your choice
     * Push the object through a batch process
  6. Flush the batch process – in case there are any remaining objects in the buffer

Here is the full code you need to import the **Publications** (note, the **importAuthors** example is shorter).

<Tabs groupId="languages">
<TabItem value="py" label="Python">

```py
import weaviate

client = weaviate.Client("https://some-endpoint.semi.network/")

# Load data from the data.json file
data_file = open('data.json')
data = json.load(data_file)
# Closing file
data_file.close()

# Configure a batch process
client.batch.configure(
  batch_size=100, 
  dynamic=True,
  timeout_retries=3,
  callback=None,
)

# Batch import all Publications
for publication in data['publications']:
  print("importing publication: ", publication["name"])

  properties = {
    "name": publication["name"]
  }

  client.batch.add_data_object(properties, "Publication", publication["id"], publication["vector"])

# Flush the remaining buffer to make sure all objects are imported
client.batch.flush()
```

</TabItem>
<TabItem value="js" label="JavaScript">

```js
const weaviate = require("weaviate-client");

const client = weaviate.client({
  scheme: 'https',
  host: 'some-endpoint.semi.network/',
});

async function getJsonData() {
    const file = await fetch('./data.json');
    return file.json();
}

async function importPublications() {
  // Get the data from the data.json file
  const data = await this.getJsonData();

  // Prepare a batcher
  let batcher = client.batch.objectsBatcher();
  let counter = 0;

  data.publications.forEach(publication => {
    // Construct an object with a class, id, properties and vector
    const obj = {
      class: "Publication",
      id: publication.id,
      properties: {
        name: publication.name,
      },
      vector: publication.vector
    }

    // add the object to the batch queue
    batcher = batcher.withObject(obj);

    // When the batch counter reaches 20, push the objects to Weaviate
    if (counter++ == 20) {
      // flush the batch queue (use await to execute the promise)
      batcher
      .do()
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      });
      
      // restart the batch queue
      counter = 0;
      batcher = client.batch.objectsBatcher();
    }
  });

  // Flush the remaining objects
  batcher
  .do()
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.error(err)
  });
}

importPublications();
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/go-openapi/strfmt"
	"github.com/pkg/errors"
	"github.com/semi-technologies/weaviate-go-client/v4/weaviate"
	"github.com/semi-technologies/weaviate/entities/models"
)

func main() {
	ctx := context.Background()

	cfg := weaviate.Config{
		Host:   "some-endpoint.semi.network/",
		Scheme: "https",
	}
	client := weaviate.New(cfg)

	fmt.Printf("Import objects\n")
	if err := importPublications(ctx, client); err != nil {
		panic(err)
	}

	fmt.Printf("Successfully imported data\n")
}

func parseFile() (Data, error) {
	filePath := "./data.json"
	data, err := os.ReadFile(filePath)
	if err != nil {
		return Data{}, errors.Wrap(err, "reading data file")
	}

	var d Data
	if err = json.Unmarshal(data, &d); err != nil {
		return Data{}, errors.Wrap(err, "parsing data file")
	}

	return d, nil
}

func importPublications(ctx context.Context, client *weaviate.Client) error {
	data, err := parseFile()
	if err != nil {
		return err
	}

	publicationObjects := []*models.Object{}
	for _, publication := range data.Publications {
		publicationObjects = append(publicationObjects, &models.Object{
			Class: "Publication",
			ID:    strfmt.UUID(publication.ID),
			Properties: map[string]interface{}{
				"name": publication.Name,
			},
			Vector: publication.Vector,
		})
	}

	batcher := client.Batch().ObjectsBatcher()
	for _, publicationObject := range publicationObjects {
		batcher.WithObject(publicationObject)
	}

	if resp, err := batcher.Do(ctx); err != nil {
		return errors.Wrap(err, "importing publications")
	} else if len(resp) != len(publicationObjects) {
		return errors.Wrap(err, "invalid number of imported publications")
	}

	return nil
}

type Data struct {
	Authors      []Author      `json:"authors"`
	Publications []Publication `json:"publications"`
}

type Author struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Age           int32     `json:"age"`
	Born          string    `json:"born"`
	WonNobelPrize bool      `json:"wonNobelPrize"`
	Description   string    `json:"description"`
	Vector        []float32 `json:"vector"`
}

type Publication struct {
	ID     string    `json:"id"`
	Name   string    `json:"name"`
	Vector []float32 `json:"vector"`
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
package example;

import com.google.gson.Gson;
import technology.semi.weaviate.client.Config;
import technology.semi.weaviate.client.WeaviateClient;
import technology.semi.weaviate.client.base.Result;
import technology.semi.weaviate.client.v1.batch.api.ObjectsBatcher;
import technology.semi.weaviate.client.v1.batch.model.ObjectGetResponse;
import technology.semi.weaviate.client.v1.data.model.WeaviateObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.stream.Stream;

public class App {
  private final WeaviateClient client;

  public App() {
    Config config = new Config("https", "some-endpoint.semi.network/");
    client = new WeaviateClient(config);
  }

  public static void main(String[] args) throws FileNotFoundException {
    App app = new App();
    app.importPublications();
  }

  public void importPublications() throws FileNotFoundException {
    Data data = parseFile();

    Stream<WeaviateObject> publicationObjects = Arrays.stream(data.publications)
      .map(publication -> WeaviateObject.builder()
            .className("Publication")
            .id(publication.id)
            .properties(new HashMap<String, Object>() )
            .vector(publication.vector)
            .build()
      );

    ObjectsBatcher batcher = client.batch().objectsBatcher();
    publicationObjects.forEach(batcher::withObject);
    Result<ObjectGetResponse[]> result = batcher.run();

    if (result.hasErrors()) {
      System.out.println(result.getError());
      return;
    }
    Arrays.stream(result.getResult()).forEach(System.out::println);
  }

  private Data parseFile() throws FileNotFoundException {
    File jsonFile = new File("src/main/resources/data.json");
    InputStreamReader reader = new InputStreamReader(new FileInputStream(jsonFile));
    return new Gson().fromJson(reader, Data.class);
  }

  public static class Data {
    public Author[] authors;
    public Publication[] publications;
  }

  public static class Publication {
    public String id;
    public String name;
    public Float[] vector;
  }

  public static class Author {
    public String id;
    public String name;
    public Integer age;
    public String born;
    public Boolean wonNobelPrize;
    public String description;
    public Float[] vector;
  }
}
```

</TabItem>
<TabItem value="curl" label="curl">

```curl
curl \
-X POST \
-H "Content-Type: application/json" \
-d '{
  "objects": [{
    "id": "32d5a368-ace8-3bb7-ade7-9f7ff03eddb6",
    "class": "Publication",
    "properties": {
        "name": "The New York Times"
    },
    "vector": [
        -0.0030892247,
        0.17440806,
        0.024489688
    ]
  }, {
      "id": "f564113e-11e2-11ed-861d-0242ac120002",
      "class": "Author",
      "properties": {
          "name": "Paul Krugman",
          "age": 69,
          "born": "1953-02-28T00:00:00.0Z",
          "wonNobelPrize": true,
          "description": "Paul Robin Krugman is an American economist [...] New Economic Geography."
      },
      "vector": [
          -0.16147631,
          -0.065765485,
          -0.06546908
      ]
  }]
}' \
https://some-endpoint.semi.network/v1/batch/objects
```

</TabItem>
</Tabs>

And here is the code to import **Authors**.

<Tabs groupId="languages">
<TabItem value="py" label="Python">

```py
# Batch import all Authors
for author in data['authors']:
  print("importing author: ", author["name"])

  properties = {
    "name": author["name"],
    "age": author["age"],
    "born": author["born"],
    "wonNobelPrize": author["wonNobelPrize"],
    "description": author["description"]
  }

  client.batch.add_data_object(properties, "Author", author["id"], author["vector"])

# Flush the remaining buffer to make sure all objects are imported
client.batch.flush()
```

</TabItem>
<TabItem value="js" label="JavaScript">

```js
async function importAuthors() {
  // Get the data from the data.json file
  const data = await this.getJsonData();

  // Prepare a batcher
  let batcher = client.batch.objectsBatcher();
  let counter = 0;

  // Loop through all authors and import them
  data.authors.forEach(author => {
    // Construct an object with a class, id, properties and vector
    const obj = {
      class: "Author",
      id: author.id,
      properties: {
        name: author.name,
        age: author.age,
        born: author.born,
        wonNobelPrize: author.wonNobelPrize,
        description: author.description,
      },
      vector: author.vector
    }

    // add the object to the batch queue
    batcher = batcher.withObject(obj);

    // When the batch counter reaches 20, push the objects to Weaviate
    if (counter++ == 20) {
      // flush the batch queue (use await to execute the promise)
      let result = await (batcher.do());
      console.log(`Batch loaded: ${JSON.stringify(result)}`);
      
      // restart the batch queue
      counter = 0;
      batcher = client.batch.objectsBatcher();
    }
  });

  // Flush the remaining objects
  let result = await (batcher.do());
}

importAuthors();
```

</TabItem>
<TabItem value="go" label="Go">

```go
func importAuthors(ctx context.Context, client *weaviate.Client) error {
	data, err := parseFile()
	if err != nil {
		return err
	}

	authorObjects := []*models.Object{}
	for _, author := range data.Authors {
		authorObjects = append(authorObjects, &models.Object{
			Class: "Author",
			ID:    strfmt.UUID(author.ID),
			Properties: map[string]interface{}{
				"name":          author.Name,
				"age":           author.Age,
				"born":          author.Born,
				"wonNobelPrize": author.WonNobelPrize,
				"description":   author.Description,
			},
			Vector: author.Vector,
		})
	}

	batcher := client.Batch().ObjectsBatcher()
	for _, authorObject := range authorObjects {
		batcher.WithObject(authorObject)
	}

	if resp, err := batcher.Do(ctx); err != nil {
		return errors.Wrap(err, "importing authors")
	} else if len(resp) != len(authorObjects) {
		return errors.Wrap(err, "invalid number of imported authors")
	}

	return nil
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
public void importAuthors() throws FileNotFoundException {
  Data data = parseFile();

  Stream<WeaviateObject> authorObjects = Arrays.stream(data.authors)
    .map(author -> WeaviateObject.builder()
      .className("Author")
      .id(author.id)
      .properties(new HashMap<String, Object>() )
      .vector(author.vector)
      .build()
    );

  ObjectsBatcher batcher = client.batch().objectsBatcher();
  authorObjects.forEach(batcher::withObject);
  Result<ObjectGetResponse[]> result = batcher.run();

  if (result.hasErrors()) {
    System.out.println(result.getError());
    return;
  }
  Arrays.stream(result.getResult()).forEach(System.out::println);
}
```

</TabItem>
<TabItem value="curl" label="curl">

```curl
curl \
-X POST \
-H "Content-Type: application/json" \
-d '{
  "objects": [{
    "id": "32d5a368-ace8-3bb7-ade7-9f7ff03eddb6",
    "class": "Publication",
    "properties": {
        "name": "The New York Times"
    },
    "vector": [
        -0.0030892247,
        0.17440806,
        0.024489688
    ]
  }, {
      "id": "f564113e-11e2-11ed-861d-0242ac120002",
      "class": "Author",
      "properties": {
          "name": "Paul Krugman",
          "age": 69,
          "born": "1953-02-28T00:00:00.0Z",
          "wonNobelPrize": true,
          "description": "Paul Robin Krugman is an American economist [...] New Economic Geography."
      },
      "vector": [
          -0.16147631,
          -0.065765485,
          -0.06546908
      ]
  }]
}' \
https://some-endpoint.semi.network/v1/batch/objects
```

</TabItem>
</Tabs>

You can quickly check the imported object by opening – `weaviate-endpoint/v1/objects` in a browser, like this:

```
https://some-endpoint.semi.network/v1/objects
```

Or you can read the objects in your project, like this:

<Tabs groupId="languages">
<TabItem value="py" label="Python">

```py
import weaviate
import json

client = weaviate.Client("https://some-endpoint.semi.network/")

all_objects = client.data_object.get()
print(json.dumps(all_objects))
```

</TabItem>
<TabItem value="js" label="JavaScript">

```js
const weaviate = require("weaviate-client");

const client = weaviate.client({
    scheme: 'https',
    host: 'some-endpoint.semi.network/',
  }); 

client
    .data
    .getter()
    .do()
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.error(err)
    });
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
	"context"
	"fmt"
	"github.com/semi-technologies/weaviate-go-client/v4/weaviate"
)

func GetSchema() {
    cfg := weaviate.Config{
        Host:   "some-endpoint.semi.network/",
        Scheme: "https",
    }

    client := weaviate.New(cfg)

    data, err := client.Data().ObjectsGetter().
        Do(context.Background())

    if err != nil {
        panic(err)
    }
    fmt.Printf("%v", data)

}
```

</TabItem>
<TabItem value="java" label="Java">

```java
package technology.semi.weaviate;

import java.util.List;
import technology.semi.weaviate.client.Config;
import technology.semi.weaviate.client.WeaviateClient;
import technology.semi.weaviate.client.base.Result;
import technology.semi.weaviate.client.v1.data.model.WeaviateObject;

public class App {
  public static void main(String[] args) {
    Config config = new Config("https", "some-endpoint.semi.network/");

    WeaviateClient client = new WeaviateClient(config);

    Result<List<WeaviateObject>> result = client.data().objectsGetter()
      .run();

    if (result.hasErrors()) {
      System.out.println(result.getError());
      return;
    }
    System.out.println(result.getResult());
  }
}
```

</TabItem>
<TabItem value="curl" label="curl">

```curl
curl https://some-endpoint.semi.network/v1/objects
```

</TabItem>
</Tabs>

## Other object operations
All other CRUD object operations are available in the [objects RESTful API documentation](https://weaviate.io/developers/weaviate/current/restful-api-references/objects.html) and the [batch RESTful API documentation](https://weaviate.io/developers/weaviate/current/restful-api-references/batch.html).

## Recapitulation
Importing into Weaviate needs some planning on your side. In almost all cases, you want to use the [batch endpoint](https://weaviate.io/developers/weaviate/current/restful-api-references/batch.html) to create data objects. More often than not, the bottleneck sits in the import script and not in Weaviate. Try to optimize for maxing out all CPUs to get the fastest import speeds.

## What would you like to learn next?

* [Learn how to query with the GraphQL-API](./query)
* [Bring me back to working with the schema](./schema)
* [Show me how modules work](./modules)