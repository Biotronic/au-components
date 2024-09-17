import { Aurelia } from 'aurelia-framework';
import environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');
  aurelia.use.plugin(PLATFORM.moduleName('config/plugins/material-design'));

  aurelia.use
    .globalResources(PLATFORM.moduleName('vd-input-time-v2/vd-input-time-v2'))
    .globalResources(PLATFORM.moduleName('vd-input-date-v2/vd-input-date-v2'))
    .globalResources(PLATFORM.moduleName('vd-input-calendar-v2/vd-input-calendar-v2'))
    .globalResources(PLATFORM.moduleName('vd-input-date-range-v2/vd-input-date-range-v2'))
    .globalResources(PLATFORM.moduleName('bc-checkbox/bc-checkbox'))
    .globalResources(PLATFORM.moduleName('bc-dropdown/bc-dropdown'))
    .globalResources(PLATFORM.moduleName('bc-expandable/bc-expandable'))
    .globalResources(PLATFORM.moduleName('bc-icon/bc-icon'))
    .globalResources(PLATFORM.moduleName('bc-page-list/bc-page-list'))
    .globalResources(PLATFORM.moduleName('bc-paging/bc-paging'))
    .globalResources(PLATFORM.moduleName('bc-table/bc-table'))
    .globalResources(PLATFORM.moduleName('bc-table/bc-table-cell'))
    .globalResources(PLATFORM.moduleName('bc-table/bc-table-header-sortable'));

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
