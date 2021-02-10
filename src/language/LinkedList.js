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

  // Find Node with value val and move it down (away from head) one position
  moveDown(node) {

    let previousNode = null;
    let currentNode = this.head;

    // TODO need to be setting node.val.next too

    while (currentNode !== null) {

      if (currentNode.val.id === node.val.id) {

        let nextNodeCopy = currentNode.next;

        
        if (previousNode === null) {

          currentNode.next     = currentNode.next.next;
          currentNode.val.next = currentNode.next.val.id;  

          nextNodeCopy.next     = currentNode;
          nextNodeCopy.val.next = nextNodeCopy.next.val.id; 

          this.head          = nextNodeCopy;
          this.head.val.next = this.head.next.val.id;    

          return;
        }

        
        if (currentNode.next === null) {
          return;
        }

       
        currentNode.next     = currentNode.next.next;
        currentNode.val.next = currentNode.next.val.id;  // DB next

        nextNodeCopy.next     = currentNode;
        nextNodeCopy.val.next = nextNodeCopy.next.val.id; // DB next

        previousNode.next     = nextNodeCopy;
        previousNode.val.next = previousNode.next.val.id; // DB next

        return;
      }

      previousNode = currentNode;
      currentNode = currentNode.next;
    }
  }

  insertFirst(item) {

    if (!this.head) {
      this.head = new Node(item, null);
    } else {
      this.head = new Node(item, this.head);
    }
  }

  insertLast(item) {

    if (!this.head) {
      return this.insertFirst(item);
    }

    let currentNode = this.head;

    while (currentNode.next !== null) {
      currentNode = currentNode.next;
    }

    const newNode = new Node(item, null);

    currentNode.next = newNode;
    currentNode.val.next = newNode.val.id;

  }
}

module.exports = LinkedList;