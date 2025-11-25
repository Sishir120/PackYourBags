export class RaceLogic {
    constructor(checkpoints) {
        this.checkpoints = checkpoints;
        this.finishedMarbles = [];
    }

    update(marbles) {
        for (const marble of marbles) {
            if (marble.isFinished) continue;

            // Checkpoint Detection
            // We assume checkpoints are sorted by Y and index matches
            const nextCpIndex = marble.currentCheckpointIndex;
            if (nextCpIndex < this.checkpoints.length) {
                const cp = this.checkpoints[nextCpIndex];

                // Simple Y-plane crossing
                if (marble.position.y >= cp.y) {
                    marble.currentCheckpointIndex++;

                    if (cp.isFinish) {
                        marble.isFinished = true;
                        marble.finishTime = Date.now();
                        this.finishedMarbles.push(marble);
                    }
                }
            }
        }

        // Ranking
        // 1. Finished marbles sorted by time
        // 2. Active marbles sorted by checkpoint index -> distance to next checkpoint (or just Y)

        marbles.sort((a, b) => {
            if (a.isFinished && b.isFinished) return a.finishTime - b.finishTime;
            if (a.isFinished) return -1;
            if (b.isFinished) return 1;

            if (a.currentCheckpointIndex !== b.currentCheckpointIndex) {
                return b.currentCheckpointIndex - a.currentCheckpointIndex;
            }

            return b.position.y - a.position.y;
        });

        // Assign ranks
        marbles.forEach((m, i) => m.rank = i + 1);
    }

    getLeader(marbles) {
        // Marbles are already sorted
        return marbles[0];
    }

    getWinner() {
        return this.finishedMarbles.length > 0 ? this.finishedMarbles[0] : null;
    }
}
