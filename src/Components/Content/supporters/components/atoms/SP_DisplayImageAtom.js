import React from "react";
import styled from "styled-components";

const DisplayImageAtom = props => {
  return (
    <ImageLayout>
      <Image src={props.link} />
    </ImageLayout > 
  );
};

export default DisplayImageAtom; 
const ImageLayout = styled.div`
  margin-top: 20px;
`;

const Image = styled.img`
  padding: 10px 0;
  box-sizing: border-box;
  max-width: 550px;
  width: 100%;
  display: block;
  margin: auto;
`;
