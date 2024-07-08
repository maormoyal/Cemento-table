// src/utils/aggregationsValues.js
const aggregationsValues = (type, id) => {
  let aggregate = '';
  let Aggregated = () => {};

  if (type === 'number') {
    aggregate = 'average';
    Aggregated = ({ cell: { value } }) => ` ${Math.floor(value)} (avg)`;
  }

  if (id === 'lastName' || id === 'firstName') {
    aggregate = 'uniqueCount';
    Aggregated = ({ cell: { value } }) => `${value} (Unique-Names)`;
  }

  if (id === 'email') {
    aggregate = 'uniqueCount';
    Aggregated = ({ cell: { value } }) => `${value} (Unique-Emails)`;
  }

  return {
    aggregate,
    Aggregated,
  };
};

export default aggregationsValues;
