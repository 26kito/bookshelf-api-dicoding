const { nanoid } = require("nanoid")
const { books } = require("../models/books")

const getAll = (req, h) => {
    let arr = []
    let booksName = req.query.name
    let isReading = req.query.isReading
    let isFinished = req.query.isFinished

    function pushBookDetails(data) {
        data.forEach(row => {
            arr.push({
                'id': row.id,
                'name': row.name,
                'publisher': row.publisher
            });
        });
    }

    if (booksName) {
        let data = books.filter((row) => row.name.toLowerCase().includes(booksName.toLowerCase()))

        pushBookDetails(data)
    }

    if (isReading) {
        let data = books.filter((row) => row.reading == isReading)

        pushBookDetails(data)
    }

    if (isFinished) {
        let data = books.filter((row) => row.finished == isFinished)

        pushBookDetails(data)
    }

    if (books.length > 0 && Object.keys(req.query).length == 0) {
        books.forEach((data) => {
            arr.push({
                'id': data.id,
                'name': data.name,
                'publisher': data.publisher
            })
        })
    }

    return h.response({
        'status': 'success',
        'data': {
            'books': arr
        }
    }).code(200)
}

const getDetailBook = (req, h) => {
    let bookId = req.params.bookId

    let data = books.filter((data) => data.id == bookId)[0]

    if (!data) {
        return h.response({
            'status': 'fail',
            'message': 'Buku tidak ditemukan'
        }).code(404)
    }

    return h.response({
        'status': 'success',
        'data': {
            'book': data
        }
    }).code(200)
}

const save = (req, h) => {
    let name = req.payload.name
    let year = req.payload.year
    let author = req.payload.author
    let summary = req.payload.summary
    let publisher = req.payload.publisher
    let pageCount = req.payload.pageCount
    let readPage = req.payload.readPage
    let reading = req.payload.reading
    let curDate = new Date().toISOString()

    let data = {
        'id': nanoid(16),
        'name': name,
        'year': year,
        'author': author,
        'summary': summary,
        'publisher': publisher,
        'pageCount': pageCount,
        'readPage': readPage,
        'finished': (pageCount === readPage ? true : false),
        'reading': reading,
        'insertedAt': curDate,
        'updatedAt': curDate
    }

    if (!name) {
        return h.response({
            'status': 'fail',
            'message': 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400)
    }

    if (readPage > pageCount) {
        return h.response({
            'status': 'fail',
            'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400)
    }

    // insert here
    books.push(data)

    return h.response({
        'status': 'success',
        'message': 'Buku berhasil ditambahkan',
        'data': {
            'bookId': data.id
        }
    }).code(201)
}

const update = (req, h) => {
    let bookId = req.params.bookId
    let { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload
    let curDate = new Date().toISOString()

    if (!name) {
        return h.response({
            'status': 'fail',
            'message': 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400)
    }

    if (readPage > pageCount) {
        return h.response({
            'status': 'fail',
            'message': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400)
    }

    let index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading }

        return h.response({
            'status': 'success',
            'message': 'Buku berhasil diperbarui'
        })
    } else {
        return h.response({
            'status': 'fail',
            'message': 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404)
    }
}

module.exports = { save, getAll, getDetailBook, update }