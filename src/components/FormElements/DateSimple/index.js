import React, {useState} from 'react';
import { DateInput } from 'grommet';

export const DateSimple = (input) => {
  const [value, setValue] = useState(input.newOrderDate ? input.newOrderDate : (new Date()).toISOString());
  const [open, setOpen] = useState(false);

  return (
    <DateInput
        name={input.name}
        value={value} 
        open = {open}
        dropProps = {{width:"medium"}}
        onChange={event => {
        setValue(event.value);
        setOpen(false);
    }} />
  );
};

// DateSimple.parameters = {
//   chromatic: { disable: true },
// };

export default DateSimple;