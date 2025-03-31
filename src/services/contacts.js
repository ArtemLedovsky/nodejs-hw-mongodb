import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await ContactsCollection.findById(id);
  return contact;
};

export const createContact = async (body) => {
  const result = await ContactsCollection.create(body);
  return result;
};

export const updateContact = async (id, body) => {
  const result = await ContactsCollection.findByIdAndUpdate(id, body, {
    new: true,
  });
  return result;
};

export const deleteContact = async (id) => {
  const result = await ContactsCollection.findByIdAndDelete(id);
  return result;
};
