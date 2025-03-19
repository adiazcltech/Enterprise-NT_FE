import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent {

  @Output()
  viewvalidatedcapchat = new EventEmitter<boolean>();
  alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0');
  a = '';
  b = '';
  c = '';
  d = '';
  e = '';
  f = '';
  g = '';
  i: number = 0;
  code: string = '';
  captchadata: string = '';
  validatedcapchat = false;
  errorcaptchan = false;

  Captcha() {
    for (this.i = 0; this.i < 6; this.i++) {
      this.a = this.alpha[Math.floor(Math.random() * this.alpha.length)];
      this.b = this.alpha[Math.floor(Math.random() * this.alpha.length)];
      this.c = this.alpha[Math.floor(Math.random() * this.alpha.length)];
      this.d = this.alpha[Math.floor(Math.random() * this.alpha.length)];
      this.e = this.alpha[Math.floor(Math.random() * this.alpha.length)];
      this.f = this.alpha[Math.floor(Math.random() * this.alpha.length)];
      this.g = this.alpha[Math.floor(Math.random() * this.alpha.length)];
    }
    return this.code = this.a + ' ' + this.b + ' ' + ' ' + this.c + ' ' + this.d + ' ' + this.e + ' ' + this.f + ' ' + this.g;
  }

  removeSpaces(data: string) {
    return data.split(' ').join('');
  }

  changueValidate(event: Event) {
    this.errorcaptchan = false
    const elemnt = event.target as HTMLInputElement;
    this.captchadata = elemnt.value;
  }

  validCaptcha() {
    this.validatedcapchat = false;
    this.viewvalidatedcapchat.emit(false);
    var pass = this.removeSpaces(this.code);
    if (pass != this.captchadata) {
      this.Captcha();
      this.captchadata = '';
      this.errorcaptchan = true;
    } else {
      this.errorcaptchan = false;
      this.validatedcapchat = true;
      this.viewvalidatedcapchat.emit(true);
    }
  }
}
