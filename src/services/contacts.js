import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = ContactsCollection.find({ userId });

  if (typeof filter.isFavourite !== 'undefined') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const [totalItems, data] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage)
      .exec(),
  ]);
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
  };
};

export const getContactById = async (id, userId) => {
  const contact = await ContactsCollection.findOne({ _id: id, userId });
  return contact;
};

export const createContact = async (body) => {
  const result = await ContactsCollection.create(body);
  return result;
};

export const updateContact = async (id, body, userId) => {
  const result = await ContactsCollection.findOneAndUpdate(
    { _id: id, userId },
    body,
    { new: true },
  );
  return result;
};

export const deleteContact = async (id, userId) => {
  const result = await ContactsCollection.findOneAndDelete({ _id: id, userId });
  return result;
};
