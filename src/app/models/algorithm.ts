
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
        description: "...",
        type: AvailableAlgorithmType.Dijkstra
    },
    {
        title: "Astar",
        description: "...",
        type: AvailableAlgorithmType.Astar
    }
];