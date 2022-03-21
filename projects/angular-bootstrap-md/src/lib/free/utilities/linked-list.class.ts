export class LinkedList<T> {
  length = 0;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  protected head: any;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  protected tail: any;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  protected current: any;
  protected asArray: T[] = [];

  get(position: number) {
    if (this.length === 0 || position < 0 || position >= this.length) {
      return void 0;
    }

    let current = this.head;

    for (let index = 0; index < position; index++) {
      current = current.next;
    }

    return current.value;
  }

  add(value: T, position: number = this.length): void {
    if (position < 0 || position > this.length) {
      throw new Error('Position is out of the list');
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const node: any = {
      value,
      next: undefined,
      previous: undefined
    };

    if (this.length === 0) {
      this.head = node;
      this.tail = node;
      this.current = node;
    } else {
      if (position === 0) {
        // first node
        node.next = this.head;
        this.head.previous = node;
        this.head = node;
      } else if (position === this.length) {
        // last node
        this.tail.next = node;
        node.previous = this.tail;
        this.tail = node;
      } else {
        // node in middle
        const currentPreviousNode = this.getNode(position - 1);
        const currentNextNode = currentPreviousNode.next;

        currentPreviousNode.next = node;
        currentNextNode.previous = node;

        node.previous = currentPreviousNode;
        node.next = currentNextNode;
      }
    }
    this.length++;
    this.createInternalArrayRepresentation();
  }

  remove(position = 0): void {
    if (this.length === 0 || position < 0 || position >= this.length) {
      throw new Error('Position is out of the list');
    }

    if (position === 0) {
      // first node
      this.head = this.head.next;

      if (this.head) {
        // there is no second node
        this.head.previous = undefined;
      } else {
        // there is no second node
        this.tail = undefined;
      }
    } else if (position === this.length - 1) {
      // last node
      this.tail = this.tail.previous;
      this.tail.next = undefined;
    } else {
      // middle node
      const removedNode = this.getNode(position);
      removedNode.next.previous = removedNode.previous;
      removedNode.previous.next = removedNode.next;
    }

    this.length--;
    this.createInternalArrayRepresentation();
  }

  set(position: number, value: T): void {
    if (this.length === 0 || position < 0 || position >= this.length) {
      throw new Error('Position is out of the list');
    }

    const node = this.getNode(position);
    node.value = value;
    this.createInternalArrayRepresentation();
  }

  toArray(): T[] {
    return this.asArray;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  findAll(fn: any): any[] {
    let current = this.head;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const result: any[] = [];
    for (let index = 0; index < this.length; index++) {
      if (fn(current.value, index)) {
        result.push({index, value: current.value});
      }
      current = current.next;
    }

    return result;
  }

  // Array methods overriding start
  push(...args: T[]): number {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    args.forEach((arg: any) => {
      this.add(arg);
    });

    return this.length;
  }

  pop() {
    if (this.length === 0) {
      return undefined;
    }
    const last = this.tail;
    this.remove(this.length - 1);

    return last.value;
  }

  unshift(...args: T[]): number {
    args.reverse();
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    args.forEach((arg: any) => {
      this.add(arg, 0);
    });

    return this.length;
  }

  shift() {
    if (this.length === 0) {
      return undefined;
    }
    const lastItem = this.head.value;
    this.remove();

    return lastItem;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  forEach(fn: any): void {
    let current = this.head;
    for (let index = 0; index < this.length; index++) {
      fn(current.value, index);
      current = current.next;
    }
  }

  indexOf(value: T): number {
    let current = this.head;
    let position = 0;

    for (let index = 0; index < this.length; index++) {
      if (current.value === value) {
        position = index;
        break;
      }
      current = current.next;
    }

    return position;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  some(fn: any): boolean {
    let current = this.head;
    let result = false;
    while (current && !result) {
      if (fn(current.value)) {
        result = true;
        break;
      }
      current = current.next;
    }

    return result;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  every(fn: any): boolean {
    let current = this.head;
    let result = true;
    while (current && result) {
      if (!fn(current.value)) {
        result = false;
      }
      current = current.next;
    }

    return result;
  }

  toString(): string {
    return '[Linked List]';
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  find(fn: any) {
    let current = this.head;
    let result;
    for (let index = 0; index < this.length; index++) {
      if (fn(current.value, index)) {
        result = current.value;
        break;
      }
      current = current.next;
    }

    return result;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  findIndex(fn: any) {
    let current = this.head;
    let result;
    for (let index = 0; index < this.length; index++) {
      if (fn(current.value, index)) {
        result = index;
        break;
      }
      current = current.next;
    }

    return result;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  protected getNode(position: number): any {
    if (this.length === 0 || position < 0 || position >= this.length) {
      throw new Error('Position is out of the list');
    }

    let current = this.head;

    for (let index = 0; index < position; index++) {
      current = current.next;
    }

    return current;
  }

  protected createInternalArrayRepresentation(): void {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const outArray: any[] = [];
    let current = this.head;

    while (current) {
      outArray.push(current.value);
      current = current.next;
    }
    this.asArray = outArray;
  }

  // Array methods overriding END
}
