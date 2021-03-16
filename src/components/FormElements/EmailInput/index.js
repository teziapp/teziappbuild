import React from 'react';

import { MaskedInput } from 'grommet';
import { MailOption } from 'grommet-icons';


export const EmailMaskedInput = (input) => {

  const emailMask = [
    {
      regexp: /^[\w\-_.]+$/,
      placeholder: 'example',
    },
    { fixed: '@' },
    {
      regexp: /^[\w]+$/,
      placeholder: 'my',
    },
    { fixed: '.' },
    {
      regexp: /^[\w]+$/,
      placeholder: 'com',
    },
  ];

  return (
          <MaskedInput
            name={input.name}
            icon={<MailOption />}
            mask={emailMask}
          />
  );
};


export default EmailMaskedInput;