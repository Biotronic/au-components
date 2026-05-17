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
    .globalResources(PLATFORM.moduleName('vd-drop-target/vd-drop-target'))
    .globalResources(PLATFORM.moduleName('vd-draggable/vd-draggable'))
    .globalResources(PLATFORM.moduleName('vd-calendar-day-vertical/vd-calendar-day-vertical'))
    
    .globalResources(PLATFORM.moduleName('vd-single-carousel-v2/vd-single-carousel-v2'))
    .globalResources(PLATFORM.moduleName('vd-number-element-v2/vd-number-element-v2'))
    .globalResources(PLATFORM.moduleName('vd-accordion-v2/vd-accordion-v2'))
    .globalResources(PLATFORM.moduleName('vd-popup-v2/vd-popup-v2'))
    .globalResources(PLATFORM.moduleName('vd-input-time-v2/vd-input-time-v2'))
    .globalResources(PLATFORM.moduleName('vd-input-date-v2/vd-input-date-v2'))
    .globalResources(PLATFORM.moduleName('vd-input-calendar-v2/vd-input-calendar-v2'))
    .globalResources(PLATFORM.moduleName('vd-input-date-range-v2/vd-input-date-range-v2'))
    .globalResources(PLATFORM.moduleName('vd-checkbox/vd-checkbox'))
    .globalResources(PLATFORM.moduleName('vd-dropdown/vd-dropdown'))
    .globalResources(PLATFORM.moduleName('vd-expandable/vd-expandable'))
    .globalResources(PLATFORM.moduleName('vd-icon/vd-icon'))
    .globalResources(PLATFORM.moduleName('vd-page-list/vd-page-list'))
    .globalResources(PLATFORM.moduleName('vd-paging/vd-paging'))
    .globalResources(PLATFORM.moduleName('vd-table/vd-table'))
    .globalResources(PLATFORM.moduleName('vd-table/vd-table-cell'))
    .globalResources(PLATFORM.moduleName('vd-table/vd-table-header-sortable'))
    .globalResources(PLATFORM.moduleName('vd-input-formatted-text/vd-input-formatted-text'));

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
