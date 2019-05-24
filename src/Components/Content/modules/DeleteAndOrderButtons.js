import React from 'react';
import { Button } from 'antd';

const DeleteAndOrderButtons = ({ handleOrder, handleRemove, index }) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '120px',
        justifyContent: 'space-around'
      }}
    >
      <Button
        type="primary"
        shape="circle"
        icon="arrow-up"
        onClick={() => handleOrder('up', index)}
      />
      <Button
        type="primary"
        shape="circle"
        icon="arrow-down"
        onClick={() => handleOrder('down', index)}
      />
      <Button
        type="danger"
        shape="circle"
        icon="delete"
        onClick={() => {
          handleRemove(index);
        }}
      />
    </div>
  );
};

export default DeleteAndOrderButtons;
