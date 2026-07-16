const Listing = require('../models/listing')


const create = async (req, res) => {
    const finidlisting = await Listing.findById(req.params.listingId)

    const questionData = {}
    questionData.text = req.body.text
    questionData.author = req.session.user._id

console.log(req.session.user._id);

    finidlisting.questions.push(questionData)
    await finidlisting.save()

res.redirect(`/Listings/${req.params.listingId}`)
}

module.exports = {
    create,
}
