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

import { tiltimage } from "./style.css";

interface AccelerationData {
  x: number;
  y: number;
  z: number;
}
export default class TiltImage {
  smoothing = 10;
  private _el = document.createElement("div");
  private _accumulated: AccelerationData = { x: 0, y: 0, z: 0 };

  constructor(private path: string) {
    this._el.classList.add(tiltimage);
    this._el.style.backgroundImage = `url(${path})`;
    document.body.appendChild(this._el);

    this.ontilt = this.ontilt.bind(this);
    window.addEventListener("devicemotion", this.ontilt);
    this.onrender = this.onrender.bind(this);
    this.onrender();
  }

  private ontilt({ acceleration }: DeviceMotionEvent) {
    this._accumulated.x += acceleration!.x || 0;
    this._accumulated.y += acceleration!.y || 0;
  }

  private onrender() {
    const { x, y, z } = this._accumulated;
    this._el.style.transform = `translate(${x}px, ${-y}px)`;
    this._accumulated.x += -this._accumulated.x / this.smoothing;
    this._accumulated.y += -this._accumulated.y / this.smoothing;
    requestAnimationFrame(this.onrender);
  }
}