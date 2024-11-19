const asyncHandler= require("express-async-handler");
const Contact=require("../models/contactModel");
//  @desc for get contacts
// @  get route /api/contacts
// @ access public

 const getContacts=asyncHandler(async(req,res)=>{
    const contact= await Contact.find({user_id:req.user.id});
    res.status(201).json(contact);
 });

//  @desc for create contacts
// @  post route /api/contacts
// @ access public

const createContact=asyncHandler(async(req,res)=>{
    console.log(req.body);
    const {name, email, phone}=req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error ("All fields are mandatory");
    }
    const contact= await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id
    });
    res.status(200).json(contact);
 });

 //  @desc for get contacts for id
// @  get route /api/contacts/id
// @ access public

const getContact=asyncHandler(async(req,res)=>{
    const contact= await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found");
    }
    res.status(200).json(contact);
 });

 //  @desc for update contacts for id
// @  put route /api/contacts/id
// @ access public

const updateContact=asyncHandler(async(req,res)=>{
    const contact= await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found");
    }
    if(contact.user_id.toString() !==req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update the other user contacts")
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(200).json(updatedContact);
 });

 //  @desc for delete contacts for id
// @  delete route /api/contacts/id
// @ access public

const deleteContact=asyncHandler(async(req,res)=>{
    const contact= await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found");
    }
    if(contact.user_id.toString() !==req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update the other user contacts")
    }
    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Contact deleted successfully", contact });
 });

 module.exports={getContacts, createContact, getContact, updateContact,deleteContact};