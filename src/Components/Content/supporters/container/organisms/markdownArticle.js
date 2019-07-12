import React from 'react';
import styled from 'styled-components';
import Subhead from '../../components/atoms/subhead3';
import MarkdownHTMLParser from '../../components/molecules/MarkdownHTMLParser';
import ImageCaption from '../../components/molecules/imageCaption';
import ArticleTitle from '../../components/atoms/SP_ArticleTitle';
import ColorText from '../../components/atoms/colorText';
// import StepsDiagram from "./../../components/molecules/SP_StepsDiagram";
import Header from '../../components/atoms/SP_BlockTextWithLineAtom';
import CustomMarkdownColor from '../../components/atoms/CustomMarkdownColor';

const MarkdownArticle = props => {
  const renderView = props.section.map(section => {
    let articleElement = [];

    if (section.text) {
      articleElement = articleElement.concat(
        <div className="text" key={section.idKey}>
          <MarkdownHTMLParser markdown={section.text} />
        </div>
      );
    }
    if (section.header) {
      articleElement = articleElement.concat(
        <Header color="#009688" text={section.header} />
      );
    }
    if (section.passage) {
      articleElement = articleElement.concat(
        <Flex key={section.idKey}>
          <TempPassage className="passage">{section.passage}</TempPassage>
        </Flex>
      );
    }
    if (section.subhead) {
      articleElement = articleElement.concat(
        <Subhead
          key={section.idKey}
          className="subhead"
          subhead={section.subhead}
        />
      );
    }
    if (section.title) {
      articleElement = articleElement.concat(
        <ArticleTitle title={section.title} key={section.idKey} />
      );
    }
    if (section.image) {
      articleElement = articleElement.concat(
        <MarginBottom>
          <ImageCaption
            image={section.image}
            caption={section.caption}
            key={section.idKey}
          />
        </MarginBottom>
      );
    }

    if (section.colortext) {
      articleElement = articleElement.concat(
        <ColorText
          text={<MarkdownHTMLParser markdown={section.colortext} />}
          color={section.color}
        />
      );
    }
    if (section.customMarkdown) {
      let outputText = section.customMarkdown;
      outputText = outputText.replace(
        /\$\$(.*?)\$\$/gim,
        `<span className="customMarkdownColor">$1</span>`
      );
      articleElement = articleElement.concat(
        <CustomMarkdownColor
          color={section.color}
          text={<MarkdownHTMLParser markdown={outputText} />}
        />
      );
    }
    return articleElement;
  });
  return (
    <Style>
      <div>
        <ArticleTitle title={props.title} />
        <MarginBottom>
          <ImageCaption image={props.image} caption="" />
        </MarginBottom>

        <MarkdownHTMLParser markdown={props.lead} />
      </div>
      {renderView.map(element => (
        <div key={element.idKey} className="margin">
          {element}
        </div>
      ))}
    </Style>
  );
};

export default MarkdownArticle;

const Style = styled.div`
  .margin {
    margin: 1em;
  }
  padding: 10px;
  border-color: whitesmoke;
  border-style: solid;
`;

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
  width: max-content;
  &::before {
    content: '';
    position: absolute;
    background: rgba(0, 176, 162, 0.6);
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
