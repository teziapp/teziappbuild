import React from 'react';

import { MaskedInput } from 'grommet';

export const PanInput = (input) => {
  const [value, setValue] = React.useState(input.value);

  const panMask = [
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
    }
  ];

  return (
          <MaskedInput
            name={input.name}
            mask={panMask}
            value={value}
            onChange={event => setValue(event.target.value)}
          />
  );
};


export default PanInput;