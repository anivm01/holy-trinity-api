const knex = require("knex")(require("../knexfile"));

exports.create = async (req, res) => {
    const { title, link, description, categoryId } = req.body;

    try {
        // Start a transaction
        const result = await knex.transaction(async trx => {
            // Step 1: Insert the new resource
            const insertedResources = await trx('priest_resources').insert({
                title,
                link,
                description,
                category_id: categoryId
            })

            const newResourceId = insertedResources[0];

            // Step 2: Determine the next order number for the new resource in its category
            const maxOrder = await trx('resource_order')
                .where({ category_id: categoryId })
                .max('order as maxOrder')
                .first();

            const nextOrderNumber = (maxOrder.maxOrder !== null) ? maxOrder.maxOrder + 1 : 0; // If no resources, start at 0

            // Step 3: Insert the new record into the resource_order table
            await trx('resource_order').insert({
                resource_id: newResourceId,
                category_id: categoryId,
                order: nextOrderNumber
            });

            return { newResourceId, nextOrderNumber }; // Return the new resource ID and its order
        });

        res.json({
            id: result.newResourceId,
            title,
            link,
            description,
            categoryId,
            order: result.nextOrderNumber
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not create resource' });
    }
};

exports.updateSingle = async (req, res) => {
    const { id } = req.params;
    const { title, link, description, categoryId } = req.body;

    try {
        await knex.transaction(async trx => {
            const currentItem = await trx('priest_resources').where('id', id).first();
            const oldCategoryId = currentItem.category_id
            const newCategoryId = categoryId

            if (!currentItem) {
                res.status(404).json({ message: 'Resource not found' });
                return;
            }
            if (categoryId !== currentItem.category_id) {
                await trx('priest_resources').where('id', id).update({ category_id: newCategoryId });

                // Remove resource from old category order
                await trx('resource_order').where({ resource_id: id, category_id: oldCategoryId }).del();

                // Adjust order in old category
                const resourcesInOldCategory = await trx('resource_order')
                    .where({ category_id: oldCategoryId })
                    .orderBy('order', 'asc');

                for (let i = 0; i < resourcesInOldCategory.length; i++) {
                    await trx('resource_order')
                        .where({
                            resource_id: resourcesInOldCategory[i].resource_id, // Use resource_id directly
                            category_id: oldCategoryId
                        })
                        .update({ order: i });
                }

                // Add resource to the end of the new category
                const maxOrder = await trx('resource_order')
                    .where({ category_id: newCategoryId })
                    .max('order as maxOrder')
                    .first();

                const nextOrderNumber = maxOrder.maxOrder !== null ? maxOrder.maxOrder + 1 : 0;

                await trx('resource_order').insert({
                    resource_id: id,
                    category_id: newCategoryId,
                    order: nextOrderNumber
                });
            }
            const updated = await trx('priest_resources')
                .where('id', id)
                .update({
                    title,
                    link,
                    description
                });

            if (updated) {
                res.json({ success: true, message: 'Resource updated successfully.' });
            } else {
                res.status(404).json({ success: false, message: 'Resource not found.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Could not update resource.' });
    }
};

exports.deleteSingle = async (req, res) => {
    const { id } = req.params; // Extract the resource ID from the URL

    try {
        await knex.transaction(async trx => {
            // Retrieve the resource and its category for ordering adjustments
            const resourceToDelete = await trx('priest_resources').where('id', id).select('category_id').first();
            if (!resourceToDelete) {
                res.status(404).json({ success: false, message: 'Resource not found.' });
                return;
            }

            // Delete the resource
            await trx('priest_resources').where('id', id).del();

            // Fetch current order of all resources in the same category
            const resourcesInCategory = await trx('resource_order')
                .where('category_id', resourceToDelete.category_id)
                .orderBy('order', 'asc');

            // Filter out the deleted resource and update the order of remaining resources
            let order = 0;
            for (let resource of resourcesInCategory) {
                if (resource.resource_id !== parseInt(id)) {
                    await trx('resource_order')
                        .where({ resource_id: resource.resource_id, category_id: resourceToDelete.category_id })
                        .update({ order });
                    order++;
                } else {
                    // Remove the resource order entry for the deleted resource
                    await trx('resource_order').where({ resource_id: resource.resource_id }).del();
                }
            }

            res.json({ success: true, message: 'Resource deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Could not delete resource.' });
    }
};

exports.readAll = async (_req, res) => {
    try {
        // Fetch categories
        const categories = await knex('resource_categories')
            .orderBy('order', 'asc')
            .select('id', 'name');

        // Map over categories to attach resources to each
        const categoryResources = await Promise.all(categories.map(async (category) => {
            const resources = await knex('priest_resources')
                .join('resource_order', 'priest_resources.id', 'resource_order.resource_id')
                .where('priest_resources.category_id', category.id)
                .orderBy('resource_order.order', 'asc')
                .select('priest_resources.id', 'title', 'description', 'link', 'priest_resources.category_id');

            return {
                category: category.name,
                category_id: category.id,
                resources
            };
        }));

        res.json(categoryResources);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch resources' });
    }
};

exports.createCategory = async (req, res) => {
    const { name } = req.body; // Assuming the name of the new category is provided in the request body

    try {
        const maxOrderObj = await knex('resource_categories').max('order as maxOrder').first();
        const maxOrder = maxOrderObj.maxOrder ? maxOrderObj.maxOrder : 0; // Handle case where there are no existing categories

        // Perform the insert operation
        const insertResult = await knex('resource_categories').insert({
            name,
            order: maxOrder + 1 // Set the new category's order to one more than the current maximum
        });

        // In MySQL, the insert result is an array with the first element being the insertId
        const newCategoryId = insertResult[0];

        res.json({ success: true, message: 'Category created successfully.', id: newCategoryId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not create category.' });
    }


    // try {
    //     const [id] = await knex('resource_categories').insert({ name });
    //     res.json({ id, name });
    // } catch (error) {
    //     res.status(500).json({ error: 'Could not create category' });
    // }
};

exports.updateCategoryOrder = async (req, res) => {
    const orderedCategories = req.body; // Expect an array of category IDs in their new order
    try {
        await knex.transaction(async trx => {
            await Promise.all(orderedCategories.map((categoryId, index) =>
                trx('resource_categories').where('id', categoryId).update({ order: index })
            ));
        });

        res.json({ success: true, message: 'Categories reordered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not reorder categories' });
    }
}

exports.updateCategory = async (req, res) => {
    const { id } = req.params; // Extract the category ID from the URL
    const { name } = req.body; // Extract the new name from the request body

    try {
        // Perform the update operation
        const updated = await knex('resource_categories')
            .where('id', id)
            .update({ name });

        // Check if the category was found and updated
        if (updated) {
            // Successfully updated the category
            res.json({ success: true, message: 'Category updated successfully.', id, name });
        } else {
            // No category was found with the given ID
            res.status(404).json({ success: false, message: 'Category not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Could not update category.' });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params; // Extract the category ID from the URL

    try {
        // Perform the delete operation
        const deleted = await knex('resource_categories')
            .where('id', id)
            .delete();

        // Check if the category was found and deleted
        if (deleted) {
            // Successfully deleted the category
            res.json({ success: true, message: 'Category deleted successfully.' });
        } else {
            // No category was found with the given ID
            res.status(404).json({ success: false, message: 'Category not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Could not delete category.' });
    }
};

exports.readAllCategories = async (_req, res) => {
    try {
        // Fetch all categories, ordered by 'order' column to respect custom ordering
        const categories = await knex('resource_categories').orderBy('order', 'asc').select();

        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Could not fetch categories' });
    }
}

exports.readCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const resources = await knex('priest_resources')
            .join('resource_order', 'priest_resources.id', '=', 'resource_order.resource_id')
            .where('priest_resources.category_id', categoryId)
            .orderBy('resource_order.order', 'asc')
            .select('priest_resources.*', 'resource_order.order');

        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching resources for the category' });
    }
}

exports.createResourceOrder = async (req, res) => {
    const { order, categoryId } = req.body; // order is an array of resourceIds
    try {
        await knex.transaction(async trx => {
            await Promise.all(order.map((resourceId, index) =>
                trx('resource_order').update({ order: index }).where({ resource_id: resourceId, category_id: categoryId })
            ));
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Could not update resource order' });
    }
};

