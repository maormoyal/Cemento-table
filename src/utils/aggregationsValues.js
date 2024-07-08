const aggregationsValues = (type, id) => {
  let aggregate = '';
  let Aggregated = () => {};

  if (type === 'number') {
    aggregate = 'average';
    Aggregated = ({ cell: { value } }) => ` ${Math.floor(value)} (avg)`;
  }

  if (id === 'lastName') {
    aggregate = 'uniqueCount';
    Aggregated = ({ cell: { value } }) => `${value} (Unique-Names)`;
  }

  if (id === 'email') {
    aggregate = 'uniqueCount';
    Aggregated = ({ cell: { value } }) => `${value} (Unique-Names)`;
  }

  return {
    aggregate,
    Aggregated,
  };
};

export default aggregationsValues;
