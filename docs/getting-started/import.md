---
id: import
sidebar_position: 3
sidebar_label: Import
title: Import
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