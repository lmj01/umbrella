import { resolve as resolveMap } from "@thi.ng/resolve-map";
import { fromInterval } from "@thi.ng/rstream/from/interval";
import { stream } from "@thi.ng/rstream/stream";
import { sync } from "@thi.ng/rstream/stream-sync";
import { resolve as resolvePromise } from "@thi.ng/rstream/subs/resolve";
import { updateDOM } from "@thi.ng/transducers-hdom";
import { add } from "@thi.ng/transducers/rfn/add";
import { conj } from "@thi.ng/transducers/rfn/conj";
import { transduce } from "@thi.ng/transducers/transduce";
import { map } from "@thi.ng/transducers/xform/map";
import { pluck } from "@thi.ng/transducers/xform/pluck";
import { throttleTime } from "@thi.ng/transducers/xform/throttle-time";

import { AppContext, Commit } from "../common/api";
import { header } from "../common/components/header";
import { link } from "../common/components/link";
import { repoTable } from "../common/components/repo-table";
import { ctx } from "../common/config";

const COMMITS_URL =
    process.env.NODE_ENV === "production" ?
        "./commits.json" :
        "/commits";

// UI root component
const app = (state) =>
    ["div",
        [header, ctx.repo.name],
        [stats, state],
        [repoTable, state.commits],
    ];

// stats container component
const stats = (ctx: AppContext, state) =>
    ["div", ctx.ui.stats.root,
        ["div.tl", ctx.ui.stats.col,
            [searchFilter, state]],
        ["div.tc", ctx.ui.stats.col,
            ["div", `Authors: ${state.authors}`],
            ["div", `Total adds: ${state.adds} (${state.avgAdds} avg / commit)`],
            ["div", `Total dels: ${state.dels} (${state.avgDels} avg / commit)`]
        ],
        ["div.tr", ctx.ui.stats.col,
            [link, { ...ctx.ui.stats.link, href: ctx.repo.url }, ctx.repo.url]
        ]
    ];

// search filter input component
const searchFilter = (ctx: AppContext, state) =>
    ["div",
        "Filter:",
        ["input", {
            ...ctx.ui.search,
            type: "text",
            value: state.search,
            // emit changes on `search` stream
            oninput: (e) => search.next(e.target.value.toLowerCase())
        }],
        `(${state.commits.length} commits)`
    ];

// transformation function to filter commits with search string
// doesn't apply filter if search term is empty
const filterCommits = ({ commits, search }) =>
    ({
        search,
        commits: search ?
            commits.filter((x) => x.msg.toLowerCase().indexOf(search) !== -1) :
            commits
    });

// transformation function to compute stats of filtered commits
// uses `resolve-map` package to execute given functions in dependency order
const computeStats = (state) => resolveMap({
    ...state,
    adds: ({ commits }) => transduce(map((x: Commit) => x.add || 0), add(), commits),
    dels: ({ commits }) => transduce(map((x: Commit) => x.del || 0), add(), commits),
    authors: ({ commits }) => transduce(pluck("author"), conj(), commits).size,
    avgAdds: ({ commits, adds }) => (adds / commits.length) | 0,
    avgDels: ({ commits, dels }) => (dels / commits.length) | 0
});

// error stream & handler
const error = stream();
error.subscribe({ next: (e) => alert(`An error occurred:\n${e}`) });

// commit log stream, reloads every 1h
const commits = fromInterval(60 * 60 * 1000)
    // fetch commits from server
    .transform(
        map(() => fetch(COMMITS_URL).then(
            (res) => res.ok ? res.json() : error.next("error loading commits"),
            (e) => error.next(e.message)
        ))
    )
    // the above transducer returns a promise
    // this next subscription resolves it and only then
    // passes the result downstream
    .subscribe(
        resolvePromise({ fail: (e) => error.next(e.message) })
    );

// stream of commit filter terms
const search = stream<string>();

// stream combinator & transformation into UI / DOM update
sync({
    // streams to synchronize
    src: {
        commits,
        // throttle search stream @ 10Hz (100ms) to minimize
        // UI lag for fast typists
        search: search.transform(throttleTime(100)),
    },
})
    // now transform the combined stream
    // each value is an object tuple of: `{ commits, search }`
    .transform(
        map(filterCommits),
        map(computeStats),
        // apply root component
        map(app),
        // apply hdom tree to real DOM
        updateDOM({ ctx })
    );

// manual kick off is needed here, since the above stream sync construct
// will only execute once all of its inputs have delivered a value.
// the other input `commits` is triggered automatically because it's
// tied to a timer
search.next("");
