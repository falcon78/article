import React from "react";
import DisplayImageAtom from "../../components/atoms/SP_DisplayImageAtom";
import HeadingBorder from "../../components/atoms/SP_BlockTextWithLineAtom";
import ColoredBoldMarkdown from "../../components/molecules/SP_ColoredBoldMarkdown";
import styled from "styled-components";
import Subhead from "./../../../components/atoms/subhead3";
import MarkdownConverterToHtml from "./../../../components/molecules/MarkdownConverterToHtml";
import ImageCaption from "./../../../components/molecules/imageCaption";
import ArticleTitle from "./../../components/atoms/SP_ArticleTitle";
import StepsDiagram from "./../../components/molecules/SP_StepsDiagram";

const SOSupportersTemplate = props => {
  return (
      <div>
        {props.aboutSP.map((v, index) => (
          <div key={index}>
            {v.firstPic && <DisplayImageAtom link={v.firstPic} />}
            {v.header && <HeadingBorder text={v.header} />}

            {v.title && <ArticleTitle title={v.title} />}

            {v.subhead && <Subhead className="subhead" subhead={v.subhead} />}
            {v.step && <StepsDiagram />}
            {v.passage && (
              <Flex>
                <TempPassage className="passage">{v.passage}</TempPassage>
              </Flex>
            )}

            {v.image && (
              <MarginBottom>
                <ImageCaption image={v.image} caption={v.caption} />
              </MarginBottom>
            )}

            {v.text && (
              <div className="text">
                <MarkdownConverterToHtml markdown={v.text} />
              </div>
            )}

            {v.colortext && (
              <ColoredBoldMarkdown colortext={v.colortext} color={v.color} />
            )}
          </div>
        ))}
      </div>
  );
};

export default SOSupportersTemplate;

const MarginBottom = styled.div`
  margin-bottom: 20px;
`;

const Flex = styled.div`
  display: flex;
`;

const TempPassage = styled.div`
  font-weight: bold;
  position: relative;
  color: black;
  text-shadow: 0 0 2px white;
  z-index: 1;
  width: max-content;
  &::before {
    content: "";
    position: absolute;
    background: #9ac5e9;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    top: 45%;
    left: -10px;
    -moz-transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    z-index: -1;
  }
`;
