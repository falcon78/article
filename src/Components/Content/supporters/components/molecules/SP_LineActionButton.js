import React from "react";

import styled from "styled-components";

import LINEButton from "./../../../components/molecules/LINEButton";

const LineActionButton = () => {
  return (
    <div>
      <ImageArea>
        <LINEButton text={"公式LINEはこちら"} />
      </ImageArea>
    </div>
  );
};

export default LineActionButton;

const ImageArea = styled.div`
  max-width: 280px;
  margin: 10px auto;
`;
