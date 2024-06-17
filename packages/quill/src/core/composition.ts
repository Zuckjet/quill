import Embed from '../blots/embed.js';
import type Scroll from '../blots/scroll.js';
import Emitter from './emitter.js';

// const isChrome = window.navigator.userAgent.indexOf('Chrome') > -1;
const isSafari = window.navigator.userAgent.indexOf('Safari') > -1;
class Composition {
  isComposing = false;

  constructor(
    private scroll: Scroll,
    private emitter: Emitter,
  ) {
    this.setupListeners();
  }

  private setupListeners() {
    this.scroll.domNode.addEventListener('compositionstart', (event) => {
      if (!this.isComposing) {
        this.handleCompositionStart(event);
      }
    });

    this.scroll.domNode.addEventListener('compositionend', (event) => {
      if (this.isComposing) {
        // Webkit makes DOM changes after compositionend, so we use microtask to
        // ensure the order.
        // https://bugs.webkit.org/show_bug.cgi?id=31902
        if (isSafari) {
          // https://github.com/slab/quill/issues/3969 & https://github.com/slab/quill/pull/3972/files , 相关问题的issue和pr
          // 问题的更远目前是在safari上compositionend会在dom改变前就触发，导致过程中this.scroll.batch中收录的content则为空
          // 这个问题处理后问题依然存在（ui上正常，但getContents会获取为空），调整成setTimeout目前能解决问题
          setTimeout(() => {
            this.handleCompositionEnd(event);
          }, 0);
        } else {
          queueMicrotask(() => {
            this.handleCompositionEnd(event);
          });
        }
      }
    });
  }

  private handleCompositionStart(event: CompositionEvent) {
    const blot =
      event.target instanceof Node
        ? this.scroll.find(event.target, true)
        : null;

    if (blot && !(blot instanceof Embed)) {
      this.emitter.emit(Emitter.events.COMPOSITION_BEFORE_START, event);
      this.scroll.batchStart();
      this.emitter.emit(Emitter.events.COMPOSITION_START, event);
      this.isComposing = true;
    }
  }

  private handleCompositionEnd(event: CompositionEvent) {
    this.emitter.emit(Emitter.events.COMPOSITION_BEFORE_END, event);
    this.scroll.batchEnd();
    this.emitter.emit(Emitter.events.COMPOSITION_END, event);
    this.isComposing = false;
  }
}

export default Composition;
