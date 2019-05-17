import React from "react";
import SOSupportersTemplate from "../templates/SP_Supporters";
import ContentsFrame from "./../templates/SP_contents-frame";
import LineActionButton from "../../components/molecules/SP_LineActionButton";
import styled from "styled-components";

function SP_SupportersMain(props) {
  return (
    <ContentsFrame>
      <Style>
        <SOSupportersTemplate aboutSP={props.aboutSP} />
        <LineActionButton />
      </Style>
    </ContentsFrame>
  );
}

export default SP_SupportersMain;

const Style = styled.div`
  margin: 0 15px;
  font-size: 14px;
  line-height: 1.5em;
  .header {
    font-size: 20px;
    margin: 30px 0 20px 0;
  }
  .title {
    font-size: 20px;
    margin: 30px 0 20px 0;
    text-align: center;
  }
  .passage {
    font-size: 16px;
    margin: 8px 0;
  }
  .subhead {
    margin: 10px 0;
    font-size: 18px;
  }
  .text {
    margin: 8px 0;
  }
  .image {
    margin: 20px auto;
  }
  .color {
    margin: 8px 0;
    text-align: center;
  }
`;

