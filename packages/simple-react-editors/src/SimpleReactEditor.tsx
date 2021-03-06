/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { EnvelopeBusInnerMessageHandler } from "@kogito-tooling/microeditor-envelope";
import {
  Atlasmap,
  AtlasmapProvider,
} from '@atlasmap/atlasmap';

import "./SimpleReactEditor.css";

export interface Props {
  exposing: (s: SimpleReactEditor) => void;
  messageBus: EnvelopeBusInnerMessageHandler;
}

export interface State {
  content: string;
  originalContent: string;
}

export class SimpleReactEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.exposing(this);
    this.state = {
      originalContent: "",
      content: ""
    };
  }

  public componentDidMount(): void {
    this.props.messageBus.notify_ready();
  }

  public setContent(content: string) {
    return new Promise<void>(res => this.setState({ originalContent: content }, res)).then(() =>
      this.updateContent(content)
    );
  }

  private updateContent(content: string) {
    return new Promise<void>(res => {
      this.setState({ content: content }, () => {
        this.props.messageBus.notify_dirtyIndicatorChange(this.isDirty());
        res();
      });
    });
  }

  //saving triggers this method, so we also update the originalContent by calling `this.setContent`
  public getContent() {
    return this.setContent(this.state.content).then(() => this.state.content);
  }

  public isDirty() {
    return this.state.content !== this.state.originalContent;
  }

  public render() {
    return (
      // <textarea
      //   style={{ width: "100%", height: "100%", outline: 0, boxSizing: "border-box", border: 0 }}
      //   value={this.state.content}
      //   onInput={(e: any) => this.updateContent(e.target.value)}
      // />
      <AtlasmapAdapter />
    );
  }
}

const AtlasmapAdapter: React.FunctionComponent = React.memo(() => {
  return (
    <AtlasmapProvider
      baseJavaInspectionServiceUrl={'http://localhost:8585/v2/atlas/java/'}
      baseXMLInspectionServiceUrl={'http://localhost:8585/v2/atlas/xml/'}
      baseJSONInspectionServiceUrl={'http://localhost:8585/v2/atlas/json/'}
      baseCSVInspectionServiceUrl={'http://localhost:8585/v2/atlas/csv/'}
      baseMappingServiceUrl={'http://localhost:8585/v2/atlas/'}
        // externalDocument={externalDocument}
        // onMappingChange={onMappings}
      >
      <Atlasmap
        allowImport={false}
        allowExport={false}
        allowReset={false}
        allowDelete={false}
        allowCustomJavaClasses={false}
      />
    </AtlasmapProvider>
  )
});
