import "./tasks.scss";
import { autoinject } from 'aurelia-framework';

@autoinject
export class Tasks {
  public dropFunc(e) {
    console.log(e);
  }
  public testFunc(e) {
    console.log(e);
  }
}
