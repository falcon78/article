import React from 'react';
import ReactLoading from 'react-loading';

const Loading = ({ inline }) => {
  return (
    <div
      style={
        inline
          ? {
              display: 'inline',
            }
          : {
              display: 'flex',
              justifyContent: 'center'
            }
      }
    >
      {inline ? (
        <ReactLoading type="bars" color="#1890ff" height="30px" width="40px" />
      ) : (
        <ReactLoading type="bars" color="#1890ff" />
      )}
    </div>
  );
};

export default Loading;
