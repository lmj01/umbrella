/**
 * Typed array based Disjoint Set implementation with quick union and
 * path compression, after Sedgewick & Wayne.
 *
 * - https://en.wikipedia.org/wiki/Disjoint-set_data_structure
 * - https://algs4.cs.princeton.edu/lectures/15UnionFind-2x2.pdf
 */
export class DisjointSet {
    roots: Uint32Array;
    ranks: Uint8Array;
    count: number;

    /**
     * Creates new instance with `n` initial singular subsets.
     *
     * @param n
     */
    constructor(n: number) {
        const roots = (this.roots = new Uint32Array(n));
        this.ranks = new Uint8Array(n).fill(0);
        this.count = n;
        for (let i = 0; i < n; ++i) {
            roots[i] = i;
        }
    }

    /**
     * Returns canonical ID (tree root) for given `id`. Unless `id`
     * already is unified with some other ID, this will always return
     * `id` itself (since each node is initially its own root).
     *
     * @param id
     */
    canonical(id: number) {
        const roots = this.roots;
        while (id !== roots[id]) {
            id = roots[id] = roots[roots[id]];
        }
        return id;
    }

    /**
     * Connects combines the trees of the given two node IDs and returns
     * the new resulting canonical tree root ID.
     *
     * @param a
     * @param b
     */
    union(a: number, b: number) {
        const rootA = this.canonical(a);
        const rootB = this.canonical(b);
        if (rootA === rootB) {
            return rootA;
        }
        this.count--;
        const ranks = this.ranks;
        const ra = ranks[rootA];
        const rb = ranks[rootB];
        if (ra < rb) {
            return (this.roots[rootA] = rootB);
        }
        ra === rb && ranks[rootA]++;
        return (this.roots[rootB] = rootA);
    }

    /**
     * Returns true, if the given two nodes belong to the same tree /
     * subset.
     *
     * @param a
     * @param b
     */
    unified(a: number, b: number) {
        return this.canonical(a) === this.canonical(b);
    }

    /**
     * Returns a `Map` of all subsets (connected components) with their
     * canonical tree root IDs as keys and arrays of node IDs as values.
     * If only the number of subsets is required, use the `count`
     * property of this class instance instead (O(1), updated with each
     * call to `union()`).
     */
    subsets() {
        const sets: Map<number, number[]> = new Map();
        const roots = this.roots;
        for (let i = roots.length; --i >= 0; ) {
            let id = i;
            while (id !== roots[id]) {
                id = roots[roots[id]];
            }
            const s = sets.get(id);
            if (s) {
                s.push(i);
            } else {
                sets.set(id, [i]);
            }
        }
        return sets;
    }
}