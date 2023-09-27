import 'zone.js/dist/zone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { EncodeHintType } from '@zxing/library';
import { BrowserQRCodeSvgWriter } from '@zxing/browser';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.io/start">
      Learn more about Angular
    </a>
    <p>qrcode works!</p>
    <canvas id="result"></canvas>
  `,
})
export class App implements OnInit {
  name = 'Angular';
  ngOnInit(): void {
    this.write('result', 'http://localhost:4200/hps-sample/app/sample', 300);
  }

  write(canvasId: string, qrText: string, qrWidth: number): void {
    const cvs = document.getElementById(canvasId) as HTMLCanvasElement;

    // check args

    if (cvs == null || !(cvs instanceof HTMLCanvasElement)) {
      throw new Error('Canvas not found.');
    }

    if (qrText == null || qrText.length === 0) {
      throw new Error(`Text is Invalid: ${qrText}`);
    }

    // generate code

    const qr = new BrowserQRCodeSvgWriter();

    const hints = new Map<EncodeHintType, string>();

    hints.set(EncodeHintType.MARGIN, '0');

    const svg = qr.write(qrText, qrWidth, qrWidth, hints);

    const svgWidth = svg.width.baseVal.value;

    const svgHeight = svg.height.baseVal.value;

    // SVG to IMG

    const data = new XMLSerializer().serializeToString(svg);

    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image(svgWidth, svgHeight);

      img.onload = () => {
        // IMG to CANVAS

        cvs.width = svgWidth;

        cvs.height = svgHeight;

        cvs?.getContext('2d')?.drawImage(img, 0, 0);
      };

      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };

    reader.readAsDataURL(
      new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    );
  }
}

bootstrapApplication(App);
