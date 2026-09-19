'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commonBg8BBTC1_node = require('./common-B30b72EX.node.cjs.js');
require('@firebase/app');
require('@firebase/util');
require('@firebase/webchannel-wrapper/bloom-blob');
require('@firebase/logger');
require('util');
require('crypto');
require('@grpc/grpc-js');
require('@grpc/proto-loader');
require('re2js');

/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @deprecated use selectablesToObject instead
 * @param selectables
 */
function selectablesToMap(selectables) {
    return new Map(Object.entries(selectablesToObject(selectables)));
}
function selectablesToObject(selectables) {
    const result = {};
    for (const selectable of selectables) {
        let alias;
        let expression;
        if (typeof selectable === 'string') {
            alias = selectable;
            expression = commonBg8BBTC1_node.field(selectable);
        }
        else if (selectable instanceof commonBg8BBTC1_node.Field) {
            alias = selectable.alias;
            expression = selectable.expr;
        }
        else if (selectable instanceof commonBg8BBTC1_node.AliasedExpression) {
            alias = selectable.alias;
            expression = selectable.expr;
        }
        else {
            commonBg8BBTC1_node.fail(0x5319, { selectable });
        }
        if (result[alias] !== undefined) {
            throw new commonBg8BBTC1_node.FirestoreError('invalid-argument', `Duplicate alias or field '${alias}'`);
        }
        result[alias] = expression;
    }
    return result;
}
function aliasedAggregateToMap(aliasedAggregatees) {
    return aliasedAggregatees.reduce((map, selectable) => {
        if (map.get(selectable.alias) !== undefined) {
            throw new commonBg8BBTC1_node.FirestoreError('invalid-argument', `Duplicate alias or field '${selectable.alias}'`);
        }
        map.set(selectable.alias, selectable.aggregate);
        return map;
    }, new Map());
}
/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */
function vectorToExpr(value) {
    if (value instanceof commonBg8BBTC1_node.Expression) {
        return value;
    }
    else if (value instanceof commonBg8BBTC1_node.VectorValue) {
        const result = commonBg8BBTC1_node.constant(value);
        return result;
    }
    else if (Array.isArray(value)) {
        const result = commonBg8BBTC1_node.constant(commonBg8BBTC1_node.vector(value));
        return result;
    }
    else {
        throw new Error('Unsupported value: ' + typeof value);
    }
}
/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 * If the input is a string, it is assumed to be a field name, and a
 * field(value) is returned.
 *
 * @private
 * @internal
 * @param value
 */
function fieldOrExpression(value) {
    if (commonBg8BBTC1_node.isString$1(value)) {
        const result = commonBg8BBTC1_node.field(value);
        return result;
    }
    else {
        return valueToDefaultExpr(value);
    }
}
/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */
function valueToDefaultExpr(value) {
    let result;
    if (commonBg8BBTC1_node.isFirestoreValue(value)) {
        return commonBg8BBTC1_node.constant(value);
    }
    if (value instanceof commonBg8BBTC1_node.Expression) {
        return value;
    }
    else if (commonBg8BBTC1_node.isPlainObject(value)) {
        result = commonBg8BBTC1_node.map(value);
    }
    else if (value instanceof Array) {
        result = commonBg8BBTC1_node.array(value);
    }
    else if (isPipeline$1(value)) {
        result = commonBg8BBTC1_node.pipelineValue(value);
    }
    else {
        result = commonBg8BBTC1_node._constant(value, undefined);
    }
    return result;
}
/**
 * Checks if a value is a Pipeline object.
 *
 * We use duck typing here to avoid a circular dependency between pipeline.ts and pipeline_util.ts.
 */
