import React from "react";
import styled from "styled-components";

const StepsDiagram = () => {
  return (
    <Div>
      <div className="main-container">
        <div className="body-container">
          <div className="body">
            <div className="logo-container beforeMobile">
              <p className="logo before"> Step1 </p>
            </div>
            <div>
              <strong> 公式LINEで「就活終わり」と送信 </strong>
              <p>※深夜・土日の場合、返事に時間がかかる場合がございます。</p>
            </div>
          </div>
          <div className="body">
            <div className="logo-container ">
              <p className="logo"> Step2 </p>
            </div>
            <div>
              <strong> 就活に関するアンケートに回答 </strong>
              <p>
              送られてくる手順に沿ってアンケートに回答してください！(３分程度で終了します）
              </p>
            </div>
          </div>
        </div>
      </div>
    </Div>
  );
};

export default StepsDiagram;

const Div = styled.div`
  strong {
    font-weight: bold;
  }
  p,
  strong {
    margin: 0 15px 0 0;
  }
  .logo {
    font-weight: bold;
    margin: 10px;
    display: flex;
    background: #9ac5e9;
    width: 40px;
    height: 40px;
    padding: 0.8em;
    text-align: center;
    justify-items: center;
    align-items: center;
    border-radius: 50%;
  }

  .logo-container {
    -ms-flex-pack: center;
    align-items: center;
    width: max-content;

    justify-self: center;
    padding: 0 auto;
    margin: 0 auto;
  }
  .before {
    position: relative;
  }
  .before::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 4.22em;
    width: 39.6vw;
    height: 0.2em;
    background: #9ac5e9;
    z-index: 0;
    max-width: 360px;
  }

  .body {
    margin: 10px;
    max-width: 392px;
  }
  .body-container {
    padding: 10px;
    display: flex;
  }
  @media (min-width: 800px) {
    .body-container {
      justify-content: center;
    }
  }

  @media (max-width: 800px) {
    .body-container {
      flex-direction: column;
      align-items: center;
    }
    .body {
      width: 100vw;
      display: flex;
    }
    .logo-container {
      position: relative;
    }
    .before::before {
      display: none;
    }
    .beforeMobile::before {
      content: "";
      position: absolute;
      top: 65px;
      left: 2.85em;
      width: 0.2em;
      height: 80%;
      background: #9ac5e9;
      z-index: 0;
    }
  }
`;
