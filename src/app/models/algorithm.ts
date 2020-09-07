
export enum AvailableAlgorithmType {
    Dijkstra = "Dijkstra",
    Astar = "Astar"
}

export class AvailableAlgorithm {
    title: string;
    description: string;
    type: AvailableAlgorithmType;
}

export const availableAlgorithms: AvailableAlgorithm[] = [
    {
        title: "Dijkstra",
        description: "This algorithm find the shortest path between two nodes in a graph without knowing the destination. It searchs around the source in any direction.",
        type: AvailableAlgorithmType.Dijkstra
    },
    {
        title: "Astar",
        description: "This algorithm add a small extension to dijkstra's algorithm. Because we know the destination position, we can target in a specific direction. It is a bit more optimal.",
        type: AvailableAlgorithmType.Astar
    }
];