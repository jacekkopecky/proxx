/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, h } from "preact";
import { bind } from "../../../../../utils/bind";
import { minSec } from "../../../../utils/format";
import { isFeaturePhone } from "../../../../utils/static-display";
import { getPresetName } from "../../../state/grid-presets";
import { Timer } from "../icons/additional";
import {
  againButton,
  againShortcutKey,
  gridName as gridNameStyle,
  mainButton,
  noMotion,
  score,
  scoreRow,
  shortcutKey,
  time as timeStyle,
  timeLabel,
  timerIcon,
  winInner,
  winScreen,
  winSquare,
  winState
} from "./style.css";

interface Props {
  onRestart: () => void;
  onMainMenu: () => void;
  time: number;
  bestTime: number;
  width: number;
  height: number;
  mines: number;
  useMotion: boolean;
}

interface State {
  gridName: string;
}

export default class End extends Component<Props, State> {
  private _playAgainBtn?: HTMLButtonElement;
  constructor(props: Props) {
    super(props);

    const { width, height, mines } = props;
    const presetName: string = getPresetName(width, height, mines);

    this.state = {
      gridName:
        presetName +
        " mode" +
        (presetName === "custom" ? ` - ${width}x${height}:${mines}` : "")
    };
  }

  componentDidMount() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    this._playAgainBtn!.focus();
    window.addEventListener("keyup", this.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.onKeyUp);
  }

  render(
    { onRestart, onMainMenu, time, bestTime, useMotion }: Props,
    { gridName }: State
  ) {
    const timeStr = minSec(time);
    const bestTimeStr = minSec(bestTime);

    return (
      <div class={winScreen}>
        <div class={winInner}>
          <div class={[winSquare, useMotion ? "" : noMotion].join(" ")}>
            <div>
              <div>
                <div>
                  <div>
                    <div />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2 class={winState}>
            {time < bestTime ? "New high score!" : "You win!"}{" "}
            <span class={gridNameStyle}>({gridName})</span>
          </h2>
          <div class={scoreRow}>
            <div class={score}>
              <div class={timeLabel}>Score</div>
              <div class={timeStyle}>{timeStr}</div>
            </div>
            <Timer class={timerIcon} />
            <div class={score}>
              <div class={timeLabel}>
                {time < bestTime ? "Previous" : "Best"}
              </div>
              <div class={timeStyle}>{bestTimeStr}</div>
            </div>
          </div>
          <button
            class={againButton}
            onClick={onRestart}
            ref={el => (this._playAgainBtn = el)}
          >
            {isFeaturePhone && (
              <span class={[shortcutKey, againShortcutKey].join(" ")}>#</span>
            )}{" "}
            Play again
          </button>
          <button class={mainButton} onClick={onMainMenu}>
            {isFeaturePhone ? <span class={shortcutKey}>*</span> : ""} Main menu
          </button>
        </div>
      </div>
    );
  }

  @bind
  private onKeyUp(event: KeyboardEvent) {
    if (event.key === "#") {
      this.props.onRestart();
    } else if (event.key === "*") {
      this.props.onMainMenu();
    }
  }
}
