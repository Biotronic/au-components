import { bindable, autoinject, bindingMode, BindingEngine } from 'aurelia-framework';
import "./bc-dropdown.scss"

@autoinject
export class BcDropdown {
  @bindable
  public options: any[];

  @bindable
  public value: any;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public selected: any[] = [];

  @bindable
  public multiSelect: boolean;

  @bindable
  public searchable: boolean;

  @bindable
  public tabindex: number;

  @bindable()
  public direction: 'up' | 'down' | 'center' | 'auto' = 'auto';

  public class: string = 'opens-down';

  public icon: string = 'expand_more';

  public searchText: string;
  public element: HTMLElement;
  public dropdown: HTMLElement;
  public dropdownHidden: HTMLElement;
  public container: HTMLElement;
  public container2: HTMLElement;
  public button: HTMLElement;

  private selectedIndexes = [];
  private timer: NodeJS.Timeout;
  private cooldown: boolean;
  private selectedSubscription;

  public optionsChanged(newValue: any[]) {
    this.value = newValue[0];
    this.selected = [];
    this.updateSelected();
  }

  constructor(private bindingEngine: BindingEngine) {
  }

  attached() {
    this.container.style.maxHeight = `0px`;
    this.element.addEventListener('focusout', this.focusout.bind(this));
    this.element.addEventListener('focusin', this.focusin.bind(this));
    this.button.addEventListener('keydown', this.keydown.bind(this));
    this.element.addEventListener('keydown', this.keyboardNav.bind(this));
  }

  public directionChanged() {
    if (this.direction == 'up') {
      this.class = 'opens-up';
    } else if (this.direction == 'down') {
      this.class = 'opens-down';
    } else if (this.element) {
      var overflowParent: any = this.element.parentElement;
      while (overflowParent && overflowParent.computedStyleMap().get('overflow-y').value != 'hidden') {
        overflowParent = overflowParent.parentElement;
      }
      if (overflowParent == null) {
        this.class = 'opens-down';
      } else {
        let dropdownHeight = this.dropdownHidden.scrollHeight;
        let spaceAbove = this.element.offsetTop;
        let inputHeight = this.element.offsetHeight;

        let containerHeight = overflowParent.scrollHeight;
        let spaceBelow = containerHeight - spaceAbove - inputHeight;

        console.log('dropdownHeight: ', dropdownHeight, 'containerHeight', containerHeight, 'inputHeight', inputHeight, 'spaceAbove', spaceAbove, 'spaceBelow', spaceBelow);

        this.dropdown.style.removeProperty('top');
        if (dropdownHeight < spaceBelow) {
          this.class = 'opens-down';
        } else if (dropdownHeight < spaceAbove) {
          this.class = 'opens-up';
        } else if (dropdownHeight <= containerHeight) {
          this.class = 'opens-centered';
          this.dropdown.style.top = Math.max(0, spaceAbove + inputHeight - dropdownHeight - 7) + 'px';
        } else {
          this.class = 'opens-centered scrollable';
        }
      }
    }
    if (this.dropdown && this.element) {
      if (this.class.indexOf('opens-centered') > -1) {
        this.dropdown.style.left = this.element.offsetLeft + 'px';
        this.dropdown.style.minWidth = this.element.offsetWidth + 'px';
      } else {
        this.dropdown.style.removeProperty('left');
        this.dropdown.style.removeProperty('min-width');
      }
    }
  }

  private keyboardNav(e: KeyboardEvent) {
    let target = <HTMLElement>((<HTMLElement>e.target).closest('button[role~="option"]') || e.target);
    if (e.key == 'ArrowDown') {
      let next = <HTMLElement>target.nextSibling;
      if (next && next.focus) {
        next.focus();
      }
    }
    if (e.key == 'ArrowUp') {
      let prev = <HTMLElement>target.previousSibling;
      if (prev && prev.focus) {
        prev.focus();
      }
    }
    if (e.key == 'Escape') {
      this.collapse();
    }
  }

  private updateSelected() {
    this.selected = this.selected || [];
    this.selected = this.selected.sort((a, b) => this.options.indexOf(a) - this.options.indexOf(b));
  }

  private selectedChanged() {
    if (!this.selected) {
      return;
    }
    if (this.selectedSubscription) {
      this.selectedSubscription.dispose();
    }
    this.selectedSubscription = this.bindingEngine.collectionObserver(this.selected)
      .subscribe(this.selectedItemsChanged.bind(this));
    this.selectedItemsChanged([1]);
  }

  private selectedItemsChanged(splices) {
    if (!splices || !splices.length) {
      return;
    }
    this.selectedIndexes = this.options.map(a => this.selected.indexOf(a) != -1);
  }

  public get collapsed(): boolean {
    return this.element.matches('.collapsed');
  }

  public clicked() {
    if (this.cooldown) {
      return;
    }
    if (this.collapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  private collapse() {
    if (this.collapsed) {
      return;
    }
    this.icon = 'expand_more';
    clearTimeout(this.timer);
    this.element.classList.toggle('collapsed', true);
    this.container.style.maxHeight = `0px`;
    this.dropdown.style.opacity = '0%';
    this.dropdown.style.zIndex = '1';
    this.timer = setTimeout(() => {
      this.dropdown.style.zIndex = 'auto';
      this.cooldown = false;
    }, 500);
  }

  private expand() {
    if (!this.collapsed) {
      return;
    }
    this.directionChanged();
    this.icon = 'expand_less';
    this.searchText = '';
    this.element.classList.toggle('collapsed', false);
    this.container.style.maxHeight = `${this.container2.offsetHeight}px`;
    this.dropdown.style.opacity = '100%';
    this.dropdown.style.zIndex = '2';

    clearTimeout(this.timer);
    this.cooldown = true;
    this.timer = setTimeout(() => {
      this.cooldown = false;
    }, 500);
  }

  public select(option: any) {
    this.selected = this.selected || [];
    if (this.multiSelect) {
      let existing = this.selected.indexOf(option);
      if (existing == -1) {
        this.selected.push(option);
        this.value = option;
      } else {
        this.selected.splice(existing, 1);
      }
    } else {
      this.collapse();
      this.value = option;
      this.selected = [option];
    }
    this.updateSelected();
  }

  public focusout(e: FocusEvent) {
    if (this.element.contains(<Node>e.relatedTarget)) {
      return;
    }
    this.collapse();
  }

  public focusin(e) {
    this.expand();
  }

  public keydown(e: KeyboardEvent) {
    if (e.key == ' ') {
      this.expand();
    }
  }
}
