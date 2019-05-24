import React from 'react';
import { Input } from 'antd';

const uuidv4 = require('uuid/v4');

const DisplayLocation = ({ location }) => {
  const keys = Object.keys(location);
  console.log(location);
  return (
    <div>
      {keys.map(key => (
        <Input
          style={{ width: '150px', margin: '2px' }}
          value={location[key]}
          disabled
          key={uuidv4()}
        />
      ))}
    </div>
  );
};

export default DisplayLocation;
