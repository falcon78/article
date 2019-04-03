import React from "react";
import { Input } from "antd/lib/index";
import styled from "styled-components";

const { TextArea } = Input;

class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      local_title: "",
      local_body: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    return (
      <Style>
        <Input
          className={"margin"}
          name="local_title"
          value={this.state.local_title}
          onChange={this.handleChange}
        />
        <TextArea
          className={"margin"}
          name="local_body"
          value={this.state.local_body}
          onChange={this.handleChange}
        />
      </Style>
    );
  }
}

export default InputField;

const Style = styled.div`
  .margin {
    margin: 0.5em;
  }
`;
