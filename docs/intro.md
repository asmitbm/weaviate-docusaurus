---
sidebar_position: 1
---

import Badges from '@site/src/components/badges'

# Weaviate

<Badges></Badges>

Welcome to the Weaviate documentation. Here you will find what Weaviate is all about, how to create your Weaviate instance, interact with it, and use it to perform vector searches and classification.

Like what you see? Consider giving us a ⭐ on [Github](https://github.com/semi-technologies/weaviate/stargazers).

## What is Weaviate?

#### Weaviate in a nutshell:

* Weaviate is an open source ​database of the type ​vector search engine.

* Weaviate allows you to store JSON documents in a class property-like fashion while attaching machine learning vectors to these documents to represent them in vector space.

* Weaviate can be used stand-alone (aka bring your vectors), with a wide variety of modules that can do the vectorization for you or extend the core capabilities.

* Weaviate has a GraphQL-API to access your data easily.

* ​We aim to bring your vector search set up to production to query in mere milliseconds (check our [open source benchmarks](https://weaviate.io/developers/weaviate/current/benchmarks/) to see if Weaviate fits your use case).

* Get to know Weaviate in the [basics getting started guide](https://weaviate.io/developers/weaviate/current/core-knowledge/basics.html) in under five minutes.

#### Weaviate in detail: 

Weaviate is a low-latency vector search engine with out-of-the-box support for different media types (text, images, etc.). It offers Semantic Search, Question-Answer Extraction, Classification, Customizable Models (PyTorch/TensorFlow/Keras), etc. Built from scratch in Go, Weaviate stores both objects and vectors, allowing for combining vector search with structured filtering and the fault-tolerance of a cloud-native database, all accessible through GraphQL, REST, and various programming languages client.

## Weaviate helps

1. **Software Engineers:** Who use Weaviate as an ML-first database for their applications.

    * Out-of-the-box modules for NLP / semantic search, automatic classification, and image similarity search.

    * Easy to integrate with the current architecture, with full CRUD support like other OSS databases.

    * Cloud-native, distributed, runs well on Kubernetes, and scales with one’s workloads.

2. **Data Engineers:**  Who use Weaviate as a vector database that is built up from the ground with ANN at its core and with the same UX they love from Lucene-based search engines.

    * Weaviate has a modular setup that allows you to use your ML models inside Weaviate. Due to its flexibility, you can also use out-of-the-box ML models (e.g., SBERT, ResNet, fasttext, etc.).

    * Weaviate takes care of the scalability so that you don’t have to.

    * Deploy and maintain ML models in production reliably and efficiently.

3. **Data Scientists:** Who use Weaviate for a seamless handover of their Machine Learning models to MLOps.

    * Deploy and maintain your ML models in production reliably and efficiently.

    * Weaviate’s modular design allows you to package any custom-trained model you want easily.

    * Smooth and accelerated handover of your Machine Learning models to engineers.

## Features

Weaviate makes it easy to use state-of-the-art AI models while giving providing the scalability, ease of use, safety and cost-effectiveness of a purpose-built vector database. Most notably:

* **Fast queries:**

    Weaviate typically performs nearest neighbor (NN) searches of millions of objects in considerably less than 100ms. You can find more information on our benchmark page.

* **Ingest any media type with Weaviate Modules:**

    Use State-of-the-Art AI model inference (e.g. Transformers) for accessing Text, Images, etc. data at search-and-query time to let Weaviate manage the process of vectorizing data for you - or providing for importing your own vectors.

* **Combine vector and scalar search:**

    Weaviate allows for efficient, combined vector and scalar searches, e.g “articles related to the COVID 19 pandemic published within the past 7 days”. Weaviate stores both objects and the vectors and ensures the retrieval of both is always efficient. There is no need for a third party object storage.

* **Real-time and persistent:**
    Weaviate let’s you search through your data even if it’s currently being imported or updated. In addition, every write is written to a Write-Ahead-Log (WAL) for immediately persisted writes - even when a crash occurs.

* **Horizontal Scalability:**

    Scale Weaviate for your exact needs, e.g., maximum ingestion, largest possible dataset size, maximum queries per second, etc.

* **High-Availability:**

    Is on our [roadmap](https://weaviate.io/developers/weaviate/current/architecture/roadmap.html) and will be released later this year.

* **Cost-Effectiveness:**

    Very large datasets do not need to be kept entirely in-memory in Weaviate. At the same time, available memory can be used to increase the speed of queries. This allows for a conscious speed/cost trade-off to suit every use case.

* **Graph-like connections between objects:**

    Make arbitrary connections between your objects in a graph-like fashion to resemble real-life connections between your data points. Traverse those connections using GraphQL.

## How does Weaviate work?

Within Weaviate, all individual data objects are based on a class property structure where a vector represents each data object. You can connect data objects (like in a traditional graph) and search for data objects in the vector space.

You can add data to Weaviate through the [RESTful API](https://weaviate.io/developers/weaviate/current/restful-api-references/) end-points and retrieve data through the [GraphQL interface](https://weaviate.io/developers/weaviate/current/graphql-references/).

Weaviates [vector indexing mechanism is modular](https://weaviate.io/developers/weaviate/current/vector-index-plugins/), and the current available plugin is the [Hierarchical Navigable Small World (HNSW) multilayered graph](https://weaviate.io/developers/weaviate/current/vector-index-plugins/hnsw.html).