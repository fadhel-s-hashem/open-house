const Listing = require('../models/listing')

const showNewForm = (req, res) => {
    res.render("listings/new.ejs")
}
//=======================================
const create = async (req, res) => {
    console.log(req.session) //
    const listingData = {}
    listingData.price = req.body.price 
    listingData.streetAddres = req.body.streetAddres 
    listingData.city = req.body.city 
    listingData.size = req.body.size 
    listingData.owner = req.session.user._id
     //
     if ( req.body.image) {
        listingData.image = req.body.image
     }

    let createdList = await Listing.create(listingData)

  res.redirect('/listings')
}
//============================================================
const index = async (req, res) => {
    
    let allList = await Listing.find()
    // console.log(allList)
    res.render('listings/index.ejs' , 
       { allList: allList

       })
   
    }
//=================================================================


module.exports = {
    showNewForm,
    create,
    index,
}