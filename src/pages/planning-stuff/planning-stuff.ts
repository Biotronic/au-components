import "./planning-stuff.scss";
import { Router } from 'aurelia-router';
import { autoinject, observable } from 'aurelia-framework';
import { IDriver, ITask, IVehicle } from "./model";

@autoinject
export class PlanningStuff {
  @observable
  private drivers: IDriver[] = [{
    name: 'Driver 1'
  }, {
    name: 'Driver 2'
  }, {
    name: 'Driver 3'
  }];
  @observable
  private vehicles: IVehicle[] = [{
    regno: 'ABC123'
  }, {
    regno: 'DEF456'
  }, {
    regno: 'GHI789'
  }, {
    regno: 'JKL012'
  }];
  @observable
  private tasks: ITask[] = [{
    title: 'Task 1'
  }, {
    title: 'Task 2'
  }, {
    title: 'Task 3'
  }];
  private parent: PlanningStuff = null;
  private children: PlanningStuff[] = [];
  private views = ['drivers', 'vehicles', 'tasks'];

  driversChanged() {
    if (this.parent) {
      this.parent.drivers = this.drivers;
    }
    if (this.children) {
      this.children.forEach(child => child.drivers = this.drivers);
    }
  }

  vehiclesChanged() {
    if (this.parent) {
      this.parent.vehicles = this.vehicles;
    }
    if (this.children) {
      this.children.forEach(child => child.vehicles = this.vehicles);
    }
  }

  tasksChanged() {
    if (this.parent) {
      this.parent.tasks = this.tasks;
    }
    if (this.children) {
      this.children.forEach(child => child.tasks = this.tasks);
    }
  }

  public getItem(type: string, index: number): any {
    switch (type) {
      case 'driver':
        return this.drivers[index];
      case 'vehicle':
        return this.vehicles[index];
      case 'task':
        return this.tasks[index];
    }
    return null;
  }

  constructor(private router: Router) {
    if (window.opener && window.opener['planningStuff']) {
      this.parent = window.opener['planningStuff'];
      delete window.opener['planningStuff'];
      this.parent.children.push(this);
    } else if (window.opener) {
      // Or do some postMessage magic to get a reference from the opener
      close();
    }

    window.addEventListener("beforeunload", () => {
      if (this.parent) {
        this.parent.views = [...this.parent.views, ...this.views];
      }
    });
  }

  activate(params) {
    console.log(params);
    if (params.view) {
      this.views = [params.view];
    }
  }

  public openInNewTab(view: string) {
    console.log('Opening new tab for view: ' + view);
    const url = this.router.generate('planning', { view: view });
    window['planningStuff'] = this;
    window.open(url, '_blank', 'popup');
    this.views = this.views.filter(v => v !== view);
  }

  startDrag(element) {
    console.log(element);
  }

  detached() {
    if (this.parent) {
      this.parent.views.push(...this.views);
    }
  }
}
