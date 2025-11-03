import './vd-calendar-day-vertical.scss'
import { autoinject, bindable } from 'aurelia-framework';
import { IDropEvent } from 'vd-drop-target/vd-drop-target';
import { TimeSpan } from 'utility/timespan';
import moment from 'moment';

export interface ITask {
  from: Date;
  to: Date;
  title: string;
  driver?: IDriver;
}

export interface IDriver {
  firstName: string;
  lastName: string;
  driverCardNumber: string;
  tasks: ITask[];
}

@autoinject
export class VdCalendarDayVertical {
  @bindable
  public items: any[];

  @bindable
  public drivers: IDriver[] = [{
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678900',
    tasks: [{
      from: new Date('2025-11-02 08:00'),
      to: new Date('2025-11-02 11:00'),
      title: 'Sit around'
    }, {
      from: new Date('2025-11-02 12:00'),
      to: new Date('2025-11-02 16:00'),
      title: 'Sit around some more'
    }]
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678901',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678902',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678903',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678904',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678905',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678906',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678907',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678908',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678909',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678910',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678911',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678912',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678913',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678914',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678915',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678916',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678917',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678918',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678919',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678920',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678921',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678922',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678923',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678924',
    tasks: []
  }, {
    firstName: 'Rudolf',
    lastName: 'Blodstrupmoen',
    driverCardNumber: 'NO12345678925',
    tasks: []
  }, {
    firstName: 'Ola',
    lastName: 'Sjåfør',
    driverCardNumber: 'NO12345678926',
    tasks: []
  }];

  public step = 3600; // seconds
  public scale = 1; // pixels per minute
  public height = 1440; // pixels
  public draggingTask: ITask = {
    from: new Date(0),
    to: new Date(0),
    title: 'Dragged'
  };

  public get times() {
    return Array.from(Array(86400 / this.step).keys()).map(t => TimeSpan.fromSeconds(t * this.step));
  }

  public dragTask(event: IDropEvent, driver: IDriver) {
    let data = event.data as {
      title: string;
      duration: TimeSpan
    };
    let from = TimeSpan.fromMinutes(event.y).addToDate(moment().startOf('day').toDate());
    let to = TimeSpan.from(data.duration).addToDate(from);
    this.draggingTask = {
      title: data.title,
      from: from,
      to: to,
      driver: driver
    };
  }

  public dragLeave(event: IDropEvent, driver: IDriver) {
    console.log(event.event.target);
    if (driver != this.draggingTask.driver) {
      return;
    }
    this.draggingTask.driver = {
      firstName: '',
      lastName: '',
      driverCardNumber: '',
      tasks: []
    };
  }

  public drop(event: IDropEvent, driver: IDriver) {
    this.dragLeave(event, driver);

    driver.tasks.push(structuredClone(this.draggingTask));
  }
}
