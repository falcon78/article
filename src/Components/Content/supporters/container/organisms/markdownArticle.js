import React from 'react';
import styled from 'styled-components';
import Subhead from '../../components/atoms/subhead3';
import MarkdownConverterToHtml from '../../components/molecules/MarkdownConverterToHtml';
import ImageCaption from '../../components/molecules/imageCaption';
import ArticleTitle from '../../components/atoms/SP_ArticleTitle';
import ColorText from '../../components/atoms/colorText';
// import StepsDiagram from "./../../components/molecules/SP_StepsDiagram";
const uuidv4 = require('uuid/v4');

const picRegex = /\[(.*)]\((.*)\)/;

const MarkdownArticle = props => {
  const renderView = props.body.map(section => {
    let articleElement = '';
    if (section.text) {
      articleElement = articleElement.concat(
        <div className="text" key={uuidv4()}>
          <MarkdownConverterToHtml markdown={section.text} />
        </div>
      );
    }
    if (section.passage) {
      articleElement = articleElement.concat(
        <Flex key={uuidv4()}>
          <TempPassage className="passage">{section.passage}</TempPassage>
        </Flex>
      );
    }
    if (section.subhead) {
      articleElement = articleElement.concat(
        <Subhead key={uuidv4()} className="subhead" subhead={section.subhead} />
      );
    }
    if (section.title) {
      articleElement = articleElement.concat(
        <ArticleTitle title={section.title} key={uuidv4()} />
      );
    }
    if (section.image && section.image.match(picRegex)) {
      const image = section.image.match(picRegex);
      console.log(image);
      articleElement = articleElement.concat(
        <MarginBottom>
          <ImageCaption image={image[2]} caption={image[1]} key={uuidv4()} />
        </MarginBottom>
      );
    }
    if (section.firstPic && section.firstPic.match(picRegex)) {
      const image = section.firstPic.match(picRegex);
      console.log(image);
      articleElement = articleElement.concat(
        <MarginBottom>
          <ImageCaption image={image[2]} caption={image[1]} key={uuidv4()} />
        </MarginBottom>
      );
    }
    if (section.colortext) {
      const text = section.colortext.split('\\');
      const renderText =
        text.length > 1 ? (
          <ColorText
            text={<MarkdownConverterToHtml markdown={text[0]} />}
            color={text[1].replace(/\s/gi, '')}
          />
        ) : (
          <ColorText text={text[0]} color="red" />
        );
      return renderText;
    }
    return articleElement;
  });
  return renderView || <p />;
};

/* <div>
        props.body.map(v => (
          <div key={uuidv4()}>{ {section.step && <StepsDiagram />}}</div>
        ))}
</div> */
export default MarkdownArticle;

const MarginBottom = styled.div`
  margin-bottom: 20px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
`;

const TempPassage = styled.div`
  font-weight: bold;
  position: relative;
  color: black;
  text-shadow: 0 0 2px white;
  z-index: 1;
  width: max-content;
  &::before {
    content: '';
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
