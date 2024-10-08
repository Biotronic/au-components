export const MDC_TARGET_ATTR = 'mdc-target';
export const MDC_INIT_ATTR = 'data-mdc-auto-init';

let MDC_COMPONENTS: any = {
    'mdc-checkbox': 'MDCCheckbox',
    'mdc-dialog': 'MDCDialog',
    'mdc-persistent-drawer': 'MDCPersistentDrawer',
    'mdc-temporary-drawer': 'MDCTemporaryDrawer',
    //'mdc-ripple-surface': 'MDCRipple',
    'mdc-grid-list': 'MDCGridList',
    'mdc-icon-toggle': 'MDCIconToggle',
    'mdc-linear-progress': 'MDCLinearProgress',
    'mdc-radio': 'MDCRadio',
    'mdc-snackbar': 'MDCSnackbar',
    'mdc-tab-bar': 'MDCTabBar',
    'mdc-textfield': 'MDCTextfield',
    'mdc-simple-menu': 'MDCSimpleMenu',
    'mdc-select': 'MDCSelect',
    'mdc-toolbar': 'MDCToolbar'
};

export class MdcConfig {
    public addComponents(items: any) {
        if (typeof items !== 'object') {
            throw Error('Invalid argument, expected an Object');
        }

        MDC_COMPONENTS = Object.assign(MDC_COMPONENTS, items);
        return this;
    }

    public get mdcClasses() {
        return Object.keys(MDC_COMPONENTS);
    }

    public get mdcSelectors() {
        return this.mdcClasses.map(selector => `.${selector}`).join();
    }

    public getComponentName(item: any) { //this is ugly
        let component;

        this.mdcClasses.forEach(selector => {
            if (item.classList.contains(selector)) {
                component = MDC_COMPONENTS[selector];
            }
        });

        return component;
    }
}
