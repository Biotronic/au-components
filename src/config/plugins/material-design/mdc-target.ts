import { inject, customAttribute, DOM } from 'aurelia-framework';
import { MdcConfig, MDC_TARGET_ATTR } from './config';
import { resolveAttachedPromise } from './helpers';

@inject(DOM.Element, MdcConfig)
@customAttribute(MDC_TARGET_ATTR)
export class MdcTarget {
    public element: any;
    public config: any;
    constructor(element: any, config: any) {
        this.element = element;
        this.config = config;
    }

    public attached() {
        const hasMdcElements = this.config.mdcClasses.some((cls: any) => {
            return this.element.classList.contains(cls);
        });

        if (!hasMdcElements) {
            return;
        }

        (<any>window).mdc.autoInit(this.element.parentNode, () => { });
        resolveAttachedPromise();
    }
}
