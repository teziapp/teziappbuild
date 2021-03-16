import React from 'react';

import { MaskedInput } from 'grommet';

export const GstnInput = (input) => {
  const [value, setValue] = React.useState(input.value);

  const gstnMask = [
    {
      length: 2,
      regexp: /^[0-9]{1,2}$/,
      placeholder: '11',
    },
    { fixed: ' - ' },
    {
      length:5,
      regexp: /[A-Za-z]/,
      placeholder: 'AAAAA',
    },
    { fixed: ' - ' },
    {
      length: 4,
      regexp: /^[0-9]{1,4}$/,
      placeholder: '1111',
    },
    { fixed: ' - ' },
    {
      length:1,
      regexp: /[A-Za-z]/,
      placeholder: 'A',
    },
    { fixed: ' - ' },
    {
      length:3,
      regexp: /[A-Za-z0-9]/,
      placeholder: '1A1',
    }
  ];

  return (
          <MaskedInput
            name={input.name}
            mask={gstnMask}
            value={value}
            onChange={event => setValue(event.target.value)}
          />
  );
};


export default GstnInput;