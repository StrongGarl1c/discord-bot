export class Queue {
  constructor() {
    this.state = [];
  }

  addElement(element) {
    this.state.unshift(element);
    console.log(this.state);
  }

  removeElement() {
    this.state = this.state.filter((item, index) => {
      return index !== this.state.length - 1 && item;
    });
    console.log(this.state);
  }

  nextSong() {
    return this.state.length ? this.state[this.state.length - 1] : undefined;
  }
}

export default new Queue();
