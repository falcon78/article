import React from "react";
import styled from "styled-components";

import registration from "../../../../assets/registration.svg";
import WhiteBox from "../../../components/atoms/white-box";
import Line from "../../../../assets/line_btn.gif";

import entryPic from "../../../../assets/entry_title_new1.png";
import SP_floatingActionButton from "../../components/molecules/SP_floating-action-button";
import SOSupportersTemplate from "./SP_Supporters";
import HeaderBorder from "../../components/atoms/SP_BlockTextWithLineAtom.js";

const data = [
  {
    title: "今すぐ変わらず、気になることはすぐに相談できる。"
  },

  {
    title: "個別面談の予約が取りやすい"
  },

  {
    title: "国試に関すること、息抜きになるコラムの更新がすぐわかる！"
  },

  {
    colortext:
      "**これはすべて** \n\n **~~サポーターズ専用の公式LINE~~で行っています。こちらもぜひ友達登録してください。**",
    color: "red"
  }

];
class EntryButton extends React.Component {
  constructor(props) {
    super(props);
    this.EntryButtonData = {
      text: "新規登録",
      image: registration,
      color: "#673AB7"
    };

    this.state = {
      entryHidden: true,
      list1: {
        title: "LINE登録することで・・・",
        contents: [
          "・困ったときに気軽に連絡できる",
          "・イベント告知や役立ち情報を見逃さない"
        ]
      },
      list2: {
        title: "マイページを発行（会員登録）することで・・・",
        contents: [
          "・様々なイベント、講座に参加できる",
          "・個別相談、ES添削などなど予約可能",
          "・会員限定の特別な記事が読める"
        ]
      }
    };
  }

  render() {
    return (
      <div>
        {this.state.entryHidden ? (
          <FloatButton
            onClick={() => {
              this.setState({ entryHidden: false });
            }}
          >
            <SP_floatingActionButton
              text={"サポーターズ公式LINEはこちら"}
              image={null}
              color="#2E78A1"
            />
          </FloatButton>
        ) : (
          <Registration>
            <HeaderLayout>
              <LogoImage src={entryPic} />
              <CloseButton
                onClick={() => {
                  this.setState({ entryHidden: true });
                }}
              >
                ×
              </CloseButton>
            </HeaderLayout>
            <HeaderBorder
              text={"サポーターズラインのメリット"}
              color={"white"}
            />
            {
              //header: "サポーターズラインのメリット"
              <Style>
                <Contents>
                  <SOSupportersTemplate aboutSP={data} />

                  <a
                    href="https://line.me/R/ti/p/%40vkl6476m"
                    target="_new"
                    rel="noopener noreferrer"
                  >
                    <Image src={Line} />
                  </a>
                  <SOSupportersTemplate aboutSP={[{
                    color: "red",
                    colortext: "**~~※友達登録したら、名前を送信してください！~~**"
                  }]} />
                </Contents>

              </Style>
            }
            <WhiteBox text={this.state.text} />
          </Registration>
        )}
      </div>
    );
  }
}
export default EntryButton;

const HeaderLayout = styled.div`
  border-bottom: 2px solid #16948f;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  margin-bottom: 20px;
`;
const LogoImage = styled.img`
  width: 120px;
`;

const FloatButton = styled.button`
  right: 40px;
  position: relative;
`;

const Registration = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  overflow: scroll;
  z-index: 5;
  background: rgba(255, 255, 255, 0.9);
  position: fixed;
`;

const Contents = styled.div`
  max-width: 390px;
  text-align: left;
`;

const Image = styled.img`
  @media screen and (max-width: 479px) {
    width: 320px;
    margin-top: 34px;
    display: block;
  }
  @media screen and (min-width: 480px) {
    display: block;
    width: 340px;
    margin: 20px auto;
  }
  text-align: center;
  margin: auto;
`;

const CloseButton = styled.button`
  background-color: #169490;
  font-size: 32px;
  color: white;
  border: none;
  border-radius: 8px;
  position: absolute;
  right: 3%;
  padding: 0 10px;
  font-family: Arial, serif;
  text-align: center;
  @media screen and (max-width: 479px) {
    top: 1%;
  }
`;

const Style = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  line-height: 1.5em;
  .header {
    font-size: 20px;
    margin: 30px 0 20px 0;
    background: white;
  }
  .title {
    line-height: 2em;
    font-size: 16px;
    margin: 10px 50px 10px 50px;
    position: relative;
    color:black;
    &::before {
      content: "";
      position: absolute;
      top: 5px;
      left: -35px;
      width: 1.5em;
      height: 1.5em;
      background: #9ac5e9;
      z-index: 0;

      border-radius: 50%;
    }
  }
  .passage {
    font-size: 16px;
    margin: 8px 20px;
  }
  .subhead {
    margin: 10px 0;
    font-size: 18px;
  }
  .text {
    margin: 8px 20px;
  }
  .image {
    margin: 20px auto;
  }
  .color {
    margin: 14px 20px;
    text-align: center;
  }
`;
