const Listing = require('../models/listing')

const cloudinary = require('../config/cloudinary')
///////////////////////////////////////////////////////////
const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'open-house/listings',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

//=======================================================
const showNewForm = (req, res) => {
    res.render("listings/new.ejs")
}
//=======================================
const create = async (req, res) => {
console.log(req.body)
console.log(req.file)
  if (!req.file){
   return res.render('error.ejs' , {
     msg: 'Please select an image'
   })
 }
  
  const uploadedImage = await uploadImage(req.file.buffer)  
    const listingData = {}
    listingData.price = req.body.price 
    listingData.streetAddres = req.body.streetAddres 
    listingData.city = req.body.city 
    listingData.size = req.body.size 
    listingData.owner = req.session.user._id
    listingData.image = {
       url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    }

    
     if (req.body.image) {
        listingData.image = req.body.image
     }

    let createdList = await Listing.create(listingData)
console.log(listingData);

  res.redirect('/listings')
}
//============================================================
const index = async (req, res) => {
    // populate will look if any thin efrenced======
    let allList = await Listing.find().populate('owner')
    // console.log(allList)
    res.render('listings/index.ejs' , 
       { allList: allList

       })
   
    }
//=================================================================

const show = async (req, res) => {
  const finidlisting = await Listing.findById(
    req.params.listingId
  ).populate('owner').populate('questions.author')

  const userHasFavorited = finidlisting.favoritedByUser.some((user) =>{
    return user.equals(req.session.user._id)
  })

  res.render('listings/show.ejs', {
    finidlisting,
    userHasFavorited : userHasFavorited,
  })
}
//==================================================================

// const deleteListing = async (req,res) => {
//     await Listing.findByIdAndDelete(req.params.listingId)
//     res.redirect('/Listings')
// }

// more advanced way===== (DeLETE)
const deleteListing = async (req, res) => {
    const finidlisting = await Listing.findById(req.params.listingId)

    if (finidlisting.owner.equals(req.session.user._id)) {
        await Listing.findByIdAndDelete(req.params.listingId)
        res.redirect('/listings')
    } else {
        res.render("error.ejs" , {
          msg: "you dont have premission"
        })
    }

}
//==============================================================
// show edit page
// dont forge populate to check user
const editList = async (req,res) => {
  let updatedList = await Listing.findById(req.params.listingId).populate('owner')
  // console.log(updatedList)
  res.render('listings/editList.ejs' ,{
    finidlisting: updatedList
  })
}
//===========================================================
// update from edit page
const update = async (req, res) => {
    const finidlisting = await Listing.findById(req.params.listingId)
    const oldPublic = finidlisting.image?.publicId
  const editedList = {}

   editedList.price = req.body.price 
    editedList.streetAddres = req.body.streetAddres 
    editedList.city = req.body.city 
    editedList.size = req.body.size 
    // editedList.image = req.body.image 

    if (req.file) {
      const uploadedImage = await uploadImage(req.file.buffer) 

      finidlisting.image = {
         url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      }
    }

     await Listing.findByIdAndUpdate(req.params.listingId, editedList, { new: true })
     res.redirect(`/listings/${req.params.listingId}`)
    
}
//===========================================================


const favorite = async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.listingId, {
      $push: { favoritedByUser: req.params.userId },
    })
    res.redirect(`/listings/${req.params.listingId}`)
}

//=========================================================
const unfavorite =  async (req, res) => {
     await Listing.findByIdAndUpdate(req.params.listingId, {
      $pull: { favoritedByUser: req.params.userId },
    })
    res.redirect(`/listings/${req.params.listingId}`)
}

module.exports = {
    showNewForm,
    create,
    index,
    show,
    deleteListing,
    editList,
    update,
    favorite,
    unfavorite,
}