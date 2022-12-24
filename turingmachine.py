#!/usr/bin/env python
import sys

class Tape:
    def __init__(self, original_word):
        self.current_position = 0
        self.tape = [*original_word, '_', '_']
    
    def try_move(self, direction):
        self.current_position += 1 if direction == 'R' else -1
        return self.current_position >= 0 and self.current_position < len(self.tape)

    def read_char(self):
        return self.tape[self.current_position]

    def write_char(self, char):
        self.tape[self.current_position] = char

class Edge:
    def __init__(self, read, write, direction, next_state):
        self.read = read
        self.write = write
        self.direction = direction
        self.next_state = next_state

class Node:
    def __init__(self, state, edges=None, is_halt=False, is_start=False):
        self.state = state
        self.is_halt = is_halt
        self.is_start = is_start
        self.edges = {} if edges is None else edges

    def merge_edges(self, other):
        self.edges.update(other.edges)

def parse_node(line):
    state, *edge_values = [val.strip() for val in line.split(',')]
    if len(edge_values) == 0:
        # halt node won't have any edges
        return Node(state, is_halt=True)
    edge = Edge(*edge_values)
    edges = {edge.read: edge}
    return Node(state, edges, is_start = 'Start' in state)
    

def read_nodes(file_path):
    with open(file_path, 'r') as f:
        # read comma separated values into a list
        f.readline() # skip first line
        nodes = {}
        start_node = None
        for line in f:
            node = parse_node(line)
            if node.state in nodes:
                nodes[node.state].merge_edges(node)
            else:
                nodes[node.state] = node
            if node.is_start:
                start_node = nodes[node.state]
        return start_node, nodes

def execute(tape, nodes, start_node, original_word):
    current_node = start_node
    for _ in range(1000): # if we exceed 1000 steps we're probably in an infinite loop?
        if current_node.is_halt:
            return f'Accepted: {original_word}'

        curr_char = tape.read_char()
        if curr_char not in current_node.edges:
            break # node doesn't have an edge to handle this state
        
        edge = current_node.edges[curr_char]
        tape.write_char(edge.write)
        if not tape.try_move(edge.direction):
            break # tape pointer went out of bounds

        if edge.next_state in nodes:
            current_node = nodes[edge.next_state]
        else:
            break # no node that matches this edge's next state

    return f"Rejected: {original_word}\n"

def main():
    file_path = sys.argv[1]
    original_word = sys.argv[2]

    tape = Tape(original_word)
    start_node, nodes = read_nodes(file_path)
    print(execute(tape, nodes, start_node, original_word))

if __name__ == '__main__':
    main()
