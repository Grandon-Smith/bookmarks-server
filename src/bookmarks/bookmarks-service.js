const BookmarksService = {
    getAllBookmarks(knex) {
        return knex
            .select('*')
            .from('bookmarks_test')
    },
    getById(knex, id) {
        return knex
            .from('bookmarks_test')
            .select('*')
            .where('id', id)
            .first()
    },
    postBookmark(knex, newBookmark) {
        return knex
            .insert(newBookmark)
            .into('bookmarks_test')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteBookmark(knex, id) {
        return knex('bookmarks_test')
            .where({ id })
            .delete()
    }
}

module.exports = BookmarksService