'use strict';

class Node {
  constructor(val, next) {
    this.val = val || null;
    this.next = next || null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  first(){
    return this.head;
  }

  push(value){
    if(this.head === null){
      this.head = new Node(value); 
    } else {
      let current = this.head;
      while(current.next !== null){
        current = current.next;
      }
      current.next = new Node(value);
    }
  }

  moveHeadForward(count) {
    let currentHead = this.head;
    let previous = null;
    while(count > 0 && currentHead.next !== null){
      if(currentHead === this.head){
        this.head = currentHead.next;
        previous = this.head;
      } else {
        previous.next = currentHead.next;
        previous = currentHead.next;
      }
     
      const newNext = currentHead.next.next;
      currentHead.next.next = currentHead;
      currentHead.next = newNext;
      
      count--;
    }
  }

  toString() {
    let str = '';
    let current = this.head;
    while(current !== null){
      str += `${current.val.id}, `;
      current = current.next;
    }
    return str;
  }
  
}

module.exports = LinkedList;