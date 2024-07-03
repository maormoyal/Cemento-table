// src/utils/generateData.js
import { faker } from '@faker-js/faker';

export const generateColumns = () => [
  {
    id: 'avatar',
    ordinalNo: 5,
    title: 'Avatar',
    type: 'string',
    width: 50,
  },
  {
    id: '_id',
    ordinalNo: 1,
    title: 'ID',
    type: 'string',
    width: 200,
  },
  {
    id: 'firstName',
    ordinalNo: 2,
    title: 'First Name',
    type: 'string',
    width: 100,
  },
  {
    id: 'lastName',
    ordinalNo: 3,
    title: 'Last Name',
    type: 'string',
    width: 100,
  },
  {
    id: 'email',
    ordinalNo: 4,
    title: 'Email',
    type: 'string',
    width: 200,
  },

  {
    id: 'birthday',
    ordinalNo: 6,
    title: 'Birthday',
    type: 'date',
    width: 150,
  },
  {
    id: 'age',
    ordinalNo: 7,
    title: 'Age',
    type: 'number',
    width: 50,
  },
  {
    id: 'gender',
    ordinalNo: 8,
    title: 'Gender',
    type: 'string',
    width: 80,
  },
  {
    id: 'status',
    ordinalNo: 9,
    title: 'Status',
    type: 'boolean',
    width: 80,
  },
  {
    id: 'role',
    ordinalNo: 10,
    title: 'Role',
    type: 'selection',
    width: 80,
  },
];

export const generateData = (rowCount) => {
  return Array.from({ length: rowCount }, () => {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
      firstName,
      lastName,
    });

    return {
      _id: faker.string.uuid(),
      firstName,
      lastName,
      email,
      avatar: faker.image.avatar(),
      birthday: new Date(faker.date.birthdate()).toDateString(),
      age: faker.number.int({ min: 18, max: 65 }),
      gender,
      subscriptionTier: faker.helpers.arrayElement([
        'free',
        'basic',
        'business',
      ]),
      status: faker.datatype.boolean(),
      role: faker.helpers.arrayElement(['Admin', 'User', 'Guest']),
    };
  });
};
