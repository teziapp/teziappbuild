import React from 'react';
import { MaskedInput } from 'grommet';
import { Phone } from 'grommet-icons';

export const PhoneInput = (input) => {

  return (
          <MaskedInput
            name={input.name}
            icon={<Phone />}
            mask={[
              { fixed: '+91 - ' },
              {
                length: 5,
                regexp: /^[0-9]{1,5}$/,
                placeholder: 'xxxxx',
              },
              { fixed: ' - ' },
              {
                length: 5,
                regexp: /^[0-9]{1,5}$/,
                placeholder: 'xxxxx',
              }
            ]}
          />
  );
};

export default PhoneInput