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
}

module.exports = BookmarksService