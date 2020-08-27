
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
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac gravida massa. Maecenas at urna et lacus finibus lobortis. Vestibulum sed enim quam.",
        type: AvailableAlgorithmType.Dijkstra
    },
    {
        title: "Astar",
        description: "Suspendisse euismod ante massa, id mollis ante facilisis ut. Suspendisse fringilla posuere tellus, in hendrerit justo placerat vitae. Ut libero nulla, congue sit amet laoreet et, varius in enim. ",
        type: AvailableAlgorithmType.Astar
    }
];