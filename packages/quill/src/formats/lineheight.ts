import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.BLOCK,
  whitelist: ['1', '1.5', '1.6', '1.75', '2', '2.5', '3', '4'],
};

class LineHeightClass extends ClassAttributor {
  add(node: HTMLElement, value: any) {
    if (!this.canAdd(node, value)) return false;
    this.remove(node);
    const underscoredValue = value.replace('.', '_');
    node.classList.add(`${this.keyName}-${underscoredValue}`);
    return true;
  }
}

const LineHeight = new LineHeightClass('line-height', 'ql-line-height', config);

export default LineHeight;