function isPipeline$1(value) {
    return (typeof value === 'object' &&
        value !== null &&
        typeof value.toArrayExpression === 'function');
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 *
 * The Pipeline class provides a flexible and expressive framework for building complex data
 * transformation and query pipelines for Firestore.
 *
 * A pipeline takes data sources, such as Firestore collections or collection groups, and applies
 * a series of stages that are chained together. Each stage takes the output from the previous stage
 * (or the data source) and produces an output for the next stage (or as the final output of the
 * pipeline).
 *
 * Expressions can be used within each stage to filter and transform data through the stage.
 *
 * NOTE: The chained stages do not prescribe exactly how Firestore will execute the pipeline.
 * Instead, Firestore only guarantees that the result is the same as if the chained stages were
 * executed in order.
 *
 * @example
 * ```typescript
 * const db: Firestore; // Assumes a valid firestore instance.
 *
 * // Example 1: Select specific fields and rename 'rating' to 'bookRating'
 * const results1 = await execute(db.pipeline()
 *     .collection("books")
 *     .select("title", "author", field("rating").as("bookRating")));
 *
 * // Example 2: Filter documents where 'genre' is "Science Fiction" and 'published' is after 1950
 * const results2 = await execute(db.pipeline()
 *     .collection("books")
 *     .where(and(field("genre").equal("Science Fiction"), field("published").greaterThan(1950))));
 *
 * // Example 3: Calculate the average rating of books published after 1980
 * const results3 = await execute(db.pipeline()
 *     .collection("books")
 *     .where(field("published").greaterThan(1980))
 *     .aggregate(average(field("rating")).as("averageRating")));
 * ```
 */
let Pipeline$1 = class Pipeline {
    /**
     * @internal
     * @private
     * @param _db
     * @param userDataReader
     * @param _userDataWriter
     * @param stages
     */
    constructor(
    /**
     * @internal
     * @private
     */
    _db, 
    /**
     * @internal
     * @private
     */
    userDataReader, 
    /**
     * @internal
     * @private
     */
    _userDataWriter, 
    /**
     * @internal
     * @private
     */
    stages) {
        this._db = _db;
        this.userDataReader = userDataReader;
        this._userDataWriter = _userDataWriter;
        this.stages = stages;
    }
    _readUserData(context) {
        this.stages.forEach(stage => {
            const subContext = context.contextWith({
                methodName: stage._name
            });
            stage._readUserData(subContext);
        });
    }
    addFields(fieldOrOptions, ...additionalFields) {
        // Process argument union(s) from method overloads
        let fields;
        let options;
        if (commonBg8BBTC1_node.isSelectable(fieldOrOptions)) {
            fields = [fieldOrOptions, ...additionalFields];
            options = {};
        }
        else {
            ({ fields, ...options } = fieldOrOptions);
        }
        // Convert user land convenience types to internal types
        const normalizedFields = selectablesToMap(fields);
        // Create stage object
        const stage = new commonBg8BBTC1_node.AddFields(normalizedFields, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    removeFields(fieldValueOrOptions, ...additionalFields) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isField(fieldValueOrOptions) || commonBg8BBTC1_node.isString$1(fieldValueOrOptions)
            ? {}
            : fieldValueOrOptions;
        const fields = commonBg8BBTC1_node.isField(fieldValueOrOptions) || commonBg8BBTC1_node.isString$1(fieldValueOrOptions)
            ? [fieldValueOrOptions, ...additionalFields]
            : fieldValueOrOptions.fields;
        // Convert user land convenience types to internal types
        const convertedFields = fields.map(f => commonBg8BBTC1_node.isString$1(f) ? commonBg8BBTC1_node.field(f) : f);
        // Create stage object
        const stage = new commonBg8BBTC1_node.RemoveFields(convertedFields, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    define(aliasedExpressionOrOptions, ...additionalExpressions) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isAliasedExpr(aliasedExpressionOrOptions)
            ? {}
            : aliasedExpressionOrOptions;
        const aliasedExpressions = commonBg8BBTC1_node.isAliasedExpr(aliasedExpressionOrOptions)
            ? [aliasedExpressionOrOptions, ...additionalExpressions]
            : aliasedExpressionOrOptions.variables;
        const convertedExpressions = selectablesToMap(aliasedExpressions);
        // Create stage object
        const stage = new commonBg8BBTC1_node.Define(convertedExpressions, options);
        return this._addStage(stage);
    }
    /**
     * Converts this Pipeline into an expression that evaluates to an array of results.
     *
     * <p>Result Unwrapping:</p>
     * <ul>
     *  <li>If the items have a single field, their values are unwrapped and returned directly in the array.</li>
     *  <li>If the items have multiple fields, they are returned as objects in the array</li>
     * </ul>
     *
     * @example
     * ```typescript
     * // Get a list of reviewers for each book
     * db.pipeline().collection("books")
     *     .define(field("id").as("book_id"))
     *     .addFields(
     *         db.pipeline().collection("reviews")
     *             .where(field("book_id").equal(variable("book_id")))
     *             .select(field("reviewer"))
     *             .toArrayExpression()
     *             .as("reviewers")
     *     )
     * ```
     *
     * Output:
     * ```json
     * [
     *   {
     *     "id": "1",
     *     "title": "1984",
     *     "reviewers": ["Alice", "Bob"]
     *   }
     * ]
     * ```
     *
     * Multiple Fields:
     * ```typescript
     * // Get a list of reviews (reviewer and rating) for each book
     * db.pipeline().collection("books")
     *     .define(field("id").as("book_id"))
     *     .addFields(
     *         db.pipeline().collection("reviews")
     *             .where(field("book_id").equal(variable("book_id")))
     *             .select(field("reviewer"), field("rating"))
     *             .toArrayExpression()
     *             .as("reviews"))
     * ```
     *
     * Output:
     * ```json
     * [
     *   {
     *     "id": "1",
     *     "title": "1984",
     *     "reviews": [
     *       { "reviewer": "Alice", "rating": 5 },
     *       { "reviewer": "Bob", "rating": 4 }
     *     ]
     *   }
     * ]
     * ```
     *
     * @returns An `Expression` representing the execution of this pipeline.
     */
    toArrayExpression() {
        return new commonBg8BBTC1_node.FunctionExpression('array', [fieldOrExpression(this)]);
    }
    /**
     * Converts this Pipeline into an expression that evaluates to a single scalar result.
     *
     * <p><b>Runtime Validation:</b> The runtime validates that the result set contains zero or one item. If
     * zero items, it evaluates to `null`.</p>
     *
     * <p>Result Unwrapping:</p>
     * <ul>
     *  <li>If the item has a single field, its value is unwrapped and returned directly.</li>
     *  <li>If the item has multiple fields, they are returned as an object.</li>
     * </ul>
     *
     * @example
     * ```typescript
     * // Calculate average rating for a restaurant
     * db.pipeline().collection("restaurants").addFields(
     *   db.pipeline().collection("reviews")
     *     .where(field("restaurant_id").equal(variable("rid")))
     *     .aggregate(average("rating").as("avg"))
     *     // Unwraps the single "avg" field to a scalar double
     *     .toScalarExpression().as("average_rating")
     * )
     * ```
     *
     * Output:
     * ```json
     * {
     *   "name": "The Burger Joint",
     *   "average_rating": 4.5
     * }
     * ```
     *
     * Multiple Fields:
     * ```typescript
     * // Calculate average rating AND count for a restaurant
     * db.pipeline().collection("restaurants").addFields(
     *   db.pipeline().collection("reviews")
     *     .where(field("restaurant_id").equal(variable("rid")))
     *     .aggregate(
     *       average("rating").as("avg"),
     *       count().as("count")
     *     )
     *     // Returns an object with "avg" and "count" fields
     *     .toScalarExpression().as("stats")
     * )
     * ```
     *
     * Output:
     * ```json
     * {
     *   "name": "The Burger Joint",
     *   "stats": {
     *     "avg": 4.5,
     *     "count": 100
     *   }
     * }
     * ```
     *
     * @returns An `Expression` representing the execution of this pipeline.
     */
    toScalarExpression() {
        return new commonBg8BBTC1_node.FunctionExpression('scalar', [fieldOrExpression(this)]);
    }
    select(selectionOrOptions, ...additionalSelections) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isSelectable(selectionOrOptions) || commonBg8BBTC1_node.isString$1(selectionOrOptions)
            ? {}
            : selectionOrOptions;
        const selections = commonBg8BBTC1_node.isSelectable(selectionOrOptions) || commonBg8BBTC1_node.isString$1(selectionOrOptions)
            ? [selectionOrOptions, ...additionalSelections]
            : selectionOrOptions.selections;
        // Convert user land convenience types to internal types
        const normalizedSelections = selectablesToMap(selections);
        // Create stage object
        const stage = new commonBg8BBTC1_node.Select(normalizedSelections, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    where(conditionOrOptions) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isBooleanExpr(conditionOrOptions) ? {} : conditionOrOptions;
        const condition = commonBg8BBTC1_node.isBooleanExpr(conditionOrOptions)
            ? conditionOrOptions
            : conditionOrOptions.condition;
        // Create stage object
        const stage = new commonBg8BBTC1_node.Where(condition, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    offset(offsetOrOptions) {
        // Process argument union(s) from method overloads
        let options;
        let offset;
        if (commonBg8BBTC1_node.isNumber$1(offsetOrOptions)) {
            options = {};
            offset = offsetOrOptions;
        }
        else {
            options = offsetOrOptions;
            offset = offsetOrOptions.offset;
        }
        // Create stage object
        const stage = new commonBg8BBTC1_node.Offset(offset, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    limit(limitOrOptions) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isNumber$1(limitOrOptions) ? {} : limitOrOptions;
        const limit = commonBg8BBTC1_node.isNumber$1(limitOrOptions)
            ? limitOrOptions
            : limitOrOptions.limit;
        // Create stage object
        const stage = new commonBg8BBTC1_node.Limit(limit, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    distinct(groupOrOptions, ...additionalGroups) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isString$1(groupOrOptions) || commonBg8BBTC1_node.isSelectable(groupOrOptions)
            ? {}
            : groupOrOptions;
        const groups = commonBg8BBTC1_node.isString$1(groupOrOptions) || commonBg8BBTC1_node.isSelectable(groupOrOptions)
            ? [groupOrOptions, ...additionalGroups]
            : groupOrOptions.groups;
        // Convert user land convenience types to internal types
        const convertedGroups = selectablesToMap(groups);
        // Create stage object
        const stage = new commonBg8BBTC1_node.Distinct(convertedGroups, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    aggregate(targetOrOptions, ...rest) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isAliasedAggregate(targetOrOptions) ? {} : targetOrOptions;
        const accumulators = commonBg8BBTC1_node.isAliasedAggregate(targetOrOptions)
            ? [targetOrOptions, ...rest]
            : targetOrOptions.accumulators;
        const groups = commonBg8BBTC1_node.isAliasedAggregate(targetOrOptions)
            ? []
            : (targetOrOptions.groups ?? []);
        // Convert user land convenience types to internal types
        const convertedAccumulators = aliasedAggregateToMap(accumulators);
        const convertedGroups = selectablesToMap(groups);
        // Create stage object
        const stage = new commonBg8BBTC1_node.Aggregate(convertedGroups, convertedAccumulators, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    /**
     * Performs a vector proximity search on the documents from the previous stage, returning the
     * K-nearest documents based on the specified query `vectorValue` and `distanceMeasure`. The
     * returned documents will be sorted in order from nearest to furthest from the query `vectorValue`.
     *
     * @example
     * ```typescript
     * // Find the 10 most similar books based on the book description.
     * const bookDescription = "Lorem ipsum...";
     * const queryVector: number[] = ...; // compute embedding of `bookDescription`
     *
     * firestore.pipeline().collection("books")
     *     .findNearest({
     *       field: 'embedding',
     *       vectorValue: queryVector,
     *       distanceMeasure: 'euclidean',
     *       limit: 10,                        // optional
     *       distanceField: 'computedDistance' // optional
     *     });
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    findNearest(options) {
        // Convert user land convenience types to internal types
        const field = commonBg8BBTC1_node.toField(options.field);
        const vectorValue = vectorToExpr(options.vectorValue);
        const distanceField = options.distanceField
            ? commonBg8BBTC1_node.toField(options.distanceField)
            : undefined;
        const internalOptions = {
            distanceField,
            limit: options.limit,
            rawOptions: options.rawOptions
        };
        // Create stage object
        const stage = new commonBg8BBTC1_node.FindNearest(vectorValue, field, options.distanceMeasure, internalOptions);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    // TODO(search) link to external documentation citing list of supported
    // expressions, when that documentation is created. List is not maintained
    // in the SDK because the list will change as the backend enables support.
    /**
     * Add a search stage to the Pipeline. The search stage supports
     * full-text search and geo search expressions.
     *
     * @remarks
     * This must be the first stage of the pipeline. A limited set of expressions are supported in the search stage.
     *
     * @example
     * ```typescript
     * // Full-text search example
     * firestore.pipeline().collection("restaurants")
     * .search({
     *   query: documentMatches("waffles OR pancakes"),
     *   sort: [
     *     score().descending(),
     *   ],
     *   addFields: [
     *     score().as("searchScore"),
     *   ]
     * })
     * ```
     *
     * @example
     * ```typescript
     * // Geo distance search example
     * const queryLocation = new GeoPoint(0, 0);
     * db.pipeline().collection('restaurants').search({
     *   query: field('location').geoDistance(queryLocation).lessThanOrEqual(1000),
     *   sort: [
     *     score().descending(),
     *   ],
     * })
     * ```
     *
     * @param options - An object that specifies parameters for the stage.
     * @return A new `Pipeline` object with this stage appended to the stage list.
     * @beta
     */
    search(options) {
        // Convert user land convenience types to internal types
        const addFields = options.addFields
            ? selectablesToObject(options.addFields)
            : undefined;
        const query = commonBg8BBTC1_node.isExpr(options.query)
            ? options.query
            : commonBg8BBTC1_node.documentMatches(options.query);
        const sort = commonBg8BBTC1_node.isOrdering(options.sort)
            ? [options.sort]
            : options.sort;
        const select = undefined;
        // TODO(search) enable with backend support
        // select = options.select
        //   ? selectablesToObject(options.select)
        //   : undefined;
        const internalOptions = {
            ...options,
            addFields,
            select,
            query,
            sort
        };
        // Create stage object
        const stage = new commonBg8BBTC1_node.Search(internalOptions);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    sort(orderingOrOptions, ...additionalOrderings) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isOrdering(orderingOrOptions) ? {} : orderingOrOptions;
        const orderings = commonBg8BBTC1_node.isOrdering(orderingOrOptions)
            ? [orderingOrOptions, ...additionalOrderings]
            : orderingOrOptions.orderings;
        // Create stage object
        const stage = new commonBg8BBTC1_node.Sort(orderings, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    replaceWith(valueOrOptions) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isString$1(valueOrOptions) || commonBg8BBTC1_node.isExpr(valueOrOptions) ? {} : valueOrOptions;
        const fieldNameOrExpr = commonBg8BBTC1_node.isString$1(valueOrOptions) || commonBg8BBTC1_node.isExpr(valueOrOptions)
            ? valueOrOptions
            : valueOrOptions.map;
        // Convert user land convenience types to internal types
        const mapExpr = fieldOrExpression(fieldNameOrExpr);
        // Create stage object
        const stage = new commonBg8BBTC1_node.Replace(mapExpr, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    sample(documentsOrOptions) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isNumber$1(documentsOrOptions) ? {} : documentsOrOptions;
        let rate;
        let mode;
        if (commonBg8BBTC1_node.isNumber$1(documentsOrOptions)) {
            rate = documentsOrOptions;
            mode = 'documents';
        }
        else if (commonBg8BBTC1_node.isNumber$1(documentsOrOptions.documents)) {
            rate = documentsOrOptions.documents;
            mode = 'documents';
        }
        else {
            rate = documentsOrOptions.percentage;
            mode = 'percent';
        }
        // Create stage object
        const stage = new commonBg8BBTC1_node.Sample(rate, mode, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    union(otherOrOptions) {
        // Process argument union(s) from method overloads
        let options;
        let otherPipeline;
        if (isPipeline(otherOrOptions)) {
            options = {};
            otherPipeline = otherOrOptions;
        }
        else {
            ({ other: otherPipeline, ...options } = otherOrOptions);
        }
        // Create stage object
        const stage = new commonBg8BBTC1_node.Union(otherPipeline, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    unnest(selectableOrOptions, indexField) {
        // Process argument union(s) from method overloads
        let options;
        let selectable;
        let indexFieldName;
        if (commonBg8BBTC1_node.isSelectable(selectableOrOptions)) {
            options = {};
            selectable = selectableOrOptions;
            indexFieldName = indexField;
        }
        else {
            ({
                selectable,
                indexField: indexFieldName,
                ...options
            } = selectableOrOptions);
        }
        // Convert user land convenience types to internal types
        const alias = selectable.alias;
        const expr = selectable.expr;
        if (commonBg8BBTC1_node.isString$1(indexFieldName)) {
            options.indexField = commonBg8BBTC1_node._field(indexFieldName, 'unnest');
        }
        // Create stage object
        const stage = new commonBg8BBTC1_node.Unnest(alias, expr, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    /**
     * Adds a raw stage to the pipeline.
     *
     * <p>This method provides a flexible way to extend the pipeline's functionality by adding custom
     * stages. Each raw stage is defined by a unique `name` and a set of `params` that control its
     * behavior.
     *
     * <p>Example (Assuming there is no 'where' stage available in SDK):
     *
     * @example
     * ```typescript
     * // Assume we don't have a built-in 'where' stage
     * firestore.pipeline().collection('books')
     *     .rawStage('where', [field('published').lessThan(1900)]) // Custom 'where' stage
     *     .select('title', 'author');
     * ```
     *
     * @param name - The unique name of the raw stage to add.
     * @param params - A list of parameters to configure the raw stage's behavior.
     * @param options - An object of key value pairs that specifies optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    rawStage(name, params, options) {
        // Convert user land convenience types to internal types
        const expressionParams = params.map((value) => {
            if (value instanceof commonBg8BBTC1_node.Expression) {
                return value;
            }
            else if (value instanceof commonBg8BBTC1_node.AggregateFunction) {
                return value;
            }
            else if (commonBg8BBTC1_node.isPlainObject(value)) {
                return commonBg8BBTC1_node._mapValue(value);
            }
            else {
                return commonBg8BBTC1_node._constant(value, 'rawStage');
            }
        });
        // Create stage object
        const stage = new commonBg8BBTC1_node.RawStage(name, expressionParams, options ?? {});
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    /**
     * @internal
     * @private
     */
    _toProto(jsonProtoSerializer) {
        const stages = this.stages.map(stage => stage._toProto(jsonProtoSerializer));
        return { stages };
    }
    _addStage(stage) {
        const copy = this.stages.map(s => s);
        copy.push(stage);
        return this.newPipeline(this._db, copy);
    }
    /**
     * @internal
     * @private
     * @param db
     * @param userDataReader
     * @param userDataWriter
     * @param stages
     * @protected
     */
    newPipeline(db, stages) {
        return new Pipeline(db, this.userDataReader, this._userDataWriter, stages);
    }
};
function isPipeline(val) {
    return val instanceof Pipeline$1;
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Provides the entry point for defining the data source of a Firestore {@link @firebase/firestore/pipelines#Pipeline}.
 *
 * Use the methods of this class (e.g., {@link @firebase/firestore/pipelines#PipelineSource.(collection:1)}, {@link @firebase/firestore/pipelines#PipelineSource.(collectionGroup:1)},
 * {@link @firebase/firestore/pipelines#PipelineSource.(database:1)}, or {@link @firebase/firestore/pipelines#PipelineSource.(documents:1)}) to specify the initial data
 * for your pipeline, such as a collection, a collection group, the entire database, or a set of specific documents.
 */
class PipelineSource {
    /**
     * @internal
     * @private
     * @param databaseId
     * @param userDataReader
     * @param _createPipeline
     */
    constructor(databaseId, userDataReader, 
    /**
     * @internal
     * @private
     */
    _createPipeline) {
        this.databaseId = databaseId;
        this.userDataReader = userDataReader;
        this._createPipeline = _createPipeline;
    }
    collection(collectionOrOptions) {
        // Process argument union(s) from method overloads
        const options = commonBg8BBTC1_node.isString$1(collectionOrOptions) ||
            commonBg8BBTC1_node.isCollectionReference(collectionOrOptions)
            ? {}
            : collectionOrOptions;
        const collectionRefOrString = commonBg8BBTC1_node.isString$1(collectionOrOptions) ||
            commonBg8BBTC1_node.isCollectionReference(collectionOrOptions)
            ? collectionOrOptions
            : collectionOrOptions.collection;
        // Validate that a user provided reference is for the same Firestore DB
        if (commonBg8BBTC1_node.isCollectionReference(collectionRefOrString)) {
            this._validateReference(collectionRefOrString);
        }
        // Convert user land convenience types to internal types
        const normalizedCollection = commonBg8BBTC1_node.isString$1(collectionRefOrString)
            ? collectionRefOrString
            : collectionRefOrString.path;
        // Create stage object
        const stage = new commonBg8BBTC1_node.CollectionSource(normalizedCollection, options);
        // User data must be read in the context of the API method to
        // provide contextual errors
        const parseContext = this.userDataReader.createContext(3 /* UserDataSource.Argument */, 'collection');
        stage._readUserData(parseContext);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    collectionGroup(collectionIdOrOptions) {
        // Process argument union(s) from method overloads
        let collectionId;
        let options;
        if (commonBg8BBTC1_node.isString$1(collectionIdOrOptions)) {
            collectionId = collectionIdOrOptions;
            options = {};
        }
        else {
            ({ collectionId, ...options } = collectionIdOrOptions);
        }
        // Create stage object
        const stage = new commonBg8BBTC1_node.CollectionGroupSource(collectionId, options);
        // User data must be read in the context of the API method to
        // provide contextual errors
        const parseContext = this.userDataReader.createContext(3 /* UserDataSource.Argument */, 'collectionGroup');
        stage._readUserData(parseContext);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    database(options) {
        // Process argument union(s) from method overloads
        options = options ?? {};
        // Create stage object
        const stage = new commonBg8BBTC1_node.DatabaseSource(options);
        // User data must be read in the context of the API method to
        // provide contextual errors
        const parseContext = this.userDataReader.createContext(3 /* UserDataSource.Argument */, 'database');
        stage._readUserData(parseContext);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    documents(docsOrOptions) {
        // Process argument union(s) from method overloads
        let options;
        let docs;
        if (Array.isArray(docsOrOptions)) {
            docs = docsOrOptions;
            options = {};
        }
        else {
            ({ docs, ...options } = docsOrOptions);
        }
        // Validate that all user provided references are for the same Firestore DB
        docs
            .filter(v => v instanceof commonBg8BBTC1_node.DocumentReference)
            .forEach(dr => this._validateReference(dr));
        // Convert user land convenience types to internal types
        const normalizedDocs = docs.map(doc => commonBg8BBTC1_node.isString$1(doc) ? doc : doc.path);
        // Create stage object
        const stage = new commonBg8BBTC1_node.DocumentsSource(normalizedDocs, options);
        // User data must be read in the context of the API method to
        // provide contextual errors
        const parseContext = this.userDataReader.createContext(3 /* UserDataSource.Argument */, 'documents');
        stage._readUserData(parseContext);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    /**
     * Convert the given Query into an equivalent Pipeline.
     *
     * @param query - A Query to be converted into a Pipeline.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */
    createFrom(query) {
        return this._createPipeline(commonBg8BBTC1_node.toPipelineStages(query._query, query.firestore));
    }
    _validateReference(reference) {
        const refDbId = reference.firestore._databaseId;
        if (!refDbId.isEqual(this.databaseId)) {
            throw new commonBg8BBTC1_node.FirestoreError(commonBg8BBTC1_node.Code.INVALID_ARGUMENT, `Invalid ${reference instanceof commonBg8BBTC1_node.CollectionReference
                ? 'CollectionReference'
                : 'DocumentReference'}. ` +
                `The project ID ("${refDbId.projectId}") or the database ("${refDbId.database}") does not match ` +
                `the project ID ("${this.databaseId.projectId}") and database ("${this.databaseId.database}") of the target database of this Pipeline.`);
        }
    }
}
function subcollection(pathOrOptions) {
    // Process argument union(s) from method overloads
    let path;
    let options;
    if (commonBg8BBTC1_node.isString$1(pathOrOptions)) {
        path = pathOrOptions;
        options = {};
    }
    else {
        ({ path, ...options } = pathOrOptions);
    }
    // Create stage object
    const stage = new commonBg8BBTC1_node.SubcollectionSource(path, options);
    return new Pipeline$1(undefined, undefined, undefined, [stage]);
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Represents the results of a Firestore pipeline execution.
 *
 * A `PipelineSnapshot` contains zero or more {@link @firebase/firestore/pipelines#PipelineResult} objects
 * representing the documents returned by a pipeline query. It provides methods
 * to iterate over the documents and access metadata about the query results.
 *
 * @example
 * ```typescript
 * const snapshot: PipelineSnapshot = await firestore
 *   .pipeline()
 *   .collection('myCollection')
 *   .where(field('value').greaterThan(10))
 *   .execute();
 *
 * snapshot.results.forEach(doc => {
 *   console.log(doc.id, '=>', doc.data());
 * });
 * ```
 */
class PipelineSnapshot {
    constructor(pipeline, results, executionTime) {
        this._pipeline = pipeline;
        this._executionTime = executionTime;
        this._results = results;
    }
    /**
     * An array of all the results in the `PipelineSnapshot`.
     */
    get results() {
        return this._results;
    }
    /**
     * The time at which the pipeline producing this result is executed.
     *
     * @readonly
     *
     */
    get executionTime() {
        if (this._executionTime === undefined) {
            throw new Error("'executionTime' is expected to exist, but it is undefined");
        }
        return this._executionTime;
    }
}
/**
 *
 * A PipelineResult contains data read from a Firestore Pipeline. The data can be extracted with the
 * {@link @firebase/firestore/pipelines#PipelineResult.data} or {@link @firebase/firestore/pipelines#PipelineResult.(get:1)} methods.
 *
 * <p>If the PipelineResult represents a non-document result, `ref` will return a undefined
 * value.
 */
class PipelineResult {
    /**
     * @private
     * @internal
     *
     * @param userDataWriter - The serializer used to encode/decode protobuf.
     * @param fields - The fields of the Firestore `Document` Protobuf backing
     * this document.
     * @param ref - The reference to the document.
     * @param createTime - The time when the document was created if the result is a document, undefined otherwise.
     * @param updateTime - The time when the document was last updated if the result is a document, undefined otherwise.
     * @param metadata
     * @param listenOptions
     */
    constructor(userDataWriter, fields, ref, createTime, updateTime, metadata, listenOptions) {
        this._ref = ref;
        this._userDataWriter = userDataWriter;
        this._createTime = createTime;
        this._updateTime = updateTime;
        this._fields = fields;
        this._metadata = metadata;
        this._listenOptions = listenOptions;
    }
    /**
     * @private
     * @internal
     * @param userDataWriter
     * @param doc
     * @param ref
     * @param metadata
     * @param listenOptions
     */
    static fromDocument(userDataWriter, doc, ref, metadata, listenOptions) {
        return new PipelineResult(userDataWriter, doc.data, ref, doc.createTime.toTimestamp(), doc.version.toTimestamp(), metadata, listenOptions);
    }
    /**
     * The reference of the document, if it is a document; otherwise `undefined`.
     */
    get ref() {
        return this._ref;
    }
    /**
     * The ID of the document for which this PipelineResult contains data, if it is a document; otherwise `undefined`.
     *
     * @readonly
     *
     */
    get id() {
        return this._ref?.id;
    }
    /**
     * The time the document was created. Undefined if this result is not a document.
     *
     * @readonly
     */
    get createTime() {
        return this._createTime;
    }
    /**
     * The time the document was last updated (at the time the snapshot was
     * generated). Undefined if this result is not a document.
     *
     * @readonly
     */
    get updateTime() {
        return this._updateTime;
    }
    /**
     * Retrieves all fields in the result as an object.
     *
     * @returns An object containing all fields in the document or
     * 'undefined' if the document doesn't exist.
     *
     * @example
     * ```
     * let p = firestore.pipeline().collection('col');
     *
     * p.execute().then(results => {
     *   let data = results[0].data();
     *   console.log(`Retrieved data: ${JSON.stringify(data)}`);
     * });
     * ```
     */
    data() {
        return this._userDataWriter.convertValue(this._fields.value, this._listenOptions?.serverTimestampBehavior);
    }
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the result as a proto value.
     *
     * @returns An `Object` containing all fields in the result.
     */
    _fieldsProto() {
        // Return a cloned value to prevent manipulation of the Snapshot's data
        return this._fields.clone().value.mapValue.fields;
    }
    /**
     * Retrieves the field specified by `field`.
     *
     * @param field - The field path
     * (e.g. 'foo' or 'foo.bar') to a specific field.
     * @returns The data at the specified field location or `undefined` if no
     * such field exists.
     *
     * @example
     * ```
     * let p = firestore.pipeline().collection('col');
     *
     * p.execute().then(results => {
     *   let field = results[0].get('a.b');
     *   console.log(`Retrieved field value: ${field}`);
     * });
     * ```
     */
    // We deliberately use `any` in the external API to not impose type-checking
    // on end users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(fieldPath) {
        if (this._fields === undefined) {
            return undefined;
        }
        if (commonBg8BBTC1_node.isField(fieldPath)) {
            fieldPath = fieldPath.fieldName;
        }
        const value = this._fields.field(commonBg8BBTC1_node.fieldPathFromArgument('DocumentSnapshot.get', fieldPath));
        if (value !== null) {
            return this._userDataWriter.convertValue(value, this._listenOptions?.serverTimestampBehavior);
        }
    }
}
/**
 * Test equality of two PipelineResults.
 * @param left - First PipelineResult to compare.
 * @param right - Second PipelineResult to compare.
 */
function pipelineResultEqual(left, right) {
    if (left === right) {
        return true;
    }
    return (commonBg8BBTC1_node.isOptionalEqual(left._ref, right._ref, commonBg8BBTC1_node.refEqual) &&
        commonBg8BBTC1_node.isOptionalEqual(left._fields, right._fields, (l, r) => l.isEqual(r)));
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Pipeline extends Pipeline$1 {
    /**
     * @internal
     * @private
     * @param db
     * @param userDataReader
     * @param userDataWriter
     * @param stages
     * @param converter
     * @protected
     */
    newPipeline(db, stages) {
        return new Pipeline(db, this.userDataReader, this._userDataWriter, stages);
    }
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function execute(pipelineOrOptions) {
    const options = !(pipelineOrOptions instanceof Pipeline$1)
        ? pipelineOrOptions
        : {
            pipeline: pipelineOrOptions
        };
    const { pipeline, rawOptions, ...rest } = options;
    if (!pipeline._db) {
        return Promise.reject(new commonBg8BBTC1_node.FirestoreError(commonBg8BBTC1_node.Code.FAILED_PRECONDITION, 'This pipeline was created without a database (e.g., as a subcollection pipeline) and cannot be executed directly. It can only be used as part of another pipeline.'));
    }
    const firestore = commonBg8BBTC1_node.cast(pipeline._db, commonBg8BBTC1_node.Firestore);
    const client = commonBg8BBTC1_node.ensureFirestoreConfigured(firestore);
    const userDataReader = commonBg8BBTC1_node.newUserDataReader(firestore);
    const context = userDataReader.createContext(3 /* UserDataSource.Argument */, 'execute');
    pipeline._readUserData(context);
    const userDataWriter = new commonBg8BBTC1_node.ExpUserDataWriter(firestore);
    const structuredPipelineOptions = new commonBg8BBTC1_node.StructuredPipelineOptions(rest, rawOptions);
    structuredPipelineOptions._readUserData(context);
    const structuredPipeline = new commonBg8BBTC1_node.StructuredPipeline(pipeline, structuredPipelineOptions);
    return commonBg8BBTC1_node.firestoreClientExecutePipeline(client, structuredPipeline).then(result => {
        // Get the execution time from the first result.
        // firestoreClientExecutePipeline returns at least one PipelineStreamElement
        // even if the returned document set is empty.
        const executionTime = result.length > 0 ? result[0].executionTime?.toTimestamp() : undefined;
        const docs = result
            // Currently ignore any response from ExecutePipeline that does
            // not contain any document data in the `fields` property.
            .filter(element => !!element.fields)
            .map(element => new PipelineResult(userDataWriter, element.fields, element.key?.path
            ? new commonBg8BBTC1_node.DocumentReference(firestore, null, element.key)
            : undefined, element.createTime?.toTimestamp(), element.updateTime?.toTimestamp()));
        return new PipelineSnapshot(pipeline, docs, executionTime);
    });
}
/**
 * @beta
 * Creates and returns a new PipelineSource, which allows specifying the source stage of a {@link @firebase/firestore/pipelines#Pipeline}.
 *
 * @example
 * ```typescript
 * let myPipeline: Pipeline = firestore.pipeline().collection('books');
 * ```
 */
// Augment the Firestore class with the pipeline() factory method
commonBg8BBTC1_node.Firestore.prototype.pipeline = function () {
    const userDataReader = commonBg8BBTC1_node.newUserDataReader(this);
    return new PipelineSource(this._databaseId, userDataReader, (stages) => {
        return new Pipeline(this, userDataReader, new commonBg8BBTC1_node.ExpUserDataWriter(this), stages);
    });
};

exports.AggregateFunction = commonBg8BBTC1_node.AggregateFunction;
exports.AliasedAggregate = commonBg8BBTC1_node.AliasedAggregate;
exports.AliasedExpression = commonBg8BBTC1_node.AliasedExpression;
exports.BooleanExpression = commonBg8BBTC1_node.BooleanExpression;
exports.Expression = commonBg8BBTC1_node.Expression;
exports.Field = commonBg8BBTC1_node.Field;
exports.FunctionExpression = commonBg8BBTC1_node.FunctionExpression;
exports.Ordering = commonBg8BBTC1_node.Ordering;
exports._internalPipelineToExecutePipelineRequestProto = commonBg8BBTC1_node._internalPipelineToExecutePipelineRequestProto;
exports.abs = commonBg8BBTC1_node.abs;
exports.add = commonBg8BBTC1_node.add;
exports.and = commonBg8BBTC1_node.and;
exports.array = commonBg8BBTC1_node.array;
exports.arrayAgg = commonBg8BBTC1_node.arrayAgg;
exports.arrayAggDistinct = commonBg8BBTC1_node.arrayAggDistinct;
exports.arrayConcat = commonBg8BBTC1_node.arrayConcat;
exports.arrayContains = commonBg8BBTC1_node.arrayContains;
exports.arrayContainsAll = commonBg8BBTC1_node.arrayContainsAll;
exports.arrayContainsAny = commonBg8BBTC1_node.arrayContainsAny;
exports.arrayFilter = commonBg8BBTC1_node.arrayFilter;
exports.arrayFirst = commonBg8BBTC1_node.arrayFirst;
exports.arrayFirstN = commonBg8BBTC1_node.arrayFirstN;
exports.arrayGet = commonBg8BBTC1_node.arrayGet;
exports.arrayIndexOf = commonBg8BBTC1_node.arrayIndexOf;
exports.arrayIndexOfAll = commonBg8BBTC1_node.arrayIndexOfAll;
exports.arrayLast = commonBg8BBTC1_node.arrayLast;
exports.arrayLastIndexOf = commonBg8BBTC1_node.arrayLastIndexOf;
exports.arrayLastN = commonBg8BBTC1_node.arrayLastN;
exports.arrayLength = commonBg8BBTC1_node.arrayLength;
exports.arrayMaximum = commonBg8BBTC1_node.arrayMaximum;
exports.arrayMaximumN = commonBg8BBTC1_node.arrayMaximumN;
exports.arrayMinimum = commonBg8BBTC1_node.arrayMinimum;
exports.arrayMinimumN = commonBg8BBTC1_node.arrayMinimumN;
exports.arraySlice = commonBg8BBTC1_node.arraySlice;
exports.arraySum = commonBg8BBTC1_node.arraySum;
exports.arrayTransform = commonBg8BBTC1_node.arrayTransform;
exports.arrayTransformWithIndex = commonBg8BBTC1_node.arrayTransformWithIndex;
exports.ascending = commonBg8BBTC1_node.ascending;
exports.average = commonBg8BBTC1_node.average;
exports.byteLength = commonBg8BBTC1_node.byteLength;
exports.ceil = commonBg8BBTC1_node.ceil;
exports.charLength = commonBg8BBTC1_node.charLength;
exports.coalesce = commonBg8BBTC1_node.coalesce;
exports.collectionId = commonBg8BBTC1_node.collectionId;
exports.concat = commonBg8BBTC1_node.concat;
exports.conditional = commonBg8BBTC1_node.conditional;
exports.constant = commonBg8BBTC1_node.constant;
exports.cosineDistance = commonBg8BBTC1_node.cosineDistance;
exports.count = commonBg8BBTC1_node.count;
exports.countAll = commonBg8BBTC1_node.countAll;
exports.countDistinct = commonBg8BBTC1_node.countDistinct;
exports.countIf = commonBg8BBTC1_node.countIf;
exports.currentDocument = commonBg8BBTC1_node.currentDocument;
exports.currentTimestamp = commonBg8BBTC1_node.currentTimestamp;
exports.descending = commonBg8BBTC1_node.descending;
exports.divide = commonBg8BBTC1_node.divide;
exports.documentId = commonBg8BBTC1_node.documentId;
exports.documentMatches = commonBg8BBTC1_node.documentMatches;
exports.dotProduct = commonBg8BBTC1_node.dotProduct;
exports.endsWith = commonBg8BBTC1_node.endsWith;
exports.equal = commonBg8BBTC1_node.equal;
exports.equalAny = commonBg8BBTC1_node.equalAny;
exports.euclideanDistance = commonBg8BBTC1_node.euclideanDistance;
exports.exists = commonBg8BBTC1_node.exists;
exports.exp = commonBg8BBTC1_node.exp;
exports.field = commonBg8BBTC1_node.field;
exports.first = commonBg8BBTC1_node.first;
exports.floor = commonBg8BBTC1_node.floor;
exports.geoDistance = commonBg8BBTC1_node.geoDistance;
exports.greaterThan = commonBg8BBTC1_node.greaterThan;
exports.greaterThanOrEqual = commonBg8BBTC1_node.greaterThanOrEqual;
exports.ifAbsent = commonBg8BBTC1_node.ifAbsent;
exports.ifError = commonBg8BBTC1_node.ifError;
exports.ifNull = commonBg8BBTC1_node.ifNull;
exports.isAbsent = commonBg8BBTC1_node.isAbsent;
exports.isError = commonBg8BBTC1_node.isError;
exports.isType = commonBg8BBTC1_node.isType;
exports.join = commonBg8BBTC1_node.join;
exports.last = commonBg8BBTC1_node.last;
exports.length = commonBg8BBTC1_node.length;
exports.lessThan = commonBg8BBTC1_node.lessThan;
exports.lessThanOrEqual = commonBg8BBTC1_node.lessThanOrEqual;
exports.like = commonBg8BBTC1_node.like;
exports.ln = commonBg8BBTC1_node.ln;
exports.log = commonBg8BBTC1_node.log;
exports.log10 = commonBg8BBTC1_node.log10;
exports.logicalMaximum = commonBg8BBTC1_node.logicalMaximum;
exports.logicalMinimum = commonBg8BBTC1_node.logicalMinimum;
exports.ltrim = commonBg8BBTC1_node.ltrim;
exports.map = commonBg8BBTC1_node.map;
exports.mapEntries = commonBg8BBTC1_node.mapEntries;
exports.mapGet = commonBg8BBTC1_node.mapGet;
exports.mapKeys = commonBg8BBTC1_node.mapKeys;
exports.mapMerge = commonBg8BBTC1_node.mapMerge;
exports.mapRemove = commonBg8BBTC1_node.mapRemove;
exports.mapSet = commonBg8BBTC1_node.mapSet;
exports.mapValues = commonBg8BBTC1_node.mapValues;
exports.maximum = commonBg8BBTC1_node.maximum;
exports.minimum = commonBg8BBTC1_node.minimum;
exports.mod = commonBg8BBTC1_node.mod;
exports.multiply = commonBg8BBTC1_node.multiply;
exports.nor = commonBg8BBTC1_node.nor;
exports.not = commonBg8BBTC1_node.not;
exports.notEqual = commonBg8BBTC1_node.notEqual;
exports.notEqualAny = commonBg8BBTC1_node.notEqualAny;
exports.or = commonBg8BBTC1_node.or;
exports.parent = commonBg8BBTC1_node.parent;
exports.pow = commonBg8BBTC1_node.pow;
exports.rand = commonBg8BBTC1_node.rand;
exports.regexContains = commonBg8BBTC1_node.regexContains;
exports.regexFind = commonBg8BBTC1_node.regexFind;
exports.regexFindAll = commonBg8BBTC1_node.regexFindAll;
exports.regexMatch = commonBg8BBTC1_node.regexMatch;
exports.reverse = commonBg8BBTC1_node.reverse;
exports.round = commonBg8BBTC1_node.round;
exports.rtrim = commonBg8BBTC1_node.rtrim;
exports.score = commonBg8BBTC1_node.score;
exports.split = commonBg8BBTC1_node.split;
exports.sqrt = commonBg8BBTC1_node.sqrt;
exports.startsWith = commonBg8BBTC1_node.startsWith;
exports.stringConcat = commonBg8BBTC1_node.stringConcat;
exports.stringContains = commonBg8BBTC1_node.stringContains;
exports.stringIndexOf = commonBg8BBTC1_node.stringIndexOf;
exports.stringRepeat = commonBg8BBTC1_node.stringRepeat;
exports.stringReplaceAll = commonBg8BBTC1_node.stringReplaceAll;
exports.stringReplaceOne = commonBg8BBTC1_node.stringReplaceOne;
exports.stringReverse = commonBg8BBTC1_node.stringReverse;
exports.substring = commonBg8BBTC1_node.substring;
exports.subtract = commonBg8BBTC1_node.subtract;
exports.sum = commonBg8BBTC1_node.sum;
exports.switchOn = commonBg8BBTC1_node.switchOn;
exports.timestampAdd = commonBg8BBTC1_node.timestampAdd;
exports.timestampDiff = commonBg8BBTC1_node.timestampDiff;
exports.timestampExtract = commonBg8BBTC1_node.timestampExtract;
exports.timestampSubtract = commonBg8BBTC1_node.timestampSubtract;
exports.timestampToUnixMicros = commonBg8BBTC1_node.timestampToUnixMicros;
exports.timestampToUnixMillis = commonBg8BBTC1_node.timestampToUnixMillis;
exports.timestampToUnixSeconds = commonBg8BBTC1_node.timestampToUnixSeconds;
exports.timestampTruncate = commonBg8BBTC1_node.timestampTruncate;
exports.toLower = commonBg8BBTC1_node.toLower;
exports.toUpper = commonBg8BBTC1_node.toUpper;
exports.trim = commonBg8BBTC1_node.trim;
exports.trunc = commonBg8BBTC1_node.trunc;
exports.type = commonBg8BBTC1_node.type;
exports.unixMicrosToTimestamp = commonBg8BBTC1_node.unixMicrosToTimestamp;
exports.unixMillisToTimestamp = commonBg8BBTC1_node.unixMillisToTimestamp;
exports.unixSecondsToTimestamp = commonBg8BBTC1_node.unixSecondsToTimestamp;
exports.variable = commonBg8BBTC1_node.variable;
exports.vectorLength = commonBg8BBTC1_node.vectorLength;
exports.xor = commonBg8BBTC1_node.xor;
exports.Pipeline = Pipeline;
exports.PipelineResult = PipelineResult;
exports.PipelineSnapshot = PipelineSnapshot;
exports.PipelineSource = PipelineSource;
exports.execute = execute;
exports.pipelineResultEqual = pipelineResultEqual;
exports.subcollection = subcollection;
//# sourceMappingURL=pipelines.node.cjs.js.map
