const Board = require('../models/board');
const Section = require('../models/section');
const Task = require('../models/task')

exports.create = async (req, res) => {
    try {
        const boardsCount = await Board.find().count()
        const board = await Board.create({
            user: req.user._id,
            position: boardsCount > 0 ? boardsCount : 0
        })
        res.status(201).json(board)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getAll = async (req, res) => {
    try {
        const boards = await Board.find({ user: req.user._id }).sort('-position')

        res.status(200).json(boards)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.updatePosition = async (req, res) => {
    const { boards } = req.body
    try {
        for (const key in boards.reverse()) {
            const board = boards[key]
            const res = await Board.findByIdAndUpdate(
                board.id,
                { $set: { position: key } }
            )
            console.log(res)
            return res
        }

        res.status(200).json('updated')
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getOne = async (req, res) => {
    const { boardId } = req.params
    try {
        const board = await Board.findOne({ user: req.user._id, _id: boardId })

        if (!board) return res.status(404).json('Board not found')
        const sections = await Section.find({ board: boardId })
        for (const section of sections) {
            const tasks = await Task.find({ section: section.id }).populate('section').sort('-position')
            section._doc.tasks = tasks
        }
        board._doc.sections = sections
        res.status(200).json(board)

    } catch (err) {
        res.status(500).json(err)
    }
}

exports.update = async (req, res) => {
    const { boardId } = req.params
    const { title, description, favourite } = req.body

    try {
        // place holder
        if (title === '') req.body.title = 'Untitled'
        if (description === '') req.body.description = 'Add description here'
        // tim vi tri do tu id
        const currentBoard = await Board.findById(boardId)
        if (!currentBoard) return res.status(404).json('Board not found')

        if (favourite !== undefined && currentBoard.favourite !== favourite) {
            const favourites = await Board.find({
                user: currentBoard.user,
                favourite: true,
                _id: { $ne: boardId }
            })
            if (favourite) {
                req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0
            } else {
                for (const key in favourites) {
                    console.log("check key:", key)
                    const element = favourites[key]
                    await Board.findByIdAndUpdate(
                        element.id,
                        { $set: { favouritePosition: key } }
                    )
                }
            }
        }

        const board = await Board.findByIdAndUpdate(
            boardId,
            { $set: req.body }
        )

        res.status(200).json(board)
    } catch (err) {
        res.status(500).json(err)
    }
}