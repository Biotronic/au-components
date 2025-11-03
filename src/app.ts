import { autoinject } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { TimeSpan } from "utility/timespan";
import { RouterConfiguration, Router } from 'aurelia-router';

@autoinject
export class App {
  public time: TimeSpan = TimeSpan.fromString('00:00');
  public date: Date;
  public dates: Date[] = [];

  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = 'Title';
    config.map([
      { route: [''], name: 'tasks',  moduleId: PLATFORM.moduleName('pages/home/home') },
      { route: ['tasks'], name: 'tasks',  moduleId: PLATFORM.moduleName('pages/tasks/tasks') },
      { route: ['planning/view/:view'], name: 'planning',  moduleId: PLATFORM.moduleName('pages/planning-stuff/planning-stuff') }
    ]);
  }
}
